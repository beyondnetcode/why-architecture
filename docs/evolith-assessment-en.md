# Evolith — Assessment: what works, what fails, what to do

> **Bilingual navigation:** [Versión en Español](evolith-diagnostico-es.md) · **Unfamiliar term?** [AI-native Glossary](glossary-ai-native-en.md)
>
> **Companion documents:** the [Career Path](evolith-ai-career-path-en.md) says *what to learn*; the [Positioning](evolith-suite-positioning-en.md) says *who you compete against*. **This one says what exists, what is broken, and in what order to fix it.**
>
> **Basis:** source inspection by five parallel assessors, one per component, plus a whole-product synthesis and a SWOT. Every finding carries its evidence: file, [ADR](glossary-ai-native-en.md#adr-architecture-decision-record) or count. Date: 2026-07-26.

---

## Contents

- [How to read this](#how-to-read-this)
- [Scorecard](#scorecard)

**By component**
1. [Evolith Core](#1-evolith-core)
2. [Evolith Tracker](#2-evolith-tracker)
3. [Evolith CLI](#3-evolith-cli)
4. [Evolith MCP](#4-evolith-mcp)
5. [Evolith Agent Runtime](#5-evolith-agent-runtime)

**As a product**
6. [The suite](#6-the-suite)
7. [SWOT](#7-swot)
8. [Plan: what to do, in what order](#8-plan-what-to-do-in-what-order)
9. [Methodology and one correction](#9-methodology-and-one-correction)

---

## How to read this

Every component follows the same structure: **what it does well** (evidenced, because you need to know what to build on), **what it does badly** (ranked by consequence, not by ease of description), **what to improve** (with the concrete how and the effort), and **the one thing** if only one fits.

One reading rule, because it changes the meaning of everything below: **almost nothing that fails is a design failure.** The dominant pattern is *correct, tested, unwired code*. That is good news — it is fixed in weeks, not quarters — and bad news: it means the product has spent months looking more complete than it is.

---

## Scorecard

Scores 1 to 5. **D**=design · **I**=implementation · **O**=operational readiness · **C**=defensibility against a competitor.

| Component | Verdict in one line | D | I | O | C | The one thing |
|---|---|:-:|:-:|:-:|:-:|---|
| **Core** | Boundaries and failure modes well designed, but **91 "blocking" rules execute nothing** and the audit trail is written blank | 4 | 2 | 3 | 2 | Demote the 91 phantom rules and populate the mapper |
| **Tracker** | The most serious code in the suite — DB-enforced immutable audit, 12 robots that bite in CI — yet **the agent ledger is written, tested and absent from DI** | 4 | 3 | 2 | 2 | Wire the ledger and **type the actor** |
| **CLI** | Well-designed machine contract **undermined by false greens**: five commands print a menu and exit 0 | 4 | 3 | 2 | 3 | Machine mode that never prompts + exit-code taxonomy |
| **[MCP](glossary-ai-native-en.md#mcp)** | The most rigorously governed MCP server I have read — and **15 of its 50 tools are denied today** by its own compiled policy | 4 | 2 | 3 | 2 | One manifest generating rego, catalogue and schemas |
| **Agent Runtime** | The best engineering in the suite, **wrapped around almost no agent**: 7 skills, none requiring approval, empty index | 4 | 2 | 3 | 2 | Manifest-derived skill catalogue (7 → 16) |

**How to read the scorecard:** design sits at 4 across all five. Implementation at 2-3. Operational readiness and defensibility at 2-3. **That is not a badly designed product: it is a well-designed product that has not finished being wired.**

---

# By component

## 1. Evolith Core

> **Verdict:** the engine is well built and certifies far less than it appears to.

### 1.1 What it does well

| Strength | Evidence | Why it was the right call |
|---|---|---|
| **The stateless boundary is real** | `evaluation-orchestrator.service.ts` is 120 lines; `binding: false` is a literal type. ADR-0101 **explicitly corrects an altitude error** in ADR-0100: you had promoted `Producto`/`Iniciativa` into Core and reversed it | It is why one engine embeds in CLI, [MCP](glossary-ai-native-en.md#mcp) and REST **without three state models**. The reversal is the most valuable architectural act in the repo |
| **It fails closed, with the reasoning written down** | `opa-evaluator.ts:75-81` (missing `policy.wasm` → all rules `failed`, not skipped); `shell-enforcer-adapter.ts:57-66` **throws**, commented "a tool that produced no parseable report never certified anything"; GT-569 stopped downgrading exceptions to `skipped` | Three places where the easy choice was a false pass and you took the hard one |
| **The verdict reports its own denominator** | `ruleset-validator.service.ts:111-116` emits `rulesChecked/Skipped/Errored/Total` plus the IDs | Almost no governance tool tells you **what it did not check**. It is what makes §1.2 discoverable at all |
| **Dual-engine parity is enforced by machinery, not habit** | `.github/workflows/opa-parity.yml` sweeps daily; GT-556/557/558 record **a parity gate that silently widened its own scope and exited 0 — found and killed** | Rare discipline: you killed a self-certifying test |
| **Violation identity survives tool churn** | `violation.ts` fingerprints on path+rule+tool+coords and **excludes `message`** | A [dependency-cruiser](glossary-ai-native-en.md#archunit--deptrac--dependency-cruiser--import-linter) upgrade does not churn baselines. Precondition for any accumulation being worth anything in a year |
| **Normalising OSS output instead of building an extractor** | `ownership.ts` (longest prefix over Backstage/Port/Cortex), `compliance.ts` (catalogue as **versioned data**) | It saved you 18 months you did not have |

### 1.2 What it does badly

| # | Defect | Evidence | Consequence |
|---|---|---|---|
| **1** | **91 blocking rules enforce nothing** | Of 126 generated, 91 are `blocking:true, enforcement:"executable"` and all 91 contain the literal string *"Concrete checks to be wired into the [harness](glossary-ai-native-en.md#harness)"*. `NativeEvaluator` finds no handler → `skipped` | A prospect reads "126 rules, 91 blocking" and finds 41 hand-written files doing the work. **They find it with a grep in ten minutes**, and that credibility loss is not undone by a later fix |
| **2** | **Three traceability fields always empty, and two consumers read them** | `canonical-result.mapper.ts:130,133,134` set `rulesExecuted: []`, `risks: []`, `missingEvidence: []` unconditionally. `sarif-exporter.ts:256` and `drift-gate.ts:203` derive from them | **Every [SARIF](glossary-ai-native-en.md#sarif) file and every evidence manifest you emit today says "0 rules evaluated".** The audit graph that is the moat is being written blank |
| **3** | **The trail records the wrong engine** | `canonical-result.mapper.ts:72` hardcodes `engine: 'opa'` regardless of which ran | In a product whose dual-engine parity is a selling point, the artifact that would prove it **falsifies half its records** |
| **4** | **Five enforcement adapters, one authored ruleset** | All five wired across three surfaces. Only `adr-0002-hexagonal.rules.json` authors `enforce:` blocks — 6 rules, **all dependency-cruiser** | The cross-language promise is adapter code with no corpus. **A .NET prospect gets zero rules** |
| **5** | **ADR-0111 is `Proposed` with zero adapters** | No `IStructuralReviewer` implementation in `src/`; `TenantQualitySignalRegistry` never instantiated outside tests | The sanctioned seam for admitting AI is a correctly-shaped socket with nothing plugged in |
| **6** | **The OPA toolchain is 18 months behind and the artifact is committed** | `compile-opa-wasm.mjs` downloads v0.65.0; upstream is 1.18.2 (a major Rego break). `policy.wasm` is a binary in git; ADR-0085's distribution paths are wired in zero CI steps | You cannot adopt modern Rego, and the day a CVE lands you ship a blob you cannot rebuild under review |
| **7** | **`kinds` does not scope the evaluation** | `:39` runs the full pipeline before reading `ctx.kinds`; `:51` silently drops kinds with no evaluator (`evidence`, `rule`) | A caller asking only for `topology` receives a global verdict set by gates it never requested |

### 1.3 What to improve

| # | Fix | How | Effort |
|---|---|---|---|
| 1 | Demote the 91 rules to `blocking:false, enforcement:"advisory"` and add a CI gate rejecting `blocking && executable` with no handler or `.rego` | Amend `generate-adr-rulesets.mjs` + a test | 3 days |
| 2 | Populate `rulesExecuted` and the real `engine` in the mapper | Pass the evaluator's result through instead of literals | 1 week |
| 3 | Author an `enforce:` corpus for at least one more language | One import-linter ruleset (Python), one NetArchTest (.NET) | 2 weeks |
| 4 | Decide the OPA chain: move to 1.x or vendor 0.65 deliberately | The 32 `.test.rego` files are the migration harness | 2-3 weeks |
| 5 | Scope by `kinds` before executing | Filter at `:39`; explicit error for a kind with no evaluator | 3 days |

### 1.4 The one thing

**Fixes 1 and 2, together.** The first removes the most falsifiable claim in the product; the second makes what gets written from tomorrow worth something. Today Core **decides well and records blank**.

---

## 2. Evolith Tracker

> **Verdict:** the most serious code in the suite, still unable to answer the question the product sells.

### 2.1 What it does well

| Strength | Evidence | Why it matters |
|---|---|---|
| **Audit immutability enforced by the database, not by convention** | Migration `20260719202323_MakeAuditEntriesAppendOnly.cs`: UPDATE/DELETE/**TRUNCATE** triggers plus a REVOKE, with an in-migration comment explaining **why the REVOKE alone is insufficient** (owners ignore their own grants) and what it still does not cover (`DROP TABLE`) | A log the application can modify is not evidence. **In a governance product that property *is* the product** |
| **RoboSoft is not a test suite: it is a deployment gate that bites** | 12 robots, 1,632 LOC, zero dependencies, **108 assertions**. `deploy-check.yml:96` runs them against **real kind + Helm + Postgres**, between a local deploy and a production one; then `verify-failclosed` proves `dev-bypass` is unreachable in the production image | **It is the single best engineering artefact in either repo.** Behaviour-level proof of governance semantics against real infrastructure, not mocks |
| **The [HITL](glossary-ai-native-en.md#hitl-human-in-the-loop) channel has genuinely opposed identities** | `/runtime-approvals` bound **by scheme name** to machine auth (which is what makes `dev-bypass` unreachable); `/resolve` humans only; the Core ships **no grant method at all** (GT-441); tenant from the key claim, never the body; idempotency by `correlationId` | If the requester can also grant, the human gate is decorative. Here it cannot |
| **[Provenance](glossary-ai-native-en.md#provenance) promoted to columns for the right reason** | T-048 moved `dimension` and `determinism` out of the jsonb, arguing that a policy requiring a dimension must be able to *find* it | `determinism` (deterministic measurement vs probabilistic estimate) is exactly what an audit asks about |
| **Real scale** | 92 migrations, 45 tables across 7 schemas, **915 `[Fact]`/`[Theory]` in 163 files**, hexagonal layering with an architecture-test solution filter | — |

### 2.2 What it does badly

| # | Defect | Evidence | Consequence |
|---|---|---|---|
| **1** | **The agent-turn ledger is complete, tested and unwired** | `AgentExecutionService.cs` does exactly the right thing — validates scope, **audits before executing and aborts the turn if the audit write fails** — and `IAgentExecutionPort` appears in **zero DI registrations and zero endpoints**. `AssistantEndpoints.cs` proxies straight past it and **persists nothing** | Every agent turn that has ever run is unrecorded. **The product's differentiating claim is currently false in code that is 90% written** |
| **2** | **`audit_entries.actor_id` is a bare `Guid`** | `AuditEntryProps.cs:11`. No `actor_type`, no agent/model/session id | Even once the ledger is wired, every row is ambiguous — and **because the table is [append-only](glossary-ai-native-en.md#append-only) by trigger, it cannot be backfilled**. Every day produces permanently untyped history |
| **3** | **The evidence graph is a list nobody traverses** | `References` is `List<string>` in jsonb; the only non-test consumer is a `Contains()` for dedup. No edge table, no type, no depth query | "Which [ADR](glossary-ai-native-en.md#adr-architecture-decision-record) moved because of which gate decision because of which agent turn" is **unanswerable**, and that chain is the stated moat |
| **4** | **`repository_revision` is stored and never read as a series** | Only `GET /` and `GET /{id}`. No query by repo, no ordering by revision, no diff | The perfect substrate for drift exists and **produces no drift signal** |
| **5** | **Telemetry off by default, with no attributes** | `TrackerTracing.cs` returns early and **registers nothing** when `Otlp:Endpoint` is empty (the default). Zero `StartActivity` in production | There is no way to reconstruct the narrative afterwards |
| **6** | **Systemic doc drift** | Badge says 30 decisions (they run to T-054); the data design declares 10 schemas/33 tables against **7/45 real**, naming five schemas that **do not exist**; the robosoft README says 3 robots against 12 | Due diligence reads the design doc and finds five nonexistent schemas |

### 2.3 What to improve

| # | Fix | How | Effort |
|---|---|---|---|
| 1 | **Wire `AgentExecutionService` + type the actor** | Register `IAgentExecutionPort` in DI; route `AssistantEndpoints` through it; migration adding `actor_type`, `agent_id`, `model_id`, `session_id`; extend `audit-trail.robot.mjs` | **2 weeks** |
| 2 | Promote `references` to a typed `evidence_edges` table | Table with indexes both ways; backfill; `GET /{id}/graph?depth=n` | 3 weeks |
| 3 | Turn `core_evaluation_transactions` into a revision series | `GET ?repositoryUrl=&since=`; a `verdict` projection column; a `DriftDetected` row when the verdict changes between revisions | 2-3 weeks |
| 4 | Turn telemetry on with domain attributes | `Otlp:Endpoint` in the configmap; `StartActivity` with tenant/initiative/agent | 1 week |
| 5 | Reconcile the data design and badges with the code | Regenerate from the model snapshot | 3 days |

### 2.4 The one thing

**Fix 1.** Not the deployment, and the reasoning is **ordering, not size**: the table is immutable at the database level, so rows written before `actor_type` exists **can never be corrected**. It is two weeks on code that is already written and unit-tested.

---

## 3. Evolith CLI

> **Verdict:** a good machine contract, undermined by a class of defect that manufactures false greens.

### 3.1 What it does well

| Strength | Evidence |
|---|---|
| **The ADR-0073 envelope is real and shared** | 30 of 35 commands can emit it; `error.code` — not HTTP status — is the contract across CLI, [MCP](glossary-ai-native-en.md#mcp) and REST |
| **`makeStdioBlocking()` is a sophisticated fix** | Node buffers pipe writes; any `process.exit()` truncates at 64 KiB and turns a large envelope into unparseable JSON. Fixed once, centrally. **Most CLIs never find this bug** |
| **Edit-time enforcement works — verified live** | `enforce edit` normalises a vendor-agnostic payload and exits **2** to veto. Real test: a domain file importing infrastructure → `EXIT=2`, [stderr](glossary-ai-native-en.md#stdout--stderr) `HXA-01 [ADR-0002]`. **It is the most defensible thing in the package** |
| **The catalogue generator cannot drift** | It boots the real MCP server over stdio, performs the JSON-RPC handshake and writes the catalogue. Counts are `TOOLS.length`, never literals |
| **Unusually honest test hygiene** | The header of `surface-parity.e2e-spec.ts` documents removing soft assertions that let GT-452/GT-474 regress green, and states that GT-223's "DONE" is inaccurate |

### 3.2 What it does badly

| # | Defect | Evidence | Consequence |
|---|---|---|---|
| **1** | **False greens: interactive menu on stdout, exit 0, under `--format json`** | Verified live with stdin closed: `adr`, `standards`, `agents`, `satellite:create` and `sdlc handoff` each render a Spanish `@clack` menu with ANSI **on stdout** and **exit 0** | A CI step pipes to `jq`, gets garbage, reads exit 0 and **goes green on a repo that was never evaluated**. A governance tool that manufactures false assurance is worse than none |
| **2** | **Exit codes cannot separate verdict from tool failure** | 20 `process.exit(1)` and 78 `process.exitCode = 1`; the only other code is the edit hook's 2. Verified: `gate evaluate` against an unreachable Core exits **1** — byte-identical to a real `GATE_BLOCKED` | **The product is throwing away the one distinction that constitutes its value** |
| **3** | **`api --inspect` is dead for all 50 tools** | The generated catalogue contains `inputSchema` **zero times**; the hand-written `TOOL_SCHEMAS` hold 3 entries and **none exists** among the 50 real ones. `api --inspect gate-evaluate` returns **a success envelope with a fabricated schema for a nonexistent tool** | The self-discovery surface **actively misleads agents** |
| **4** | **`waiver` — the command that cancels a verdict — sits outside the contract** | No `--format` at all; prints a raw array with no `success`, no `meta`, no `correlationId` | The one action that **cancels** governance is the one the Tracker cannot ingest or correlate |
| **5** | **`chat` is one RPC call marketed as a REPL** | 91 lines: print, one call, print, exit. No loop, no session | Any buyer finds it in 30 seconds |
| **6** | **The English guide is written in Spanish** | `using-the-cli.md` | **The OSS wedge has no English documentation to adopt from** |

### 3.3 What to improve

| # | Fix | How | Effort |
|---|---|---|---|
| 1 | **Machine mode never prompts + exit taxonomy** | In `BaseEvolithCommand`: refuse any prompt when `format==='json'` or there is no TTY → error envelope + non-zero. Map: 0 pass · 1 tool failure · 2 blocked verdict · 3 invalid input. Replace all 98 ones | 1-2 weeks |
| 2 | Generate schemas, retire `TOOL_SCHEMAS` | The generator already receives `inputSchema` and discards it: persist it | 2-3 days |
| 3 | Envelope conformance across all 35 commands | Table-drive the test from the module's command list | 1 week |
| 4 | Bring `waiver` into the contract | `--format`, envelope, `correlationId` | 2 days |
| 5 | A real English guide, and delete dead code | — | 1 week |

### 3.4 The one thing

**Fix 1.** The others are capability gaps; **this one is an integrity gap**. It discredits the wedge the moment a customer's pipeline reports green on a repo that was never evaluated.

---

## 4. Evolith MCP

> **Verdict:** the most rigorously governed [MCP](glossary-ai-native-en.md#mcp) server I have read, with 30% of its surface denied today by its own policy.

### 4.1 What it does well

| Strength | Evidence |
|---|---|
| **The [HITL](glossary-ai-native-en.md#hitl-human-in-the-loop) gate is guarded by a derived test, not a fixture** | `mutative-hitl-parity.spec.ts` derives the state-changing set **from the ABAC classifier** and asserts each declares `mutative:true`. **A write tool that forgets the flag fails the build** — the classic bypass becomes structurally impossible |
| **ABAC fails closed where it matters** | Hard-denies on missing `policy.wasm` in production; any OPA exception → deny; dispatch requires **both** engines to allow |
| **Every call produces an audit record with verdict and identity** | It distinguishes `denied` from `error` — the distinction an auditor needs — redacts sensitive keys and fingerprints tokens |
| **Pre-call discovery without burning a call** | `evolith://capabilities` and `evolith://contracts`. **Very few MCP servers publish a capability manifest at all** |
| **Hygiene above the norm** | 390 `it()` blocks, 87.3% line coverage; constant-time key compare, 1 MB body cap, per-IP rate limit, traversal sanitiser; SDK pinned current |

### 4.2 What it does badly

| # | Defect | Evidence | Consequence |
|---|---|---|---|
| **1** | **30% of the surface is dead right now** | Loading **the compiled artifact actually used at dispatch** and evaluating it: 15 tools ([ADR](glossary-ai-native-en.md#adr-architecture-decision-record), patterns, scaffold, upgrade, init, fixtures, docs) return `ABAC-03` for an architect in production. The `.rego` twin never received them; **nothing guards rego↔TS** | An agent asks Evolith for its own ADRs and **is refused**. In production this is silent and total |
| **2** | **`tools/list` cached under a global key** | Literal key `mcp:tools:list`, read **before** the scope filter. First caller wins for 600s | **An authorization leak on the discovery surface**: an admin priming the cache leaks the write inventory to every reader |
| **3** | **Zero `outputSchema`, zero [`structuredContent`](glossary-ai-native-en.md#outputschema--structuredcontent), zero annotations** | The `McpToolSchema` type is exactly `{name, description, inputSchema}`. Results ship as text | An `EvaluationResult` **is** a schema; emitting it as prose forces the model to regex a verdict it should validate. It is **the direct cost of the surface-parity principle**: the CLI has no use for output schemas, so MCP got none |
| **4** | **ADR-0093 is Accepted and 0% implemented** | It mandates `baseSha`, HEAD verification, a conflict contract and locks. Zero occurrences. There are 20 mutative tools | Two agents on one workspace produce exactly the lost update the ADR was written to prevent |
| **5** | **RFC 9728 unmet, and an OAuth hole** | No `.well-known`, no `WWW-Authenticate`. And `oauth-resource-server.ts:234` validates `exp` only *if present*: **a [token](glossary-ai-native-en.md#token) with no `exp` never expires** | No conformant client can discover the AS; and a perpetual credential is acceptable |
| **6** | **The session model is deleted by the spec** | 10 `sessionId` references; returns 400 without the header. The `2026-07-28` revision removes `Mcp-Session-Id` and `initialize` | Every conformant client breaks |

### 4.3 What to improve

| # | Fix | How | Effort |
|---|---|---|---|
| 1 | **One canonical manifest generating rego, catalogue, schemas and annotations** | Emit `tools.manifest.json` from the registry; codegen the `.rego` sets and recompile in CI; a test evaluating the wasm over all 50 names | 1-2 weeks |
| 2 | Key the `tools/list` cache by principal, or delete it | Hash of scopes+tenant; better, drop it | 1 day |
| 3 | Add `outputSchema`, `structuredContent` and honest annotations | Widen the type; generate from `SCHEMA_VERSION` | 2-3 weeks |
| 4 | Implement ADR-0093 | `baseSha` across the 20 mutative tools | 2-3 weeks |
| 5 | [PRM](glossary-ai-native-en.md#prm-protected-resource-metadata-rfc-9728) + scope challenge + mandatory `exp` | Serve `.well-known`; reject payloads without a numeric `exp` | 1 week |
| 6 | Dual-protocol shim for `2026-07-28` | [`server/discover`](glossary-ai-native-en.md#serverdiscover), `_meta`, [MRTR](glossary-ai-native-en.md#mrtr-multi-round-trip-requests) replacing the bearer token | 4-6 weeks |

### 4.4 The one thing

**Fix 1.** It is the only item that is simultaneously an outage fix, a design fix and an enabler: it turns parity **from discipline into a build artifact**, and leaves everything else a generator change rather than a 50-way hand edit.

---

## 5. Evolith Agent Runtime

> **Verdict:** the best engineering in the suite, wrapped around almost no agent.

### 5.1 What it does well

| Strength | Evidence |
|---|---|
| **It fails closed at boot** | Under the production profile it **throws** when the real Core endpoint, [token](glossary-ai-native-en.md#token), durable state dir or real OPA is missing. Approval defaults to deny |
| **The port boundary survived real pressure** | The service imports **zero adapters**. Proof it paid off: Hermes → Swarms → Cowork → Gemini were added **with no orchestrator change**. 309 tests in 1.57s with no network and no filesystem |
| **[Provenance](glossary-ai-native-en.md#provenance) stamping is the real differentiator** | Every result carries `executedBy/validatedBy/governedBy/policyEngine/approvedBy/groundedBy{corpusVersion,citations}`. **That is not producible by someone bolting an [LLM](glossary-ai-native-en.md#llm) onto a linter** |
| **LLM egress controls are better than most production AI teams ship** | Key in a header never the URL, timeout, a byte budget that **fails closed rather than truncating a governed prompt**, schema-validated response, and a content-free audit event on every attempt **including refusals** |
| **Operational details genuinely thought through** | It detects a cached wrong-architecture OPA binary and re-downloads at image build. A 20-line comment records a real production incident and the fix — **that is worth a week of someone's life** |

### 5.2 What it does badly

| # | Defect | Evidence | Consequence |
|---|---|---|---|
| **1** | **Nothing requires human approval, so the [HITL](glossary-ai-native-en.md#hitl-human-in-the-loop) gate has never fired** | All 7 skills and all 16 manifest capabilities declare `requiresApproval: false` | ~1,000 LOC of approval subsystem is unreachable; the approvals counter is structurally 0. **The loudest governance claim has never executed** |
| **2** | **The skill catalogue is a hardcoded array of 7 while the manifest exposes 16** | The registry seeds `DEFAULT_SKILLS` and never reads the manifest — although the process adapter does | The agent offers 25% of what the [harness](glossary-ai-native-en.md#harness) can already do, and governance posture has **two sources of truth**: exactly the drift ADR-0102 named as its main risk and did not mitigate |
| **3** | **Grounding is decorative and the index is empty** | It is computed and used in **exactly one place: the trace**. Never passed to `plan()` or the evaluation context. And the default adapter is an array nobody seeds | **The system cites sources it did not consult.** The 276-LOC [pgvector](glossary-ai-native-en.md#pgvector) adapter, the SQL schema and the sidecar are all built; the workflow runs in permanent dry-run |
| **4** | **Memory is write-only** | It calls `append` twice and never `history()` or `recall()`, both of which the port defines | Turn 2 knows nothing of turn 1. For a product pitched as operating the Core agentically, this is the gap found in the first demo |
| **5** | **Engine-proposed arguments are discarded** | Every engine returns `proposedArguments`; the service consumes only `proposedTool` | The day a real engine lands it will **select the right tool and execute it with stale parameters** — the worst failure class for an audit product |
| **6** | **No [sandbox](glossary-ai-native-en.md#sandbox), no credential scrubbing** | Child processes are spawned with `...process.env`, handing every script the Core token, the tracker token and the vector DB URL. ADR-0081 is paper — as are 0082, 0086, 0088, 0089, 0092 and 0094: **zero occurrences** | — |

> **On "17 ports and 49 adapters for a single pass":** the hot path depends on 9 required ports and is **right-sized, admirably restrained**. What is over-inventoried is the edge: two interaction adapters with zero call sites, and `StructuralReviewProvider` complete and wired to nothing. **The mistake is not building it: it is counting it as capability in the vision documents.**

### 5.3 What to improve

| # | Fix | How | Effort |
|---|---|---|---|
| 1 | **Manifest-derived skill catalogue with inherited posture** | A new adapter reading `.harness/manifest.yaml` (the loader exists); posture comes from the manifest; a CI test asserting catalogue ⊇ manifest | 1 week |
| 2 | Turn HITL on end-to-end for ≥2 destructive capabilities | `requiresApproval: true` on two; one e2e pending→approved→executed | 1-2 weeks |
| 3 | Make grounding and memory load-bearing | Pass the chunks into `plan()` and the context; read `history()`; seed pgvector | 2 weeks |
| 4 | Consume `proposedArguments` + scrub the spawn environment | Merge over parameters with revalidation; allowlist the env | 3-5 days |
| 5 | Mark 0081/0082/0086/0088/0089/0092/0094 as `Proposed` | Status change plus an "implementation: none" note | 1 day |

### 5.4 The one thing

**Fix 1.** It is the only one that simultaneously triples what the agent can do, gives governance posture **a single source of truth**, and turns fix 2 into a configuration change rather than a project. Everything else refines the envelope; **this puts something valuable inside it**.

---

# As a product

## 6. The suite

### 6.1 What exists only because of composition

- **One evaluation semantics reaches three surfaces without three state models.** A direct dividend of the ADR-0100→0101 reversal plus the envelope. And it is **enforced**: `api-catalog-parity.spec.ts` boots the real DI graph and asserts the CLI catalogue equals the live [MCP](glossary-ai-native-en.md#mcp) registry.
- **The advisory/binding invariant survives a repo, a language and a team boundary.** Core returns `binding:false`; Tracker owns the decision. Better: CD-11 persists `rulesetsApplied`, so **a verdict fabricated by the mock fallback is recorded as such** and stays distinguishable from a real one. That is composition-level honesty.
- **Separation of duties is structural across the boundary**, and both halves exist and are field-for-field compatible.
- **Fail-closed is a suite posture, not five habits:** the same choice made independently in five places.

### 6.2 What fails because of composition

| # | Failure | Evidence |
|---|---|---|
| **1** | **The write path is one-directional and points the wrong way** | Grep across CLI, MCP and core-domain: **no Tracker base URL, no ingest client**. The only writers are Tracker-initiated endpoints. **Every `evolith validate`, every edit veto, every MCP call and every CI drift-gate run evaporates on exit** |
| **2** | **Two evidence graphs, each missing the other's half** | Core defines typed edges with **zero consumers outside its own spec**; Tracker persists a string list with one reader. **The typed model lives where nothing persists; the persisted model lives where nothing is typed** |
| **3** | **Complete, matched seams that have never fired** | Approval: both halves built and tested — and 0 of 16 capabilities request it |
| **4** | **Identity degrades at every hop** | Falsified `engine`, three empty fields, untyped `actor_id`, `waiver` with no envelope |
| **5** | **No signature exists anywhere** | Zero occurrences of cosign/sigstore/in-toto across both repos. Integrity is local and **unverifiable by a third party** |

### 6.3 The chain test

The chain the product sells: `decision → rule → violation → owner → evidence → signature → time series`, with the same rules for people and agents.

| Link | Exists? | Wired? | What breaks it |
|---|:-:|:-:|---|
| **decision ([ADR](glossary-ai-native-en.md#adr-architecture-decision-record))** | ✅ The strongest asset | Partial | 91 of 126 generated rules are blocking with no handler |
| **rule → violation** | ✅ Node only | Partial | One authored ruleset (6 rules); Python/.NET/IaC have no corpus; 15 of 50 MCP tools denied |
| **violation → owner** | ✅ Both models | ❌ **No** | Two independent resolvers; **no run persists a violation with its owner** |
| **owner → evidence** | ✅ The store is real | ❌ **Severed** | **Nothing in CLI, MCP, CI or Core writes to it** |
| **evidence → signature** | ❌ Absent | — | No attestation; and what little is written carries a falsified engine |
| **signature → series** | ❌ Absent | ❌ Severed | `repository_revision` stored, never queried as a series |
| **same rules, humans & agents** | ❌ No | ❌ Severed | No `actor_type`; ledger unwired; the [HITL](glossary-ai-native-en.md#hitl-human-in-the-loop) gate has never executed |

> **The chain is intact for two links and severed from `evidence` onward. Today the product can *decide*; it cannot *accumulate*.**

### 6.4 What to improve at suite level

| # | Fix | How | Effort | Touches |
|---|---|---|---|---|
| 1 | **Type the actor before anything writes** | `actor{type,id,modelId,sessionId}` in the envelope `meta`, carried into 4 new columns | 2 wks | All five |
| 2 | **Open the write path** | One ingest contract posted by CLI, MCP and CI; populate the mapper; a shared client using machine-key auth as approvals already do | 3-4 wks | Core, CLI, MCP, Tracker |
| 3 | **One typed edge model** | Promote Core's type to the shared contract; `evidence_edges` table; graph endpoint | 3 wks | Core, Tracker |
| 4 | **One manifest generates every surface** | rego + CLI catalogue + [`outputSchema`](glossary-ai-native-en.md#outputschema--structuredcontent) + skill catalogue from one source | 3-4 wks | MCP, CLI, Runtime, Core |
| 5 | **Fire HITL end-to-end once** | Two destructive capabilities; one full e2e | 1 wk after #4 | Runtime, Tracker |
| 6 | **Sign and serialise** | Attestation over the ingest; a revision-series endpoint | 3 wks | Core, Tracker |

---

## 7. SWOT

### 7.1 Strengths

*Internal, real, hard to copy.*

1. **Audit immutability enforced by Postgres, not by code.** A competitor adds an audit table in a sprint; **retrofitting "the application cannot rewrite its own history" into a shipped schema is a migration nobody volunteers for.**
2. **Fail-closed as a repeated, reasoned choice across four codebases.** Six independent places where the easy path was a false pass. **That is culture, and culture is the slowest thing to copy.**
3. **Machinery that refuses to let the product certify itself.** GT-556/557/558; the derived [HITL](glossary-ai-native-en.md#hitl-human-in-the-loop) test; the catalogue parity test; 12 robots with 108 assertions against real Kubernetes, plus proof the bypass is absent from the production image.
4. **The identity model that makes accumulation survive tool churn.** Fingerprint excluding `message`, prefix-based ownership, compliance catalogue as versioned data.
5. **Two seams drawn correctly under pressure.** The ADR-0101 altitude reversal, and a HITL channel with genuinely opposed identities.
6. **A working edit-time veto with a vendor-neutral payload.** **Nobody else in this category sits at the moment of the agent's write.**
7. **[Provenance](glossary-ai-native-en.md#provenance) as a first-class artifact**, plus [LLM](glossary-ai-native-en.md#llm) egress that fails closed rather than truncating a governed prompt.

### 7.2 Weaknesses

*Internal, with consequence.*

1. **The moat is being written blank and misattributed.**
2. **The agent ledger is written, tested, unwired — and the actor cannot be typed later.** The table is trigger-immutable.
3. **The corpus is a facade.** 91 phantom rules; five adapters behind one ruleset.
4. **The machine surfaces manufacture false greens.** ANSI menu on [stdout](glossary-ai-native-en.md#stdout--stderr) with exit 0.
5. **30% of the [MCP](glossary-ai-native-en.md#mcp) surface is dead in production**, plus an authorization leak on discovery.
6. **HITL has never fired.**
7. **Nothing has ever accumulated.** No deployment, no telemetry, no reference customer.
8. **Accepted ADRs with no code, and docs contradicting the schema.** Seven ADRs with zero occurrences; five documented schemas that do not exist; the English guide in Spanish.
9. **The agent is decorative where it is visible.** It cites what it did not consult; turn 2 forgets turn 1.

### 7.3 Opportunities

*External, reachable from where the product actually is.*

| Opportunity | Horizon | Why it is reachable |
|---|---|---|
| **Own the write moment** | 0-3 months | `enforce edit` already works. Sonar scans in CI, gateways authorize calls, portals hold the catalogue — **none can refuse the agent's edit citing an [ADR](glossary-ai-native-en.md#adr-architecture-decision-record)**. It is the only unoccupied surface in the market |
| **Agent-vs-human attribution as a category of one** | 3-6 months | Wiring the port plus four columns is ~2 weeks on tested code. **No portal, gateway or metrics vendor can answer it, because none owns an approval grant model. Evolith already does** |
| **Drift-per-revision from data already being written** | 2-3 months | `repository_url` and `repository_revision` already persist. A series query turns that into **exactly the signal Sonar markets — but evidenced per revision and per ADR, not inferred** |
| **Be the policy plane a gateway calls** | 3-9 months | It converts the gateway threat into **distribution** rather than competing on a surface that cannot be won |
| **The compliance buyer** | 6-12 months | `dimension` and `determinism` are already columns, the catalogue is already versioned data, the audit is already immutable. It is the buyer with budget that portals do not serve |

### 7.4 Threats

**Already happening:**

| Threat | Speed |
|---|---|
| **Sonar, GA 2026-03-02** — auto-discovery, free, five languages, sold explicitly against AI drift. **It wins the day-one evaluation** ("does it say anything about *my* repo without me authoring rules?") against 6 authored rules and 91 phantoms | Continuous; ~5 months of installed base already |
| **Agent gateways** commoditizing per-call authorization, **on a surface the agent cannot decline** — whereas MCP can be declined | Now |
| **The MCP stateless revision** breaks conformant clients on a known date | 1-2 quarters |
| **Portals adding agents** over their catalogue — and `ownership.ts` **reads their files**, framing Evolith as their add-on rather than their peer | 2-4 quarters |
| **Delivery-metrics saturation**: the most finished part of the suite is the least sellable | Already |

**Plausible, not yet:** an agent vendor shipping first-party policy hooks (would close the wedge from above, ~12 months) · a CVE in OPA 0.65 · **a single due-diligence read** — seven empty ADRs, 91 rules that execute nothing and [SARIF](glossary-ai-native-en.md#sarif) reporting "0 rules evaluated" are findable in one afternoon.

### 7.5 The cross-reads

**Strength × Opportunity — what to press.** The edit-time veto **plus** the provenance stamp. Together — every refused or allowed agent write producing one evidence row — that is a demo **neither a scanner, a gateway nor a portal can stage**. Press it this quarter, in English, free.

**Strength × Threat — what defends you.** Against Sonar, defend **on evidence, never on detection**: it cannot produce an immutable, approval-linked, agent-attributed chain because it **owns no approval model and no state plane**. Against the gateways, be the policy they call.

**Weakness × Opportunity — what you will miss.** Both high-value opportunities route through the same three fixes: populate the mapper, wire the ledger, type the actor. **Five to seven weeks on code that is already written and green.** Until then the differentiator demos as a jsonb string list.

**Weakness × Threat — the existential one.**

> **Empty traceability fields plus an untyped, unwired agent ledger, against a closing attribution window.**
>
> The mechanism is **ordering, not size**: the strategy is premised on *accumulated* evidence; accumulation has not started; the schema that would make it meaningful is missing; and the table is [append-only](glossary-ai-native-en.md#append-only) **by database trigger**, so **nothing written before the fix can ever be corrected**.
>
> If deployment lands before the mapper and the ledger, the first year of real customer history arrives structurally unable to distinguish a human from an agent — the single question Evolith sells. **The competitor risk is survivable; a corpus that must be discarded is not, because it cannot be regenerated.**

---

## 8. Plan: what to do, in what order

### 8.1 The sequence

| Order | What | Why there |
|---|---|---|
| **1st — together** | **Type the actor** (migration first) **and open the write path** | The failure is specific and unrecoverable: the moment the pipe opens, CLI, [MCP](glossary-ai-native-en.md#mcp) and CI start pouring rows into an immutable table with an untyped actor column. Every one of those rows **permanently fails** to answer "human or agent?" |
| **2nd — in parallel from day one** | **The single manifest** | It is generator work on a different surface, and it independently unblocks the 15 dead tools and the 91 phantom rules |
| **3rd** | **CLI machine mode + exit taxonomy** | It is the integrity gap; without it there is no trustworthy CI adoption |
| **4th** | **Typed edges** | It needs step 1's rows to have something to connect |
| **5th** | **[HITL](glossary-ai-native-en.md#hitl-human-in-the-loop) end-to-end** | It becomes configuration once the manifest exists |
| **6th** | **Sign and serialise** | Only meaningful over content that already exists |

### 8.2 The sequencing mistake to avoid

> **Do not put the production deployment ahead of typing the actor.**
>
> Deploying now means the first months of real customer history arrive **untyped, unlinked, unsigned and unaccumulated** — the exact outcome the whole architecture was built to prevent.

### 8.3 Three-sentence summary

**Where the product stands.** A genuinely well-architected governance suite — four codebases with real fail-closed semantics, database-enforced immutable audit, twelve behavioural robots gating CI against live Kubernetes, and a working edit-time veto — wrapped around a rule corpus that mostly executes nothing and an evidence trail currently written blank, and it has never run anywhere a customer could reach it.

**The lever.** Roughly five weeks of wiring on code that **already exists and passes its tests**: populate `rulesExecuted` and the real engine in the mapper, register the agent execution port and add `actor_type`/`agent_id`, and promote `references` to a typed edge table — which converts every future run **from a blank row into the accumulating asset the entire strategy assumes**.

**If nothing changes for twelve months.** Sonar owns detection at zero price in five languages, the gateways own per-call authorization, the portals own catalogue-plus-agent, and Evolith arrives with an admirable envelope, 91 rules that enforce nothing, and an audit graph whose first year **cannot tell a human from an agent** — defensible only by rebuilding a history it is no longer able to create.

---

## 9. Methodology and one correction

- **Five parallel assessors**, one per component, instructed to evidence every claim with a file, [ADR](glossary-ai-native-en.md#adr-architecture-decision-record) or count, and to be as specific about strengths as about defects. Then a whole-product synthesis and a SWOT over their results. 7 agents, ~692K tokens, 247 tool calls.
- **Several findings were verified by execution**, not by reading: the `enforce edit` veto (a real `EXIT=2`), the five commands' false greens (with stdin closed), and the 15 denied [MCP](glossary-ai-native-en.md#mcp) tools — **by loading the compiled `policy.wasm` actually used at dispatch and evaluating it**, rather than inferring from source.
- **One correction between assessors.** The Agent Runtime assessor claimed the `/runtime-approvals` endpoint "does not exist in the Tracker repo". **That is false:** the whole-product synthesiser verified both halves and they are field-for-field compatible. It is recorded here because it illustrates the finding itself — when a seam has never run end to end, **each side doubts the other exists**.
- **Market fact verified directly:** Sonar's architecture-management general availability (2 March 2026), against the official announcement. The rest of the competitive landscape comes from research and **must be revalidated against primary sources** before use in an investment decision.

---

*This document is a technical assessment, not an approved decision. It is reviewed when the state of the code changes materially.*
