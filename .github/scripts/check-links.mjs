#!/usr/bin/env node
/**
 * Internal markdown link checker.
 *
 * Validates, across every tracked *.md file:
 *   - relative file links            [x](docs/foo.md)      -> the file exists
 *   - in-page heading anchors        [x](#some-heading)    -> the heading exists here
 *   - cross-file heading anchors     [x](docs/foo.md#bar)  -> file exists AND heading exists there
 *
 * External URLs (http/https/mailto/tel) are deliberately NOT checked here — they
 * fail for reasons outside this repository and must never turn a docs PR red.
 * They are covered by the scheduled `external-links` job instead.
 *
 * Anchors are generated with `github-slugger`, the same library GitHub's own
 * markdown pipeline uses. This matters: a decorative emoji in a heading is
 * stripped but its trailing space is not, so "## 🇪🇸 Versión" yields the anchor
 * "#-versión" with a leading hyphen. Removing the emoji later silently breaks
 * every link pointing at it — with no error and no redirect, just a jump to the
 * top of the page. That is the exact regression this check exists to prevent.
 *
 * Link extraction is regex-based, not a full CommonMark parse. It handles fenced
 * and inline code, link titles, angle-bracket targets, images and reference
 * definitions, which covers everything in this repository. Exotic constructs
 * (links split across lines, HTML-embedded markdown) may be missed.
 *
 * Usage:  node .github/scripts/check-links.mjs [--quiet]
 * Exit:   0 = every internal link resolves, 1 = at least one is broken
 */

import { readFileSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve, relative, join } from 'node:path';
import GithubSlugger from 'github-slugger';

const ROOT = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const QUIET = process.argv.includes('--quiet');

/** Every markdown file git knows about (respects .gitignore, skips node_modules). */
function markdownFiles() {
  return execFileSync('git', ['ls-files', '*.md', '**/*.md'], { cwd: ROOT, encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);
}

/**
 * Blank out fenced code blocks, and optionally inline code, preserving line
 * count so that reported line numbers stay accurate.
 *
 * `inlineToo` must be false when collecting heading anchors: a heading such as
 * "### `outputSchema`" is entirely inline code, and blanking it would yield an
 * empty slug and report every correct link to it as broken. GitHub renders the
 * backticks as <code> and slugs the text inside them.
 */
function stripCode(src, inlineToo = true) {
  const lines = src.split('\n');
  let fence = null;
  const out = lines.map((line) => {
    const open = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (fence) {
      if (open && open[1][0] === fence[0] && open[1].length >= fence.length) fence = null;
      return '';
    }
    if (open) {
      fence = open[1];
      return '';
    }
    return inlineToo ? line.replace(/`[^`\n]*`/g, (m) => ' '.repeat(m.length)) : line;
  });
  return out.join('\n');
}

/** Anchors GitHub will actually generate for a file: headings + explicit HTML ids. */
function anchorsFor(absPath) {
  const src = stripCode(readFileSync(absPath, 'utf8'), false);
  const slugger = new GithubSlugger();
  const anchors = new Set();

  // ATX headings, in document order (order matters: the slugger de-duplicates).
  for (const m of src.matchAll(/^\s{0,3}#{1,6}[ \t]+(.+?)[ \t]*#*[ \t]*$/gm)) {
    // Strip inline markdown so "## **Bold** `code`" slugs like GitHub renders it.
    const text = m[1]
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // links/images -> their text
      .replace(/[*_~`]/g, '')
      .trim();
    anchors.add(slugger.slug(text));
  }

  // Explicit anchors authors sometimes hand-write.
  for (const m of src.matchAll(/<(?:a|div|span|h[1-6])\b[^>]*\b(?:name|id)\s*=\s*["']([^"']+)["']/gi)) {
    anchors.add(m[1]);
  }

  return anchors;
}

/** Extract every link target with its line number. */
function linksIn(src) {
  const found = [];
  const record = (target, index) => {
    const line = src.slice(0, index).split('\n').length;
    found.push({ target: target.trim(), line });
  };

  // Inline links and images: [text](target "title") / ![alt](<target>)
  for (const m of src.matchAll(/!?\[(?:[^\][]|\[[^\][]*\])*\]\(\s*(<[^>]*>|[^\s)]+)(?:\s+["'][^"']*["'])?\s*\)/g)) {
    record(m[1].replace(/^<|>$/g, ''), m.index);
  }
  // Reference definitions: [id]: target "title"
  for (const m of src.matchAll(/^\s{0,3}\[[^\]]+\]:\s*(<[^>]*>|\S+)/gm)) {
    record(m[1].replace(/^<|>$/g, ''), m.index);
  }
  return found;
}

const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

const anchorCache = new Map();
function cachedAnchors(absPath) {
  if (!anchorCache.has(absPath)) anchorCache.set(absPath, anchorsFor(absPath));
  return anchorCache.get(absPath);
}

const problems = [];
const files = markdownFiles();
let checked = 0;

for (const file of files) {
  const abs = join(ROOT, file);
  const src = stripCode(readFileSync(abs, 'utf8'));

  for (const { target, line } of linksIn(src)) {
    if (!target || EXTERNAL.test(target)) continue;

    const hashAt = target.indexOf('#');
    const rawPath = hashAt === -1 ? target : target.slice(0, hashAt);
    const rawFrag = hashAt === -1 ? '' : target.slice(hashAt + 1);

    let fragment = '';
    if (rawFrag) {
      try {
        fragment = decodeURIComponent(rawFrag);
      } catch {
        fragment = rawFrag; // malformed percent-encoding: compare literally
      }
    }

    checked++;
    const at = `${file}:${line}`;

    // Pure in-page anchor.
    if (!rawPath) {
      if (!cachedAnchors(abs).has(fragment)) {
        problems.push({ at, target, why: `no heading in this file produces the anchor #${fragment}` });
      }
      continue;
    }

    // Relative path (optionally with a fragment).
    let targetAbs;
    try {
      targetAbs = resolve(dirname(abs), decodeURIComponent(rawPath));
    } catch {
      targetAbs = resolve(dirname(abs), rawPath);
    }

    if (!existsSync(targetAbs)) {
      problems.push({ at, target, why: `file not found: ${relative(ROOT, targetAbs)}` });
      continue;
    }
    if (!fragment) continue;
    if (statSync(targetAbs).isDirectory()) {
      problems.push({ at, target, why: 'fragment points at a directory' });
      continue;
    }
    if (!targetAbs.endsWith('.md')) continue; // cannot introspect non-markdown

    if (!cachedAnchors(targetAbs).has(fragment)) {
      problems.push({
        at,
        target,
        why: `no heading in ${relative(ROOT, targetAbs)} produces the anchor #${fragment}`,
      });
    }
  }
}

if (!QUIET || problems.length) {
  console.log(`Checked ${checked} internal link(s) across ${files.length} markdown file(s).`);
}

if (problems.length) {
  console.error(`\n${problems.length} broken internal link(s):\n`);
  for (const p of problems) {
    console.error(`  ${p.at}`);
    console.error(`    -> ${p.target}`);
    console.error(`       ${p.why}\n`);
  }
  console.error('Heading anchors follow GitHub\'s slug rules: lowercase, punctuation dropped,');
  console.error('spaces become hyphens. Editing a heading changes its anchor and silently');
  console.error('breaks links to it — update the links in the same commit.\n');
  process.exit(1);
}

console.log('All internal links resolve.');
