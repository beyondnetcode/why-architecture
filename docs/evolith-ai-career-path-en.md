# Evolith AI Career Path — A specialization route for designing the AI-native suite

> **Bilingual navigation:** [Versión en Español](evolith-ai-career-path-es.md)
>
> **Supersedes** [`evolith-ai-native-route-es.md`](evolith-ai-native-route-es.md) and [`evolith-ai-native-plan-es.md`](evolith-ai-native-plan-es.md). Those started from "learn AI applied to architecture governance". This one starts from the right question: **what must I master to design Evolith Core + Tracker + CLI + MCP + Agents as one AI-native ecosystem?** — and arrives at a different answer.
>
> **Basis:** direct source inspection of the real `evolith` and `evolith_tracker` repositories (not their documentation), plus multi-agent research across 10 domains against primary sources. Date: 2026-07-25.

---

## 0. Executive summary — the corrected thesis

The previous proposal assumed Evolith's bottleneck was **AI knowledge**. It is not.

The bottleneck is that **the data that constitutes the moat does not yet exist, and every day the system runs uninstrumented, part of it is permanently destroyed**. The three or four highest-impact decisions of the next twelve months require almost no new AI: type a column, define exit codes, publish a Check Run, sign a decision.

Five hard corrections follow:

| # | Correction | Why |
|---|---|---|
| **1** | **The moat is not the knowledge graph. It is the attributable provenance record.** | The lineage Evolith needs is a *time series with joins*, not a traversal problem. A semantic graph over ADR prose imports non-determinism into the one system whose entire promise is the reproducible verdict. |
| **2** | **Determinism ≠ correctness.** Evolith blocks merges without ever having measured its own false-positive rate. | The day an AI-assisted gate blocks wrongly, the LLM will be blamed and there will be no data to prove otherwise. **Calibration is the licence to use AI at all.** |
| **3** | **The wedge is aimed at the wrong drift.** | The 2026 longitudinal evidence says AI's damage is duplication, collapsed refactoring and abandoned maintenance — **all of it import-legal**. The 167 boundary rules are blind to it. And on 2026-03-02 Sonar shipped the detection half of the wedge to GA, free and auto-discovered. |
| **4** | **MCP is the weakest control surface, not the strongest.** | MCP is client-cooperative: an agent that never invokes it is entirely ungoverned. Real control lives where the agent cannot route around it: **exit codes, the `PreToolUse` hook, the Checks API, the gateway**. |
| **5** | **The learning sequence inverts.** | Your hypothesis starts at AI fundamentals and ends at governance. For *this* product the correct order is: **instrument → measure → only then generate**. |

**The question that should drive the route is not "what AI must I learn?" but:**

> **What must I master so that Evolith can state, with signed evidence and a published error rate, how an architecture evolves when humans and agents write it together?**

Everything else — RAG, graphs, agents, orchestration — is a means or a distraction depending on whether it serves that sentence.

---

## 1. The product's real state (what the code says, not the docs)

Necessary because **Evolith's documentation carries systematic drift against its code**, and a learning route built on the docs would learn the wrong product.

| Component | Verified in code | Docs claim |
|---|---|---|
| **Core** | 12 `EvaluationKinds`, **only 7 KindEvaluators**; `design` and `phase-artifacts` always PASS | 10 kinds |
| **Rulesets** | 20 directories; 167 `*.rules.json` (**126 auto-generated**); 36 `.rego` + 32 `.test.rego` | 26 categories |
| **MCP** | **50 tools, 12 resources, 8 prompts**; SDK 1.29.0; zero `outputSchema`, zero annotations, no PRM `.well-known` | 47/11/8 |
| **CLI** | **35 commands**; 29 use the ADR-0073 envelope; **20 × `process.exit(1)`, a single value**; ~320 `console.log` vs 9 stderr writes; no NDJSON | 31 commands |
| **Agent Runtime** | **17 ports, 49 adapters**; **single-pass pipeline, no ReAct loop**; one `plan()` call; Hermes/Swarms/Cowork are empty shells | 16/38 |
| **Tracker** | .NET 10, EF Core, **91 migrations**; 12 RoboSoft robots; real HITL (`/runtime-approvals`) | — |
| **RAG (ADR-0090/0112)** | pgvector 1024-dim HNSW + Qwen3 sidecar + delta sync + 38 green tests — **never switched on; zero chunks indexed; no MCP search tool** | "shipped" |
| **OPA** | pinned at **v0.65.0**; upstream is at v1.18.2; `npm opa-wasm` no release since Nov 2024 | — |

**The seam that changes everything:** **ADR-0111 `IQualitySignalProvider`**. Evolith has already designed and shipped the sanctioned seam through which non-determinism enters the engine: as `EvaluationContext.qualitySignals`, carrying `Evidence{determinism, findings, provenance{collectedBy, adapterVersion, artifactHash}}`, collected in agent-runtime (Core never executes a provider) and folded deterministically. **Every piece of AI Evolith adds must enter through it.** This does not need inventing — it needs pointing at the right thing, and measuring.

**And the three defects that define the next twelve months:**

1. `tracker_governance.audit_entries.actor_id` is a `Guid` with **no human/machine discriminator**, no agent_id, model_id or session_id. There is no `agent_runs` table. **Evolith cannot answer its own founding question.**
2. `core_evaluation_transactions` already carries `repository_revision` — and **nothing reads it as a series**. No `metric_snapshots`, no `drift_alerts`, no SCM webhook ingest. *The product is named for evolution and has no time dimension.*
3. **GT-435/GT-448 (P0): nothing has ever run in production.** `VPS_DEPLOY_ENABLED` was never set. Zero rows accumulated in the "accumulated audit graph" the positioning document calls the stronger half of the moat.

---

## 2. Critique of your conceptual decomposition

You proposed nine pieces: Core, Tracker, CLI, MCP, AI/Agents, Knowledge, Governance, Evidence, Intelligence. **Five are components; four are not — and treating those four as products is the expensive mistake.**

| Piece | Verdict | Reason |
|---|---|---|
| **Core, Tracker, CLI, MCP, Agent Runtime** | ✅ Real components | They exist in code, with boundaries and contracts. Correct. |
| **Evolith Governance** | ❌ Not a component | It *is* Core. Rulesets, OPA policies and phase gates already are that. Splitting it duplicates the engine. |
| **Evolith Knowledge** | ❌ Not a product | It is `IKnowledgePort` plus an adapter. Promoting it to a product is how you end up building a full RAG stack that is never switched on (already happened). |
| **Evolith Evidence** and **Intelligence** | ⚠️ **The same thing seen twice** | Both are projections over **one substrate**: the attributable, timestamped record. "Evidence" is its point-in-time reading; "Intelligence" is its reading as a series. One substrate, two views. |

**The piece that does matter and you did not name: the enforcement adapters.** Exit codes, the `PreToolUse` hook, the Check Run, the Agent Skill. That is where CONTROL lives, and it is absent from your mental model.

**Corrected decomposition:**

```
COMPONENTS (they exist)        Core · Tracker · CLI · MCP · Agent Runtime
                                          │
ONE NEW COMPONENT        ──►    The Ledger  (attributable, signed, temporal provenance)
                                = the single substrate of Evidence + Intelligence
                                          │
ONE CROSS-CUTTING          ──►  Calibration (every rule and every judgement carries its error rate)
DISCIPLINE                                │
ONE ADAPTER FAMILY         ──►  Enforcement (exit codes · PreToolUse · Checks API · Skill · gateway)
```

One new component, one discipline, one adapter family. Not nine products.

---

## 3. Critique of your hypothesized sequence

You proposed: `AI Engineering → GenAI → LLM Engineering → RAG → KG → Agents → Agentic → MCP → AI-native apps → Agentic SWE → AI-native SDLC → AI Architecture → Architecture Intelligence → AI Governance → Agent Governance → Core → Tracker → CLI+MCP → Suite`.

Three problems:

1. **It is a sequence for building an AI product from scratch.** Evolith is not that: it is a mature deterministic engine with a non-determinism seam already designed. Starting at LLM fundamentals is starting where you need the least.
2. **It puts governance last.** But governance is what Evolith *already is*; what is missing is **measuring it**. Measurement is not a late chapter — it is the prerequisite for admitting AI into a verdict.
3. **It puts RAG and Knowledge Graphs early and heavy.** Those are the two bets the research most strongly advises against. GraphRAG-Bench shows the graph losing to plain RAG on factual retrieval; Evolith's corpus is a few hundred markdown files queried by exact identifiers (`ADR-0111`, `SCHEMA_VERSION`) — an index-and-BM25 problem, not an embeddings problem. And the market went the other way: the very agents Evolith wants to govern **deleted their vector indexes**, because just-in-time tool-driven retrieval beats frozen embeddings on exactly this kind of corpus.

**Corrected sequence — instrument, measure, and only then generate:**

```
0 · Protocol & interfaces         ─ MCP 2026-07-28 · exit codes · schemas · streams
1 · Provenance & evidence         ─ actor typing · PROV-O · SCITT · OTel gen_ai · git-ai
2 · Measurement & calibration     ─ error analysis · TPR/TNR/κ · judge validation · admissibility as policy
3 · Structured generation         ─ constrained decoding · format/constraint tax · two-pass · caching
4 · Code & repository intelligence─ SCIP · tree-sitter · reflexion models · RepoFacts · C4↔code mapping
5 · Agentic architecture          ─ durable execution · journaling · harnesses · orchestration-as-code
6 · Evolution intelligence        ─ time series · DORA as outcome label · GitClear signals
7 · Governance as product         ─ NIST · EU AI Act · OWASP ASI · ISO 42001 as derived packs
```

Note the inversion: **stage 2 (measure) precedes stage 3 (generate)**. That is the entire point.

---

## 4. Career Path — 2 to 3 years

### Year 1 — *The instrumenter* (stages 0-2)

**Professional identity on completion:** the architect who can turn a deterministic governance system into one that **measures its own reliability** and **records attributable provenance** — and can therefore admit AI without losing auditability.

Master: protocol contracts (modern MCP, JSON Schema 2020-12, exit-code semantics), evidence-schema design, provenance and verifiable ledgers (PROV-O, SCITT/RFC 9943, OTel GenAI), and **evaluation methodology** (error analysis, chance-corrected judge validation, evals in CI).

Why first: provenance data **cannot be backfilled**. The Khosravani & Mockus census across 180M repositories shows post-hoc AI-authorship detection recovering ~3.3% using the signal the whole market relies on. Every day without a typed actor is permanently anonymous history.

### Year 2 — *The calibrator of judgement* (stages 3-5)

**Identity:** the architect who knows **where and how to insert probabilistic judgement inside a deterministic engine** without breaking the audit contract — and can prove it with numbers.

Master: structured generation and its measured costs (format tax / constraint tax, two-pass reason-then-conform design, prompt caching as an architectural constraint on the tool registry), deterministic code intelligence (SCIP, tree-sitter, reflexion models, the LLM-assisted and human-confirmed mapping step), and durable execution with journaling.

This is where `IQualitySignalProvider` stops being an empty seam and becomes the mechanism by which Evolith gains **depth** in Phase Gate 3.

### Year 3 — *The category designer* (stages 6-7)

**Identity:** the person who defines what *Software Evolution Intelligence* means and can defend it with reproducible evidence in front of an auditor, a CISO and a competitor.

Master: architecture-conformance time series, human-vs-agent attribution at generation time, regulatory taxonomies as derived packs (never as identity), and the economics of accumulated evidence.

---

## 5. Twelve-month Learning Path — calendarized

**Pace:** ~6 h/week (4 h study + 2 h application). ~52 weeks ≈ **310 h**. Every quarter ends in a product artifact, not a certificate.

### Q1 (weeks 1-13) — Protocol, interfaces and provenance · ~78 h

| Wk | Focus | Evolith deliverable |
|---|---|---|
| 1-2 | **Urgent:** MCP `2026-07-28` changelog, MRTR pattern, authorization (PRM RFC 9728, RFC 8707, RFC 9207, CIMD) | Migration plan for `@beyondnet/evolith-mcp`; delete `sessionId`; add `server/discover` |
| 3-5 | Exit-code semantics; `clig.dev`; Terraform machine-readable UI; MCP Tools draft (`outputSchema`, `structuredContent`, annotations) | **Exit-code taxonomy** (0 PASS / 2 usage / 3 **verdict FAIL** / 1 infra / 4 HITL) + stdout-stderr discipline, governed by its own ruleset with Rego parity |
| 6-8 | JSON Schema 2020-12; one capability registry | `capability-registry.json` with real `inputSchema`/`outputSchema`; delete hand-written `TOOL_SCHEMAS`; RoboSoft robot #13 for surface parity |
| 9-11 | **PROV-O**; SCITT **RFC 9943**; OTel GenAI conventions (`gen_ai.evaluation.result`, `mcp.*`); `git-ai` / Git Notes | Migration #92: `actor_type`, `agent_id`, `model_id`, `session_id` + `agent_runs` table; telemetry switched on with tenant/initiative/actor attributes |
| 12-13 | MRTR as the HITL mechanism; Enterprise-Managed Authorization / ID-JAG | HITL gate re-expressed as `InputRequiredResult` with an AEAD-sealed `requestState` binding principal + digest + TTL |

> **Q1 Gate — *Nothing further is learned until the actor is typed and the clock is running.*** If `audit_entries` still has no discriminator at quarter's end, everything after it is built on anonymous history.

### Q2 (weeks 14-26) — Measurement and calibration · ~78 h

| Wk | Focus | Deliverable |
|---|---|---|
| 14-16 | Error analysis first; Hamel Husain *Evals FAQ*; Anthropic *Demystifying evals* (outcome over trajectory) | Hand-labelled set: ~150-200 real diffs from the Evolith repos, binary, against **one** narrow rubric; human-human κ as the ceiling |
| 17-19 | Judge validation: TPR/TNR, Cohen's κ, Wilson intervals; biases (verbosity dominates, position now near-dead); *Reliability without Validity* | `evolith-cli judge:validate` returning a confusion matrix + κ + CI95 in the ADR-0073 envelope |
| 20-22 | **Calibrate the deterministic side first** | Published per-ruleset precision for the rules you already ship, mined from `core_evaluation_transactions` × `gate_decisions` (every human override is a free label) |
| 23-24 | Admissibility as policy | `probabilistic-evidence-admissibility.rules.json` + parity `.rego`/`.test.rego`: probabilistic evidence may block only if `tpr ≥ θ₁ ∧ tnr ≥ θ₂ ∧ age ≤ θ₃`; otherwise it degrades to advisory |
| 25-26 | Compatibility gates for model updates; `model-registry.json` | A CI gate that re-runs the frozen labelled set on model upgrade and blocks if TPR/TNR falls outside the interval |

> **Q2 Gate — *Can you publish the false-block rate of your current gates?*** If not, do not add AI to the verdict: measure what you already ship first.

### Q3 (weeks 27-39) — Structured generation and code intelligence · ~78 h

| Wk | Focus | Deliverable |
|---|---|---|
| 27-29 | Constrained decoding; **format tax** and **constraint tax**; two-pass design; prompt caching as an architectural constraint | `LlmArchitectureDriftProvider` behind `quality-signal-provider.port.ts`: free-form reasoning plus a separate constrained extraction; cached prefix holding the rule corpus |
| 30-32 | Context engineering; just-in-time retrieval; switch the dormant RAG on | MCP tool #51 `knowledge-search`, **hybrid with BM25 first** over identifiers; `EVOLITH_RAG_SYNC` enabled; retrieval eval harness in CI |
| 33-36 | **SCIP** (open governance since Mar 2026), tree-sitter, stack-graphs; reflexion models (Murphy/Notkin/Sullivan) | `RepoFacts`: a content-hashed structural fact pack, extracted **outside** Core, entering as a deterministic member of `EvaluationContext` |
| 37-39 | LLM-assisted mapping (ExArch-style, F1 ~0.86); FINOS CALM as an ingest format | **The C4↔code mapping as a governed asset**: the model proposes, HITL confirms, Tracker persists it versioned → thereafter it is deterministic input |

> **Q3 Gate — Substrate decision.** Does Core receive `RepoFacts` inline (honouring ADR-0101), or does Tracker own them? Document and close it; it conditions everything downstream.

### Q4 (weeks 40-52) — Evolution, durability and the wedge's depth · ~78 h

| Wk | Focus | Deliverable |
|---|---|---|
| 40-42 | Library-mode durable execution on the existing Postgres; session-as-event-log | `handleStream` as a durable workflow: `plan()`, harness, each provider and Core's evaluate as journaled steps; resume after `kill -9` |
| 43-45 | Orchestration-as-code for depth (not more agents); sub-agent isolation | Deterministic script-driven evidence collection with bounded workers — the path to depth without breaking the purity of the fold |
| 46-48 | **The right drift**: GitClear signals (duplication, cross-file call density, refactor:copy ratio, error-masking constructs); DORA as outcome label | Evaluators for those signals, **advisory first**; conformance series by `repository_revision` |
| 49-50 | Real enforcement surfaces | `POST /api/v1/hooks/pretooluse` (documented HTTP JSON contract) + a Check Run with `conclusion: failure` as a required check |
| 51-52 | Synthesis | **Repositioning document** with the accumulated evidence: is Architecture Intelligence still the core, or is the product *Attributable Evolution Evidence*? |

> **Q4 Gate — Build / no-build.** You exit with a prioritized roadmap and a publishable number, or with the honest finding that the wedge needs reorienting.

---

## 6. Technologies — master / know / watch

### 6.1 MASTER (12) — without these you cannot design the suite

| Technology | Why it is non-negotiable |
|---|---|
| **Modern MCP (`2026-07-28`)**: stateless, `server/discover`, MRTR, `outputSchema`, annotations, PRM/RFC 8707/9207, CIMD | It breaks your server **in 3 days**. And MRTR *is* your product: approval as protocol |
| **Exit-code semantics + stdout/stderr discipline + NDJSON** | `process.exit(3)` is the cheapest and most cross-agent-neutral control primitive that exists |
| **JSON Schema 2020-12 as capability contract** | Unifies CLI, MCP and REST into one generated registry rather than prose |
| **Evaluation methodology and judge validation** (error analysis, TPR/TNR, κ, Wilson) | The licence to admit AI into a verdict that blocks merges |
| **Format tax / constraint tax and two-pass design** | Schema conformance is an **anti-signal** for correctness unless measured separately |
| **W3C PROV-O** | The exact vocabulary of the lineage model; stable since 2013, zero fad risk |
| **SCITT / RFC 9943 + COSE receipts** | The *standardised* shape of the audit ledger; turns a proprietary moat into something an auditor recognises |
| **OTel GenAI: `gen_ai.evaluation.result` and `mcp.*`** | The wire format for ADR-0111 and ADR-0086; telemetry cannot be backfilled |
| **SCIP + tree-sitter** | How Core reasons about a repo it has never seen without violating ADR-0101 |
| **Reflexion models (intended vs actual)** | Evolith already *is* one, incompletely: the mapping step is missing |
| **Hybrid retrieval (BM25 + dense) and its evaluation** | Settled engineering; Evolith's corpus is queried by exact identifiers |
| **Durable execution / journaling non-determinism** | Auditability comes from **recording** non-determinism, not forbidding it |

### 6.2 KNOW (10) — decide with judgement, do not build

OPA/Rego v1.x and the migration from v0.65 · Agent Skills (`SKILL.md`) and AGENTS.md as a **distribution vehicle, not a control one** · GitHub Checks API and rulesets over agent PRs · Claude Code hooks (`PreToolUse` over HTTP) · RFC 8693 token exchange + SPIFFE/SPIRE · OWASP Agentic Top 10 (ASI01-ASI10) and MITRE ATLAS as **ruleset metadata** · DORA five keys and SPACE as outcome vocabulary (never as your own dashboard) · Apache AGE (the only graph engine worth adding, and only if the SQL series proves insufficient) · FINOS CALM as a second ingest format · Bi-temporal modelling (valid time vs ingestion time) for ADR supersession.

### 6.3 WATCH (8) — abstract behind a port, review per release

Delegated agent identity (ID-JAG is the only WG-adopted profile; OIDC-A/DAAP/AIP remain at `-00`) · EU AI Act after the Digital Omnibus (Annex III deferred to Dec 2027; Art. 50 transparency still Aug 2026) · NIST COSAiS overlays · MCP interceptors and gateway patterns · MCP Server Cards and private registry · SLSA v1.2 / in-toto / Sigstore · Information-flow control against prompt injection (CaMeL, FIDES) · A2A v1.0.

### 6.4 IGNORE deliberately (and why it stings to say so)

| Do not build | Reason |
|---|---|
| **GraphRAG / LLM entity extraction over ADRs** | Imports non-determinism into the core whose promise is the opposite; and it likely will not even improve answers |
| **A graph database** | The lineage is a time series with joins; recursive CTEs in Postgres cover depth ≤4 |
| **OWL / DL reasoners / triplestores** | They duplicate OPA with different semantics: a parity nightmare for zero gain |
| **A dedicated vector DB** | pgvector is already in the schema; the corpus will not reach 10M vectors this decade |
| **Fine-tuning on the corpus** | Freezes a snapshot of rules that change weekly; breaks the `versions{}` contract |
| **ReAct loop, agent memory, swarm topologies** | They multiply gates without adding control; agent memory would compete with Tracker as system of record |
| **Your own coding agent (Hermes/Swarms/Cowork)** | Empty shells that dilute the wedge against Cursor/Copilot/Devin |
| **Your own DORA/SPACE dashboard** | ~10 funded vendors, category commoditizing; Code Climate Velocity already sunset |
| **A post-hoc AI-code detector as fact** | ~3.3% recall with the standard signal; admissible only as a probabilistic quality signal |
| **MCP Sampling, C2PA, MCP Apps, your own sandbox** | Deprecated / wrong layer / solved commodity |

---

## 7. Practical projects — increasing complexity, all against the real repo

| # | Project | Weeks | What it proves |
|---|---|---|---|
| **1** | **Exit codes + surface parity.** Exit taxonomy; one capability registry with schemas; RoboSoft robot #13 invoking every operation via CLI, MCP and REST and asserting identical `data` after canonicalization | 3-4 | That ADR-0073's "surface parity" stops being prose and becomes an executable assertion — and that **`exit 3` governs in Claude Code, Codex, Cursor, pre-commit and Actions with no adapter written for any of them** |
| **2** | **Conformant `evolith-mcp` 2.0.** `server/discover`, `_meta`, delete `sessionId`, MRTR with sealed `requestState`, PRM `.well-known`, `outputSchema` for the 12 kinds, `tools/list` filtered by claims | 4-6 | That HITL survives the absence of sessions — the objection that kills most enforcement designs |
| **3** | **Provenance ledger + typed actor.** Migration #92, `agent_runs` as an append-only stream, a `TransparencyService` with COSE statements and receipts, `evolith-cli audit verify` | 4-6 | That Evolith can attribute architectural change to human vs agent — and that the ledger is **load-bearing** (a rule fails when receipts do not verify), not decorative |
| **4** | **Calibration harness.** 150-200 hand-labelled diffs, `judge:validate` with κ and Wilson, admissibility as a ruleset with Rego parity, **published precision for your current deterministic rules** | 5-6 | The one marketing sentence no catalog or rulefile can imitate: *"our gates have a published false-block rate, per rule and per tenant"* |
| **5** | **Reflexion Pack.** `scip-typescript` → module graph → content-hashed `RepoFacts` → `EvaluationContext` → the `architecture` evaluator → SARIF, run across the last 200 commits | 4-6 | That Core renders a verdict on a repo it has never seen, **from context alone** — validating ADR-0101 under real load — and produces the first genuine accumulation |
| **6** | **Governed C4↔code mapping.** A probabilistic provider proposes bindings; HITL confirms; Tracker persists them versioned; thereafter they are deterministic | 4-6 | That Evolith turns a guess into a governed asset — precisely what Sonar **cannot** do, because it has no approval authority and no waiver authority |
| **7** | **Edit-time gate + drift ledger.** `POST /api/v1/hooks/pretooluse` → `evaluateEdit` → `permissionDecision`, with per-call engine parity and a run event fired to Tracker | 3-4 | A `deny` the agent **obeys mid-edit**; hook p95; block rate and false-block rate, discovered by the author rather than by a customer |
| **8** | **Attributed conformance series.** Replay PRs (public agentic-PR corpus plus a matched human sample) through the orchestrator; deltas on duplication / refactoring / error-masking segmented by authorship | 5-6 | Whether agent-authored code degrades conformance more than human code — a claim no DPIP vendor can make, and **not blocked on deployment** |

**Recommended order:** 1 → 3 → 2 → 4 → 5 → 7 → 6 → 8. Project 3 comes second despite being larger, because it is the only one whose data **is destroyed if you wait**.

---

## 8. Reference architectures to study

1. **Temporal / DBOS — deterministic workflow + journaled activities.** The exact mental model for reconciling audit with LLMs: do not forbid non-determinism, record and replay it.
2. **Anthropic Managed Agents — Session / Harness / Sandbox.** The session as an external event log, the harness disposable. This is the target shape for `IHarnessPort` and the `agent_runs` ledger.
3. **Reflexion models (Murphy/Notkin/Sullivan, FSE 1995).** Names what `structurizr-parser.ts` + `c4-compiler.ts` already are, and what they lack: the mapping.
4. **CodeQL "code as data" and Glean/Angle.** Not to deploy them — for the fact-schema design vocabulary.
5. **Terraform's machine-readable UI.** The reference implementation of the versioned NDJSON stream the CLI lacks.
6. **SCITT (RFC 9943).** The standardised shape of a tamper-evident decision ledger.
7. **GitHub Agentic Workflows (`gh-aw`).** The closest competitor to the CONTROL claim inside CI: read-only token by default, safe-outputs gate, egress firewall, budgets.
8. **Sonar Architecture Management (GA 2026-03-02).** Study it as a **threat**, not an adoption: automatic discovery + intended architecture + quality-gate violations across 5 languages, sold explicitly against AI-caused drift.

---

## 9. Open source repositories to analyse

| Repo | What to extract |
|---|---|
| `open-telemetry/semantic-conventions-genai` | The real `gen_ai.*` and `mcp.*` registry; Development status — pin a commit |
| `open-telemetry/weaver` | Validate your own `evolith.*` semantic registry **with Rego policies** — the same muscle you already have |
| `pgvector/pgvector` | HNSW, iterative scans, `halfvec`; already in your schema |
| `getzep/graphiti` | **The bi-temporal model, not the dependency**: valid time vs ingestion time, facts invalidated rather than deleted |
| `git-ai-project/git-ai` | Line-level attribution via Git Notes, **with no heuristics** — the correct alternative to detectors |
| `modelcontextprotocol/modelcontextprotocol` | The SEPs: 2567, 2575, 2322 (MRTR), 2663 (Tasks), 414 (trace context) |
| `openhands` SDK | Event-sourced agent state with deterministic replay |
| SCIP indexers (`scip-typescript`, etc.) | The producer of `RepoFacts` |
| `dependency-cruiser`, `import-linter`, ArchUnit, Deptrac | The discipline you already chose well: **normalize OSS enforcer output, do not re-parse code** |

---

## 10. Official documentation to follow (standing subscription)

- **MCP specification** — changelog, MRTR, authorization, tools draft, extensions, deprecation lifecycle. *Review: every spec revision.*
- **OpenTelemetry GenAI semconv** — `gen_ai.*`, `mcp.*`, `gen_ai.evaluation.result`. *Review: monthly while it remains Development.*
- **W3C PROV-O** — stable; read once, use forever.
- **IETF: RFC 9943 (SCITT), RFC 9728 (PRM), RFC 8707, RFC 9207, RFC 8693; draft ID-JAG.**
- **OPA / Rego v1.x** — you have a pending v0→v1 migration across 36 policies, with 32 tests as the harness.
- **SCIP** (`scip-code.org`) — now under open governance with a Meta/Uber/Sourcegraph steering committee.
- **OWASP GenAI Security Project** — Agentic Top 10, LLM Top 10.
- **DORA** — annual reports, as outcome vocabulary.
- **Agent Skills / AGENTS.md** — as a distribution vehicle.
- **Claude Code hooks reference** — the `PreToolUse` JSON contract is surface (b).

---

## 11. Certifications — the honest answer

**No AI certification materially serves this goal.** Vendor certificates (Azure AI Engineer, Google ML Engineer, AWS ML) certify platform operation; your problem is evidence-contract design and measurement methodology. There is no certification for that.

The only three with plausible return, all for **commercial** rather than technical reasons:

| Certification | When | Why |
|---|---|---|
| **ISO/IEC 42001 Lead Auditor / Lead Implementer** | Year 2-3, only with Tracker in production | 42006:2025 made certification auditable. It is the enterprise buyer's language, and it teaches you what evidence an auditor demands — which is literally your product |
| **CISSP or equivalent** | Only if the buyer turns out to be the CISO | The compliance wedge points at that budget |
| *(None other)* | — | The time returns ~10× more in the eight projects of §7 |

**The real substitute for a certification: publish.** A technical post with the confusion matrix of your own deterministic rules, or the human-vs-agent conformance series over a public corpus, is worth more than any credential in this category — and **it is** product marketing.

---

## 12. Knowledge matrix — Core × Tracker × CLI × MCP × Agents × Suite

| Knowledge area | Evolith Core | Evolith Tracker | CLI | MCP | Agent Runtime | Suite |
|---|---|---|---|---|---|---|
| **Protocol contracts** (MCP 2026-07, JSON Schema 2020-12) | Versioned readable contracts | — | Exit-code taxonomy; NDJSON | **`server/discover`, MRTR, `outputSchema`, annotations, PRM** | `_meta` trace context | **One capability registry generates all three surfaces** |
| **Provenance & evidence** (PROV-O, SCITT, git-ai) | `Evidence.provenance` as inert data, purely folded | **Signed ledger; `actor_type`; `agent_runs`; COSE receipts** | `audit verify` | `audit.verifyReceipt` (read-only) | Emits provenance at generation time | **The single substrate of the moat** |
| **Measurement & calibration** (TPR/TNR, κ, admissibility) | Admissibility **as a Rego rule with parity** | Persists the calibration record per rule and tenant | `judge:validate` | Verdicts with structured score | Collects signals with validation attached | **The licence to use AI in a gate** |
| **Structured generation** (constraint tax, two-pass, caching) | Never executes an LLM | — | — | **Cache-stable tool registry** (a cost invariant) | `IQualitySignalProvider`: reason → conform | Cost and correctness as design properties |
| **Retrieval** (hybrid, BM25 first, eval) | Only as `qualitySignals` | Serves the index | `knowledge-search` | **Tool #51 + resources/templates for nodes** | `IKnowledgePort` with a trust label | Switch on what is already built |
| **Code intelligence** (SCIP, tree-sitter, reflexion) | **`RepoFacts` as a deterministic member of the context** | Persists the confirmed C4↔code mapping | `repofacts` | `architecture.query` over the fact graph | Extractor outside Core | **The wedge's depth** |
| **Agentic architecture** (durable, harness, orchestration-as-code) | Stays loop-free and stateless | Journal of steps | — | Tasks / MRTR | **Durable workflow; journaling** | Depth without breaking the purity of the fold |
| **Evolution intelligence** (series, DORA, GitClear signals) | Evaluators for those signals, advisory first | **Series by `repository_revision`; drift alerts** | `conformance-series` | Read tool | Labels authorship on the event | **The category nobody occupies** |
| **Governance / compliance** (NIST, EU AI Act, OWASP ASI, ISO 42001) | Taxonomy as ruleset metadata | Annex-IV export; retention | Criteria packs | ABAC on `tools/list` by claims | ABAC per tool-call | **Derived packs — never the identity** |
| **Enforcement** (exit codes, PreToolUse, Checks, Skill) | Pure `evaluateEdit` | Records every denial | **`exit 3` = the product** | Surface (a), the weakest | — | **Cross-agent neutrality by construction** |

**How to read the matrix:** rows 1-3 are year one, and they are almost entirely Tracker + CLI + MCP. Core barely changes. That is the finding: **Evolith's AI-native evolution happens mostly outside Core** — exactly as ADR-0101 requires.

---

## 13. The Future of Evolith — a 3-5 year hypothesis

### The scenario to avoid

Evolith becomes **"another import checker with MCP"**. Sonar auto-discovers architecture for free across five languages; the portals (Port, Cortex) add agents on top of their graph; MCP gateways (Kong, APIM) absorb per-tool-call authorization. Evolith is left with an elegant engine, zero accumulated rows and a closed wedge. **This is today's default scenario**, because nothing runs in production and the declared 12-18 month window has been burning for months.

### The defensible scenario

Evolith stops selling *detection* and becomes the **attributable, calibrated evidence layer** of the agentic SDLC. The sequence:

**Years 0-1 — From engine to instrument.** Typed actor, signed ledger, telemetry on, exit codes that govern, conformant MCP. By the end of year one Evolith can say two sentences nobody else says: *"this violation was introduced by this agent, with this model, in this session, and persisted N revisions"* and *"this rule has this false-block rate, measured"*.

**Years 1-2 — From instrument to calibrated judgement.** `IQualitySignalProvider` gets pointed at the **right drift** — duplication, collapsed refactoring, dead abstraction, abandoned maintenance: all import-legal and therefore invisible to every fitness-function competitor. It enters as probabilistic evidence with a published κ and admissibility decided by policy, not by opinion. Phase Gate 3 moves from existence check to depth **with a number attached**.

**Years 2-3 — From judgement to series.** The time axis appears. Verdict per revision, violation fingerprints stable across tool upgrades, human-vs-agent attribution at generation time. Evolith answers: *is our architecture improving or eroding? what share of the erosion is agentic? which agents and models produce debt that persists?* That is a category — **Attributable Evolution Evidence** — that nobody occupies today, and it is won not by a better parser but by **having started accumulating earlier**.

**Years 3-5 — From series to market.** The accumulated asset is a multi-tenant calibration record: which rules predict real rework, which violations correlate with change failure, which models degrade which dimensions. At that point the regulatory packs (EU AI Act Annex IV, ISO 42001, NIST) stop being plumbing and become **trivial exports of a ledger that is already conformant by design**. And enforcement — commodity by then — sells as a consequence of the record, not the other way round.

### The claim to be able to make in 2029

> *"Evolith is the only system that can tell you, with signed evidence and a published error rate, how your architecture changed, who or what changed it, under which rules in force at that moment, and whether that decision turned out to be right."*

Every word of that sentence is a deliverable of this route: *signed* → SCITT; *published error rate* → calibration; *who or what* → typed actor; *rules in force at that moment* → bi-temporality; *turned out to be right* → DORA as outcome label. None of the five is a language model.

### The real risk, stated plainly

**The risk is not picking the wrong AI technology. It is spending the window learning AI in the abstract while the data that constitutes the moat is not being written.** Telemetry, provenance and authorship **cannot be backfilled**. A late deployment is recoverable; a year of anonymous history is not.

---

## 14. Methodology and verification

- **Product basis:** direct source inspection of `evolith` and `evolith_tracker` by six parallel agents (engine, Tracker, CLI/MCP, Agent Runtime, strategy, AI corpus), under the explicit rule *"where docs and code disagree, code wins"*. The corrected figures in §1 come from that.
- **Domain basis:** ten parallel researchers (one per domain), each required to judge against Evolith's real state and to declare what to ignore. 17 agents, ~1.58M tokens, 617 tool calls.
- **Direct verification (by me, not by an agent)** of the two claims that most change the recommendation:
  - **MCP `2026-07-28`** — confirmed against the official changelog: removal of protocol sessions and `Mcp-Session-Id` (SEP-2567), removal of the `initialize` handshake (SEP-2575), mandatory `server/discover`, the **MRTR** pattern with `InputRequiredResult` (SEP-2322), deprecation of Roots/Sampling/Logging (SEP-2577) and of DCR in favour of CIMD.
  - **Sonar Architecture Management GA 2026-03-02** — confirmed against the official announcement: automatic reverse-engineering with no setup, graphical intended architecture, violations via quality gate, Java/JS/TS/Python/C#, positioned explicitly against drift from AI-generated code.
- **Honest caveat:** the remaining citations (2026 papers, DORA/GitClear/METR figures, standards status) come from agent searches with an instruction to verify URLs. **Before using any of them in an investment or roadmap decision, revalidate against the primary source** — the same rule Evolith's own positioning document already applies.

---

*This document is a professional specialization route, not a syllabus. Its success criterion is not having studied the resources, but that within twelve months Evolith can publish a number about itself that no competitor can publish about theirs.*
