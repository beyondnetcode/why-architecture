# Evolith AI Career Path — A specialization route for designing the AI-native suite

> **Bilingual navigation:** [Versión en Español](evolith-ai-career-path-es.md) · **Unfamiliar term?** [AI-native Glossary](glossary-ai-native-en.md) — every technical term in the text links to its definition with an example.
>
> **Basis:** direct source inspection of the real `evolith` and `evolith_tracker` repositories (not their documentation), plus [multi-agent](glossary-ai-native-en.md#multi-agent--swarm) research across 10 domains against primary sources. Date: 2026-07-25.

---

## 0. Understanding this in five minutes

*This section assumes no technical background. If you only read one part of the document, read this one.*

### The building site nobody is writing down

Building software resembles putting up a building. There are blueprints, there are bricklayers, and someone confirms at each stage that what was built matches what was approved. **Evolith does that job**, and its promise is that architecture decisions actually hold.

But Evolith is not one piece, and the distinction matters for everything that follows:

| The piece | On the site | What it does |
|---|---|---|
| **Evolith Core** | The inspector and the building code | Knows what is permitted, examines what was built and issues a ruling. It **files nothing**: by design it does not remember, and its ruling **is not the final signature**. |
| **Evolith Tracker** | The site office | Keeps the logbook, records who approved what and when, and **is the one that signs**. |
| **CLI, MCP and API** | The site gates | Where people, automation and robots talk to the inspector. |

That the inspector files nothing is not a defect: it is what lets it issue the same ruling on the same facts every time, with no memory to contaminate it. **The inspector recommends; the office decides.**

What changed in the last two years is who lays the bricks. There are now **robot bricklayers** — AI agents — raising walls faster than any human crew. They are quick, obedient and tireless. And they do not look at the blueprints unless someone imposes them.

So far, Evolith's original thesis is right, and it stays right.

This review's finding is a different one, and it is uncomfortable. **The inspector is well built** — years of solid engineering behind it — but **the site office has never opened**. Tracker has never been put to work on a real site: zero inspections recorded, zero pages written, **the logbook blank**.

And here is the detail that makes it urgent: **the logbook can only be written while the work happens.** A year from now, nobody will be able to reconstruct who laid which brick.

### The five findings, in plain terms

**1 · The valuable thing is the logbook, not a cleverer blueprint.**

The earlier plan proposed building an intelligent model of the building: a map relating everything to everything. It is the intellectually attractive answer, and it is the wrong one.

What makes an inspection irreplaceable is not its model. It is the office's logbook: *who* did this, *when*, and *under which version of the code in force that day*. No competitor has that, and it cannot be copied — only accumulated.

An important design note: **that logbook lives in Tracker, not in Core.** Core cannot hold it without ceasing to be what it is. Much of the route that follows is therefore Tracker work.

> **The concrete case.** A 2026 study across 180 million repositories tried to work out, after the fact, which code an AI had written. The method essentially the whole industry relies on recovered **3 cases in 100**. The conclusion is brutal in its simplicity: either you write it down as it happens, or you lose it forever.

**2 · Nobody has measured how often the inspector is wrong.**

Evolith rejects work. It blocks deliveries that fail the rules. But nobody has ever measured **how often it rejects work that was actually fine**.

That is the number deciding whether the product gets used or switched off. An inspector who stops one in three correct deliveries does not get corrected — he gets bypassed. The crew finds a way around him.

And there is a bigger reputational risk. The day Evolith adds AI to its judgements, the first wrong block will be blamed on the AI — with not one data point to show the system already failed at the same rate before.

> **Hence the document's key sentence:** measuring is not bureaucratic overhead, it is **the permission to use AI at all**. Without a published figure, an automated judgement is an opinion in good formatting.

**3 · It is watching for the wrong damage.**

Evolith checks that walls stand where the blueprints say. That is a legitimate check… and it is not where the robots do damage.

Evidence measured across hundreds of millions of real changes says the deterioration AI introduces is different: **it repeats the same work in eight slightly different places instead of reusing what exists, it stops tidying what is becoming untidy, and it never goes back to repair the old sections.**

Translated to the site: every wall is exactly where the blueprint says. But eight different mortars went into the same partition, nobody removes the scaffolding, and no old section is ever revisited. **A "walls in the right place" inspection passes that site without a single objection.**

> **And the clock is running.** On 2 March 2026 a large competitor (Sonar) began giving away precisely that "walls in the right place" check: automatic, zero setup, five languages, and sold explicitly against the mess AI creates. The detection half of Evolith's advantage became free.

**4 · The gate everyone trusts is the one that can be walked around.**

Today Evolith's main control is a service the agent **may consult** before writing code. The problem is in those two words: may consult. Nothing compels it.

It is a rulebook resting on a table at the site entrance. The robot that never opens it is entirely ungoverned.

Real control sits where the truck must pass: **the check that blocks the merge in the code system**, the hook firing *before* the change lands, and — cheapest of all — **the plain result code the tool returns**, which every system in the world understands with no integration required.

**5 · Which is why the learning order inverts.**

The earlier proposal was: learn AI, then apply it to governance. The right order for *this* product is the opposite:

> **First record. Then measure whether you are right. And only then let AI judge.**

### What is at stake, and when

Three facts, unadorned:

| | |
|---|---|
| **Nothing has ever run in production** | The system is built but has never been deployed. Zero records accumulated. Everything else depends on this. |
| **The declared advantage has an expiry date** | Evolith's own strategy gives itself 12 to 18 months before someone else takes the ground. Part of that is already spent. |
| **The competitor has already moved** | March 2026. Not a future threat: a product on the market. |

### Where to start

The single most important point of the whole analysis is this: **the four highest-impact actions require no AI learning at all.**

| # | Action | Where it happens | Effort |
|---|---|---|---|
| **1** | **Write down who does what.** Distinguish in the record between "a person did this" and "an agent did this, with this model, in this session". **It is the only one that expires**: what is not written down today is never recoverable. | **Tracker** | Days |
| **2** | **Make the tool say *why* it failed** in a way any system understands. It turns advice into control, across every environment at once, without writing an integration for each. | **CLI** | Weeks |
| **3** | **Publish the error rate of the rules that already exist.** It is what makes the product sellable to a risk officer, and nobody in this category can currently claim it. | **Core + Tracker** | Weeks |
| **4** | **Open the office**: deploy Tracker, so the logbook starts filling. | **Tracker** | Blocked, awaiting a decision |

None of the four is a research project. All four are unstarted. And three of the four are **Tracker** work rather than Core — which is where the analysis departs most from the initial intuition.

### The question driving everything else

It is not *"what AI must I learn?"*. It is:

> **What must I master so that Evolith can state, with signed evidence and a published error rate, how an architecture evolves when people and agents build it together?**

Everything that follows — technologies, calendar, projects — is justified only insofar as it serves that sentence.

### How to read the rest

| If you are… | Read |
|---|---|
| **An executive or product owner** | This section and [13, *The Future of Evolith*](#13-the-future-of-evolith--a-3-5-year-hypothesis). That gives you the diagnosis and the bet. |
| **An architect or technical lead** | Add sections 1 to 3 (real state and diagnosis) and 7 (projects). |
| **Whoever executes the route** | The whole document. Sections 4 to 12 are the operating plan: calendar, technologies, references and knowledge matrix. |

*From here the text turns technical and assumes engineering vocabulary. Every term links to its definition with an example in the [glossary](glossary-ai-native-en.md).*

---

## 1. The product's real state (what the code says, not the docs)

Necessary because **Evolith's documentation carries systematic drift against its code**, and a learning route built on the docs would learn the wrong product.

| Component | Verified in code | Docs claim |
|---|---|---|
| **Core** | 12 `EvaluationKinds`, **only 7 KindEvaluators**; `design` and `phase-artifacts` always PASS | 10 kinds |
| **Rulesets** | 20 directories; 167 `*.rules.json` (**126 auto-generated**); 36 `.rego` + 32 `.test.rego` | 26 categories |
| **[MCP](glossary-ai-native-en.md#mcp)** | **50 tools, 12 resources, 8 prompts**; SDK 1.29.0; zero [`outputSchema`](glossary-ai-native-en.md#outputschema--structuredcontent), zero annotations, no [PRM](glossary-ai-native-en.md#prm-protected-resource-metadata-rfc-9728) `.well-known` | 47/11/8 |
| **CLI** | **35 commands**; 29 use the ADR-0073 envelope; **20 × `process.exit(1)`, a single value**; ~320 `console.log` vs 9 [stderr](glossary-ai-native-en.md#stdout--stderr) writes; no [NDJSON](glossary-ai-native-en.md#ndjson) | 31 commands |
| **Agent Runtime** | **17 ports, 49 adapters**; **single-pass pipeline, no [ReAct loop](glossary-ai-native-en.md#react-loop)**; one `plan()` call; Hermes/Swarms/Cowork are empty shells | 16/38 |
| **Tracker** | .NET 10, EF Core, **91 migrations**; 12 RoboSoft robots; real [HITL](glossary-ai-native-en.md#hitl-human-in-the-loop) (`/runtime-approvals`) | — |
| **[RAG](glossary-ai-native-en.md#rag) (ADR-0090/0112)** | [pgvector](glossary-ai-native-en.md#pgvector) 1024-dim [HNSW](glossary-ai-native-en.md#hnsw) + Qwen3 sidecar + delta sync + 38 green tests — **never switched on; zero chunks indexed; no MCP search tool** | "shipped" |
| **OPA** | pinned at **v0.65.0**; upstream is at v1.18.2; `npm opa-wasm` no release since Nov 2024 | — |

**The seam that changes everything:** **ADR-0111 `IQualitySignalProvider`**. Evolith has already designed and shipped the sanctioned seam through which non-determinism enters the engine: as `EvaluationContext.qualitySignals`, carrying `Evidence{determinism, findings, provenance{collectedBy, adapterVersion, artifactHash}}`, collected in agent-runtime (Core never executes a provider) and folded deterministically. **Every piece of AI Evolith adds must enter through it.** This does not need inventing — it needs pointing at the right thing, and measuring.

**And the three defects that define the next twelve months:**

1. `tracker_governance.audit_entries.actor_id` is a `Guid` with **no human/machine discriminator**, no agent_id, model_id or session_id. There is no `agent_runs` table. **Evolith cannot answer its own founding question.**
2. `core_evaluation_transactions` already carries `repository_revision` — and **nothing reads it as a series**. No `metric_snapshots`, no `drift_alerts`, no SCM webhook ingest. *The product is named for evolution and has no time dimension.*
3. **GT-435/GT-448 (P0): nothing has ever run in production.** `VPS_DEPLOY_ENABLED` was never set. Zero rows accumulated in the "accumulated audit graph" the positioning document calls the stronger half of the moat.

---

## 2. Critique of your conceptual decomposition

You proposed nine pieces: Core, Tracker, CLI, [MCP](glossary-ai-native-en.md#mcp), AI/Agents, Knowledge, Governance, Evidence, Intelligence. **Five are components; four are not — and treating those four as products is the expensive mistake.**

| Piece | Verdict | Reason |
|---|---|---|
| **Core, Tracker, CLI, MCP, Agent Runtime** | ✅ Real components | They exist in code, with boundaries and contracts. Correct. |
| **Evolith Governance** | ❌ Not a component | It *is* Core. Rulesets, OPA policies and phase gates already are that. Splitting it duplicates the engine. |
| **Evolith Knowledge** | ❌ Not a product | It is `IKnowledgePort` plus an adapter. Promoting it to a product is how you end up building a full [RAG](glossary-ai-native-en.md#rag) stack that is never switched on (already happened). |
| **Evolith Evidence** and **Intelligence** | ⚠️ **The same thing seen twice** | Both are projections over **one substrate**: the attributable, timestamped record. "Evidence" is its point-in-time reading; "Intelligence" is its reading as a series. One substrate, two views. |

**The piece that does matter and you did not name: the enforcement adapters.** Exit codes, the `PreToolUse` hook, the [Check Run](glossary-ai-native-en.md#checks-api--check-run), the Agent Skill. That is where CONTROL lives, and it is absent from your mental model.

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

**Professional identity on completion:** the architect who can turn a deterministic governance system into one that **measures its own reliability** and **records attributable [provenance](glossary-ai-native-en.md#provenance)** — and can therefore admit AI without losing auditability.

Master: protocol contracts (modern [MCP](glossary-ai-native-en.md#mcp), [JSON Schema 2020-12](glossary-ai-native-en.md#json-schema-2020-12), exit-code semantics), evidence-schema design, provenance and verifiable ledgers ([PROV-O](glossary-ai-native-en.md#prov-o), [SCITT](glossary-ai-native-en.md#scitt-rfc-9943)/RFC 9943, OTel GenAI), and **evaluation methodology** ([error analysis](glossary-ai-native-en.md#error-analysis), chance-corrected [judge validation](glossary-ai-native-en.md#judge-validation), evals in CI).

Why first: provenance data **cannot be backfilled**. The Khosravani & Mockus census across 180M repositories shows post-hoc AI-authorship detection recovering ~3.3% using the signal the whole market relies on. Every day without a typed actor is permanently anonymous history.

### Year 2 — *The calibrator of judgement* (stages 3-5)

**Identity:** the architect who knows **where and how to insert probabilistic judgement inside a deterministic engine** without breaking the audit contract — and can prove it with numbers.

Master: structured generation and its measured costs ([format tax](glossary-ai-native-en.md#format-tax) / [constraint tax](glossary-ai-native-en.md#constraint-tax), two-pass reason-then-conform design, [prompt caching](glossary-ai-native-en.md#prompt-caching) as an architectural constraint on the tool registry), deterministic code intelligence ([SCIP](glossary-ai-native-en.md#scip), [tree-sitter](glossary-ai-native-en.md#tree-sitter), reflexion models, the LLM-assisted and human-confirmed [mapping](glossary-ai-native-en.md#mapping) step), and [durable execution](glossary-ai-native-en.md#durable-execution) with [journaling](glossary-ai-native-en.md#journaling).

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
| 1-2 | **Urgent:** [MCP](glossary-ai-native-en.md#mcp) `2026-07-28` changelog, [MRTR](glossary-ai-native-en.md#mrtr-multi-round-trip-requests) pattern, authorization ([PRM](glossary-ai-native-en.md#prm-protected-resource-metadata-rfc-9728) RFC 9728, [RFC 8707](glossary-ai-native-en.md#rfc-8707-resource-indicators), [RFC 9207](glossary-ai-native-en.md#rfc-9207-iss), [CIMD](glossary-ai-native-en.md#cimd-client-id-metadata-documents)) | Migration plan for `@beyondnet/evolith-mcp`; delete `sessionId`; add [`server/discover`](glossary-ai-native-en.md#serverdiscover) |
| 3-5 | Exit-code semantics; [`clig.dev`](glossary-ai-native-en.md#cligdev); Terraform machine-readable UI; MCP Tools draft (`outputSchema`, [`structuredContent`](glossary-ai-native-en.md#outputschema--structuredcontent), annotations) | **Exit-code taxonomy** (0 PASS / 2 usage / 3 **verdict FAIL** / 1 infra / 4 [HITL](glossary-ai-native-en.md#hitl-human-in-the-loop)) + stdout-stderr discipline, governed by its own ruleset with Rego parity |
| 6-8 | [JSON Schema 2020-12](glossary-ai-native-en.md#json-schema-2020-12); one capability registry | `capability-registry.json` with real `inputSchema`/`outputSchema`; delete hand-written `TOOL_SCHEMAS`; RoboSoft robot #13 for surface parity |
| 9-11 | **[PROV-O](glossary-ai-native-en.md#prov-o)**; [SCITT](glossary-ai-native-en.md#scitt-rfc-9943) **RFC 9943**; OTel GenAI conventions (`gen_ai.evaluation.result`, `mcp.*`); [`git-ai`](glossary-ai-native-en.md#git-ai) / [Git Notes](glossary-ai-native-en.md#git-notes) | Migration #92: `actor_type`, `agent_id`, `model_id`, `session_id` + `agent_runs` table; telemetry switched on with tenant/initiative/actor attributes |
| 12-13 | MRTR as the HITL mechanism; Enterprise-Managed Authorization / [ID-JAG](glossary-ai-native-en.md#id-jag) | HITL gate re-expressed as [`InputRequiredResult`](glossary-ai-native-en.md#inputrequiredresult) with an AEAD-sealed [`requestState`](glossary-ai-native-en.md#requeststate) binding principal + digest + TTL |

> **Q1 Gate — *Nothing further is learned until the actor is typed and the clock is running.*** If `audit_entries` still has no discriminator at quarter's end, everything after it is built on anonymous history.

### Q2 (weeks 14-26) — Measurement and calibration · ~78 h

| Wk | Focus | Deliverable |
|---|---|---|
| 14-16 | [Error analysis](glossary-ai-native-en.md#error-analysis) first; Hamel Husain *Evals FAQ*; Anthropic *Demystifying evals* (outcome over trajectory) | Hand-labelled set: ~150-200 real diffs from the Evolith repos, binary, against **one** narrow rubric; human-human κ as the ceiling |
| 17-19 | [Judge validation](glossary-ai-native-en.md#judge-validation): [TPR](glossary-ai-native-en.md#tpr--tnr)/TNR, Cohen's κ, Wilson intervals; biases (verbosity dominates, position now near-dead); *Reliability without Validity* | `evolith-cli judge:validate` returning a [confusion matrix](glossary-ai-native-en.md#confusion-matrix) + κ + [CI95](glossary-ai-native-en.md#wilson-interval--ci95) in the ADR-0073 envelope |
| 20-22 | **Calibrate the deterministic side first** | Published per-ruleset precision for the rules you already ship, mined from `core_evaluation_transactions` × `gate_decisions` (every human override is a free label) |
| 23-24 | Admissibility as policy | `probabilistic-evidence-admissibility.rules.json` + parity `.rego`/`.test.rego`: probabilistic evidence may block only if `tpr ≥ θ₁ ∧ tnr ≥ θ₂ ∧ age ≤ θ₃`; otherwise it degrades to advisory |
| 25-26 | Compatibility gates for model updates; `model-registry.json` | A CI gate that re-runs the frozen labelled set on model upgrade and blocks if TPR/TNR falls outside the interval |

> **Q2 Gate — *Can you publish the false-block rate of your current gates?*** If not, do not add AI to the verdict: measure what you already ship first.

### Q3 (weeks 27-39) — Structured generation and code intelligence · ~78 h

| Wk | Focus | Deliverable |
|---|---|---|
| 27-29 | [Constrained decoding](glossary-ai-native-en.md#constrained-decoding); **[format tax](glossary-ai-native-en.md#format-tax)** and **[constraint tax](glossary-ai-native-en.md#constraint-tax)**; [two-pass design](glossary-ai-native-en.md#two-pass-design-reason-then-conform); [prompt caching](glossary-ai-native-en.md#prompt-caching) as an architectural constraint | `LlmArchitectureDriftProvider` behind `quality-signal-provider.port.ts`: free-form reasoning plus a separate constrained extraction; cached prefix holding the rule corpus |
| 30-32 | [Context engineering](glossary-ai-native-en.md#context-engineering); [just-in-time retrieval](glossary-ai-native-en.md#just-in-time-retrieval); switch the dormant [RAG](glossary-ai-native-en.md#rag) on | MCP tool #51 `knowledge-search`, **hybrid with [BM25](glossary-ai-native-en.md#bm25) first** over identifiers; `EVOLITH_RAG_SYNC` enabled; retrieval [eval](glossary-ai-native-en.md#eval) [harness](glossary-ai-native-en.md#harness) in CI |
| 33-36 | **[SCIP](glossary-ai-native-en.md#scip)** (open governance since Mar 2026), [tree-sitter](glossary-ai-native-en.md#tree-sitter), [stack-graphs](glossary-ai-native-en.md#stack-graphs); reflexion models (Murphy/Notkin/Sullivan) | `RepoFacts`: a content-hashed structural fact pack, extracted **outside** Core, entering as a deterministic member of `EvaluationContext` |
| 37-39 | LLM-assisted [mapping](glossary-ai-native-en.md#mapping) (ExArch-style, F1 ~0.86); [FINOS CALM](glossary-ai-native-en.md#finos-calm) as an ingest format | **The C4↔code mapping as a governed asset**: the model proposes, HITL confirms, Tracker persists it versioned → thereafter it is deterministic input |

> **Q3 Gate — Substrate decision.** Does Core receive `RepoFacts` inline (honouring ADR-0101), or does Tracker own them? Document and close it; it conditions everything downstream.

### Q4 (weeks 40-52) — Evolution, durability and the wedge's depth · ~78 h

| Wk | Focus | Deliverable |
|---|---|---|
| 40-42 | Library-mode [durable execution](glossary-ai-native-en.md#durable-execution) on the existing Postgres; [session-as-event-log](glossary-ai-native-en.md#event-sourcing--session-as-event-log) | `handleStream` as a durable workflow: `plan()`, harness, each provider and Core's evaluate as journaled steps; resume after `kill -9` |
| 43-45 | [Orchestration-as-code](glossary-ai-native-en.md#orchestration-as-code) for depth (not more agents); [sub-agent isolation](glossary-ai-native-en.md#sub-agent-isolation) | Deterministic script-driven evidence collection with bounded workers — the path to depth without breaking the purity of the fold |
| 46-48 | **The right drift**: [GitClear signals](glossary-ai-native-en.md#gitclear-signals) (duplication, cross-file call density, refactor:copy ratio, error-masking constructs); [DORA](glossary-ai-native-en.md#dora) as outcome label | Evaluators for those signals, **advisory first**; conformance series by `repository_revision` |
| 49-50 | Real enforcement surfaces | `POST /api/v1/hooks/pretooluse` (documented HTTP JSON contract) + a [Check Run](glossary-ai-native-en.md#checks-api--check-run) with `conclusion: failure` as a required check |
| 51-52 | Synthesis | **Repositioning document** with the accumulated evidence: is Architecture Intelligence still the core, or is the product *Attributable Evolution Evidence*? |

> **Q4 Gate — Build / no-build.** You exit with a prioritized roadmap and a publishable number, or with the honest finding that the wedge needs reorienting.

---

## 6. Technologies — master / know / watch

### 6.1 MASTER (12) — without these you cannot design the suite

| Technology | Why it is non-negotiable |
|---|---|
| **Modern [MCP](glossary-ai-native-en.md#mcp) (`2026-07-28`)**: stateless, [`server/discover`](glossary-ai-native-en.md#serverdiscover), [MRTR](glossary-ai-native-en.md#mrtr-multi-round-trip-requests), [`outputSchema`](glossary-ai-native-en.md#outputschema--structuredcontent), annotations, [PRM](glossary-ai-native-en.md#prm-protected-resource-metadata-rfc-9728)/RFC 8707/9207, [CIMD](glossary-ai-native-en.md#cimd-client-id-metadata-documents) | It breaks your server **in 3 days**. And MRTR *is* your product: approval as protocol |
| **Exit-code semantics + [stdout](glossary-ai-native-en.md#stdout--stderr)/stderr discipline + [NDJSON](glossary-ai-native-en.md#ndjson)** | `process.exit(3)` is the cheapest and most cross-agent-neutral control primitive that exists |
| **[JSON Schema 2020-12](glossary-ai-native-en.md#json-schema-2020-12) as capability contract** | Unifies CLI, MCP and REST into one generated registry rather than prose |
| **Evaluation methodology and [judge validation](glossary-ai-native-en.md#judge-validation)** ([error analysis](glossary-ai-native-en.md#error-analysis), [TPR](glossary-ai-native-en.md#tpr--tnr)/TNR, κ, Wilson) | The licence to admit AI into a verdict that blocks merges |
| **[Format tax](glossary-ai-native-en.md#format-tax) / [constraint tax](glossary-ai-native-en.md#constraint-tax) and [two-pass design](glossary-ai-native-en.md#two-pass-design-reason-then-conform)** | Schema conformance is an **anti-signal** for correctness unless measured separately |
| **W3C [PROV-O](glossary-ai-native-en.md#prov-o)** | The exact vocabulary of the lineage model; stable since 2013, zero fad risk |
| **[SCITT](glossary-ai-native-en.md#scitt-rfc-9943) / RFC 9943 + [COSE](glossary-ai-native-en.md#cose) receipts** | The *standardised* shape of the audit ledger; turns a proprietary moat into something an auditor recognises |
| **OTel GenAI: `gen_ai.evaluation.result` and `mcp.*`** | The wire format for ADR-0111 and ADR-0086; telemetry cannot be backfilled |
| **[SCIP](glossary-ai-native-en.md#scip) + [tree-sitter](glossary-ai-native-en.md#tree-sitter)** | How Core reasons about a repo it has never seen without violating ADR-0101 |
| **Reflexion models (intended vs actual)** | Evolith already *is* one, incompletely: the [mapping](glossary-ai-native-en.md#mapping) step is missing |
| **Hybrid retrieval ([BM25](glossary-ai-native-en.md#bm25) + dense) and its evaluation** | Settled engineering; Evolith's corpus is queried by exact identifiers |
| **[Durable execution](glossary-ai-native-en.md#durable-execution) / [journaling](glossary-ai-native-en.md#journaling) non-determinism** | Auditability comes from **recording** non-determinism, not forbidding it |

### 6.2 KNOW (10) — decide with judgement, do not build

OPA/Rego v1.x and the migration from v0.65 · [Agent Skills](glossary-ai-native-en.md#agent-skills--skillmd) (`SKILL.md`) and [AGENTS.md](glossary-ai-native-en.md#agentsmd) as a **distribution vehicle, not a control one** · GitHub [Checks API](glossary-ai-native-en.md#checks-api--check-run) and rulesets over agent PRs · Claude Code hooks (`PreToolUse` over HTTP) · [RFC 8693](glossary-ai-native-en.md#rfc-8693-token-exchange) [token](glossary-ai-native-en.md#token) exchange + [SPIFFE](glossary-ai-native-en.md#spiffe--spire)/SPIRE · [OWASP Agentic Top 10](glossary-ai-native-en.md#owasp-agentic-top-10-asi01-asi10) (ASI01-ASI10) and [MITRE ATLAS](glossary-ai-native-en.md#mitre-atlas) as **ruleset metadata** · [DORA](glossary-ai-native-en.md#dora) five keys and [SPACE](glossary-ai-native-en.md#space) as outcome vocabulary (never as your own dashboard) · Apache AGE (the only graph engine worth adding, and only if the SQL series proves insufficient) · [FINOS CALM](glossary-ai-native-en.md#finos-calm) as a second ingest format · Bi-temporal modelling (valid time vs ingestion time) for ADR supersession.

### 6.3 WATCH (8) — abstract behind a port, review per release

Delegated agent identity ([ID-JAG](glossary-ai-native-en.md#id-jag) is the only WG-adopted profile; OIDC-A/DAAP/AIP remain at `-00`) · [EU AI Act](glossary-ai-native-en.md#eu-ai-act) after the [Digital Omnibus](glossary-ai-native-en.md#digital-omnibus) (Annex III deferred to Dec 2027; Art. 50 transparency still Aug 2026) · NIST COSAiS overlays · MCP interceptors and gateway patterns · MCP Server Cards and private registry · [SLSA](glossary-ai-native-en.md#slsa) v1.2 / in-toto / [Sigstore](glossary-ai-native-en.md#in-toto--sigstore) · [Information-flow control](glossary-ai-native-en.md#information-flow-control-camel-fides) against [prompt injection](glossary-ai-native-en.md#prompt-injection) (CaMeL, FIDES) · [A2A](glossary-ai-native-en.md#a2a-agent-to-agent) v1.0.

### 6.4 IGNORE deliberately (and why it stings to say so)

| Do not build | Reason |
|---|---|
| **[GraphRAG](glossary-ai-native-en.md#graphrag) / [LLM](glossary-ai-native-en.md#llm) entity extraction over ADRs** | Imports non-determinism into the core whose promise is the opposite; and it likely will not even improve answers |
| **A graph database** | The lineage is a time series with joins; recursive CTEs in Postgres cover depth ≤4 |
| **[OWL](glossary-ai-native-en.md#owl--dl-reasoner) / DL reasoners / triplestores** | They duplicate OPA with different semantics: a parity nightmare for zero gain |
| **A dedicated vector DB** | [pgvector](glossary-ai-native-en.md#pgvector) is already in the schema; the corpus will not reach 10M vectors this decade |
| **[Fine-tuning](glossary-ai-native-en.md#fine-tuning) on the corpus** | Freezes a snapshot of rules that change weekly; breaks the `versions{}` contract |
| **[ReAct loop](glossary-ai-native-en.md#react-loop), [agent memory](glossary-ai-native-en.md#agent-memory), [swarm](glossary-ai-native-en.md#multi-agent--swarm) topologies** | They multiply gates without adding control; agent memory would compete with Tracker as system of record |
| **Your own coding agent (Hermes/Swarms/Cowork)** | Empty shells that dilute the wedge against Cursor/Copilot/Devin |
| **Your own DORA/SPACE dashboard** | ~10 funded vendors, category commoditizing; Code Climate Velocity already sunset |
| **A post-hoc AI-code detector as fact** | ~3.3% recall with the standard signal; admissible only as a probabilistic quality signal |
| **MCP Sampling, C2PA, MCP Apps, your own [sandbox](glossary-ai-native-en.md#sandbox)** | Deprecated / wrong layer / solved commodity |

---

## 7. Practical projects — increasing complexity, all against the real repo

| # | Project | Weeks | What it proves |
|---|---|---|---|
| **1** | **Exit codes + surface parity.** Exit taxonomy; one capability registry with schemas; RoboSoft robot #13 invoking every operation via CLI, [MCP](glossary-ai-native-en.md#mcp) and REST and asserting identical `data` after canonicalization | 3-4 | That ADR-0073's "surface parity" stops being prose and becomes an executable assertion — and that **`exit 3` governs in Claude Code, Codex, Cursor, pre-commit and Actions with no adapter written for any of them** |
| **2** | **Conformant `evolith-mcp` 2.0.** [`server/discover`](glossary-ai-native-en.md#serverdiscover), `_meta`, delete `sessionId`, [MRTR](glossary-ai-native-en.md#mrtr-multi-round-trip-requests) with sealed [`requestState`](glossary-ai-native-en.md#requeststate), [PRM](glossary-ai-native-en.md#prm-protected-resource-metadata-rfc-9728) `.well-known`, [`outputSchema`](glossary-ai-native-en.md#outputschema--structuredcontent) for the 12 kinds, `tools/list` filtered by claims | 4-6 | That [HITL](glossary-ai-native-en.md#hitl-human-in-the-loop) survives the absence of sessions — the objection that kills most enforcement designs |
| **3** | **[Provenance](glossary-ai-native-en.md#provenance) ledger + typed actor.** Migration #92, `agent_runs` as an [append-only](glossary-ai-native-en.md#append-only) stream, a `TransparencyService` with [COSE](glossary-ai-native-en.md#cose) statements and receipts, `evolith-cli audit verify` | 4-6 | That Evolith can attribute architectural change to human vs agent — and that the ledger is **load-bearing** (a rule fails when receipts do not verify), not decorative |
| **4** | **Calibration [harness](glossary-ai-native-en.md#harness).** 150-200 hand-labelled diffs, `judge:validate` with κ and Wilson, admissibility as a ruleset with Rego parity, **published precision for your current deterministic rules** | 5-6 | The one marketing sentence no catalog or rulefile can imitate: *"our gates have a published false-block rate, per rule and per tenant"* |
| **5** | **Reflexion Pack.** `scip-typescript` → module graph → content-hashed `RepoFacts` → `EvaluationContext` → the `architecture` evaluator → [SARIF](glossary-ai-native-en.md#sarif), run across the last 200 commits | 4-6 | That Core renders a verdict on a repo it has never seen, **from context alone** — validating ADR-0101 under real load — and produces the first genuine accumulation |
| **6** | **Governed C4↔code [mapping](glossary-ai-native-en.md#mapping).** A probabilistic provider proposes bindings; HITL confirms; Tracker persists them versioned; thereafter they are deterministic | 4-6 | That Evolith turns a guess into a governed asset — precisely what Sonar **cannot** do, because it has no approval authority and no waiver authority |
| **7** | **Edit-time gate + drift ledger.** `POST /api/v1/hooks/pretooluse` → `evaluateEdit` → `permissionDecision`, with per-call engine parity and a run event fired to Tracker | 3-4 | A `deny` the agent **obeys mid-edit**; hook p95; block rate and false-block rate, discovered by the author rather than by a customer |
| **8** | **Attributed conformance series.** Replay PRs (public agentic-PR corpus plus a matched human sample) through the orchestrator; deltas on duplication / refactoring / error-masking segmented by authorship | 5-6 | Whether agent-authored code degrades conformance more than human code — a claim no [DPIP](glossary-ai-native-en.md#dpip--sei-platform) vendor can make, and **not blocked on deployment** |

**Recommended order:** 1 → 3 → 2 → 4 → 5 → 7 → 6 → 8. Project 3 comes second despite being larger, because it is the only one whose data **is destroyed if you wait**.

---

## 8. Reference architectures to study

1. **Temporal / DBOS — deterministic workflow + journaled activities.** The exact mental model for reconciling audit with LLMs: do not forbid non-determinism, record and replay it.
2. **Anthropic Managed Agents — Session / [Harness](glossary-ai-native-en.md#harness) / [Sandbox](glossary-ai-native-en.md#sandbox).** The session as an external event log, the harness disposable. This is the target shape for `IHarnessPort` and the `agent_runs` ledger.
3. **Reflexion models (Murphy/Notkin/Sullivan, FSE 1995).** Names what `structurizr-parser.ts` + `c4-compiler.ts` already are, and what they lack: the [mapping](glossary-ai-native-en.md#mapping).
4. **[CodeQL](glossary-ai-native-en.md#codeql) "code as data" and Glean/Angle.** Not to deploy them — for the fact-schema design vocabulary.
5. **Terraform's machine-readable UI.** The reference implementation of the versioned [NDJSON](glossary-ai-native-en.md#ndjson) stream the CLI lacks.
6. **[SCITT](glossary-ai-native-en.md#scitt-rfc-9943) (RFC 9943).** The standardised shape of a tamper-evident decision ledger.
7. **GitHub [Agentic](glossary-ai-native-en.md#agentic) Workflows ([`gh-aw`](glossary-ai-native-en.md#gh-aw-github-agentic-workflows)).** The closest competitor to the CONTROL claim inside CI: read-only [token](glossary-ai-native-en.md#token) by default, safe-outputs gate, egress firewall, budgets.
8. **Sonar Architecture Management (GA 2026-03-02).** Study it as a **threat**, not an adoption: automatic discovery + intended architecture + quality-gate violations across 5 languages, sold explicitly against AI-caused drift.

---

## 9. Open source repositories to analyse

| Repo | What to extract |
|---|---|
| `open-telemetry/semantic-conventions-genai` | The real `gen_ai.*` and `mcp.*` registry; Development status — pin a commit |
| `open-telemetry/weaver` | Validate your own `evolith.*` semantic registry **with Rego policies** — the same muscle you already have |
| `pgvector/pgvector` | [HNSW](glossary-ai-native-en.md#hnsw), iterative scans, `halfvec`; already in your schema |
| `getzep/graphiti` | **The bi-temporal model, not the dependency**: valid time vs ingestion time, facts invalidated rather than deleted |
| `git-ai-project/git-ai` | Line-level attribution via [Git Notes](glossary-ai-native-en.md#git-notes), **with no heuristics** — the correct alternative to detectors |
| `modelcontextprotocol/modelcontextprotocol` | The SEPs: 2567, 2575, 2322 ([MRTR](glossary-ai-native-en.md#mrtr-multi-round-trip-requests)), 2663 (Tasks), 414 (trace context) |
| `openhands` SDK | Event-sourced agent state with deterministic replay |
| [SCIP](glossary-ai-native-en.md#scip) indexers (`scip-typescript`, etc.) | The producer of `RepoFacts` |
| [`dependency-cruiser`](glossary-ai-native-en.md#archunit--deptrac--dependency-cruiser--import-linter), `import-linter`, ArchUnit, Deptrac | The discipline you already chose well: **normalize OSS enforcer output, do not re-parse code** |

---

## 10. Official documentation to follow (standing subscription)

- **[MCP](glossary-ai-native-en.md#mcp) specification** — changelog, [MRTR](glossary-ai-native-en.md#mrtr-multi-round-trip-requests), authorization, tools draft, extensions, deprecation lifecycle. *Review: every spec revision.*
- **[OpenTelemetry](glossary-ai-native-en.md#opentelemetry-otel) GenAI semconv** — `gen_ai.*`, `mcp.*`, `gen_ai.evaluation.result`. *Review: monthly while it remains Development.*
- **W3C [PROV-O](glossary-ai-native-en.md#prov-o)** — stable; read once, use forever.
- **IETF: RFC 9943 ([SCITT](glossary-ai-native-en.md#scitt-rfc-9943)), RFC 9728 ([PRM](glossary-ai-native-en.md#prm-protected-resource-metadata-rfc-9728)), [RFC 8707](glossary-ai-native-en.md#rfc-8707-resource-indicators), [RFC 9207](glossary-ai-native-en.md#rfc-9207-iss), [RFC 8693](glossary-ai-native-en.md#rfc-8693-token-exchange); draft [ID-JAG](glossary-ai-native-en.md#id-jag).**
- **OPA / Rego v1.x** — you have a pending v0→v1 migration across 36 policies, with 32 tests as the [harness](glossary-ai-native-en.md#harness).
- **[SCIP](glossary-ai-native-en.md#scip)** (`scip-code.org`) — now under open governance with a Meta/Uber/Sourcegraph steering committee.
- **OWASP GenAI Security Project** — [Agentic](glossary-ai-native-en.md#agentic) Top 10, [LLM](glossary-ai-native-en.md#llm) Top 10.
- **[DORA](glossary-ai-native-en.md#dora)** — annual reports, as outcome vocabulary.
- **[Agent Skills](glossary-ai-native-en.md#agent-skills--skillmd) / [AGENTS.md](glossary-ai-native-en.md#agentsmd)** — as a distribution vehicle.
- **Claude Code hooks reference** — the `PreToolUse` JSON contract is surface (b).

---

## 11. Certifications — the honest answer

**No AI certification materially serves this goal.** Vendor certificates (Azure AI Engineer, Google ML Engineer, AWS ML) certify platform operation; your problem is evidence-contract design and measurement methodology. There is no certification for that.

The only three with plausible return, all for **commercial** rather than technical reasons:

| Certification | When | Why |
|---|---|---|
| **[ISO/IEC 42001](glossary-ai-native-en.md#isoiec-42001) Lead Auditor / Lead Implementer** | Year 2-3, only with Tracker in production | 42006:2025 made certification auditable. It is the enterprise buyer's language, and it teaches you what evidence an auditor demands — which is literally your product |
| **CISSP or equivalent** | Only if the buyer turns out to be the CISO | The compliance wedge points at that budget |
| *(None other)* | — | The time returns ~10× more in the eight projects of §7 |

**The real substitute for a certification: publish.** A technical post with the [confusion matrix](glossary-ai-native-en.md#confusion-matrix) of your own deterministic rules, or the human-vs-agent conformance series over a public corpus, is worth more than any credential in this category — and **it is** product marketing.

---

## 12. Knowledge matrix — Core × Tracker × CLI × MCP × Agents × Suite

| Knowledge area | Evolith Core | Evolith Tracker | CLI | [MCP](glossary-ai-native-en.md#mcp) | Agent Runtime | Suite |
|---|---|---|---|---|---|---|
| **Protocol contracts** (MCP 2026-07, [JSON Schema 2020-12](glossary-ai-native-en.md#json-schema-2020-12)) | Versioned readable contracts | — | Exit-code taxonomy; [NDJSON](glossary-ai-native-en.md#ndjson) | **[`server/discover`](glossary-ai-native-en.md#serverdiscover), [MRTR](glossary-ai-native-en.md#mrtr-multi-round-trip-requests), [`outputSchema`](glossary-ai-native-en.md#outputschema--structuredcontent), annotations, [PRM](glossary-ai-native-en.md#prm-protected-resource-metadata-rfc-9728)** | `_meta` trace context | **One capability registry generates all three surfaces** |
| **[Provenance](glossary-ai-native-en.md#provenance) & evidence** ([PROV-O](glossary-ai-native-en.md#prov-o), [SCITT](glossary-ai-native-en.md#scitt-rfc-9943), [git-ai](glossary-ai-native-en.md#git-ai)) | `Evidence.provenance` as inert data, purely folded | **Signed ledger; `actor_type`; `agent_runs`; [COSE](glossary-ai-native-en.md#cose) receipts** | `audit verify` | `audit.verifyReceipt` (read-only) | Emits provenance at generation time | **The single substrate of the moat** |
| **Measurement & calibration** ([TPR](glossary-ai-native-en.md#tpr--tnr)/TNR, κ, admissibility) | Admissibility **as a Rego rule with parity** | Persists the calibration record per rule and tenant | `judge:validate` | Verdicts with structured score | Collects signals with validation attached | **The licence to use AI in a gate** |
| **Structured generation** ([constraint tax](glossary-ai-native-en.md#constraint-tax), two-pass, caching) | Never executes an [LLM](glossary-ai-native-en.md#llm) | — | — | **Cache-stable tool registry** (a cost invariant) | `IQualitySignalProvider`: reason → conform | Cost and correctness as design properties |
| **Retrieval** (hybrid, [BM25](glossary-ai-native-en.md#bm25) first, [eval](glossary-ai-native-en.md#eval)) | Only as `qualitySignals` | Serves the index | `knowledge-search` | **Tool #51 + resources/templates for nodes** | `IKnowledgePort` with a trust label | Switch on what is already built |
| **Code intelligence** ([SCIP](glossary-ai-native-en.md#scip), [tree-sitter](glossary-ai-native-en.md#tree-sitter), reflexion) | **`RepoFacts` as a deterministic member of the context** | Persists the confirmed C4↔code [mapping](glossary-ai-native-en.md#mapping) | `repofacts` | `architecture.query` over the fact graph | Extractor outside Core | **The wedge's depth** |
| **[Agentic](glossary-ai-native-en.md#agentic) architecture** (durable, [harness](glossary-ai-native-en.md#harness), [orchestration-as-code](glossary-ai-native-en.md#orchestration-as-code)) | Stays loop-free and stateless | Journal of steps | — | Tasks / MRTR | **Durable workflow; [journaling](glossary-ai-native-en.md#journaling)** | Depth without breaking the purity of the fold |
| **Evolution intelligence** (series, [DORA](glossary-ai-native-en.md#dora), [GitClear signals](glossary-ai-native-en.md#gitclear-signals)) | Evaluators for those signals, advisory first | **Series by `repository_revision`; drift alerts** | `conformance-series` | Read tool | Labels authorship on the event | **The category nobody occupies** |
| **Governance / compliance** (NIST, [EU AI Act](glossary-ai-native-en.md#eu-ai-act), OWASP ASI, ISO 42001) | Taxonomy as ruleset metadata | Annex-IV export; retention | Criteria packs | ABAC on `tools/list` by claims | ABAC per tool-call | **Derived packs — never the identity** |
| **Enforcement** (exit codes, PreToolUse, Checks, Skill) | Pure `evaluateEdit` | Records every denial | **`exit 3` = the product** | Surface (a), the weakest | — | **Cross-agent neutrality by construction** |

**How to read the matrix:** rows 1-3 are year one, and they are almost entirely Tracker + CLI + MCP. Core barely changes. That is the finding: **Evolith's AI-native evolution happens mostly outside Core** — exactly as ADR-0101 requires.

---

## 13. The Future of Evolith — a 3-5 year hypothesis

### The scenario to avoid

Evolith becomes **"another import checker with [MCP](glossary-ai-native-en.md#mcp)"**. Sonar auto-discovers architecture for free across five languages; the portals (Port, Cortex) add agents on top of their graph; MCP gateways (Kong, APIM) absorb per-tool-call authorization. Evolith is left with an elegant engine, zero accumulated rows and a closed wedge. **This is today's default scenario**, because nothing runs in production and the declared 12-18 month window has been burning for months.

### The defensible scenario

Evolith stops selling *detection* and becomes the **attributable, calibrated evidence layer** of the [agentic](glossary-ai-native-en.md#agentic) SDLC. The sequence:

**Years 0-1 — From engine to instrument.** Typed actor, signed ledger, telemetry on, exit codes that govern, conformant MCP. By the end of year one Evolith can say two sentences nobody else says: *"this violation was introduced by this agent, with this model, in this session, and persisted N revisions"* and *"this rule has this false-block rate, measured"*.

**Years 1-2 — From instrument to calibrated judgement.** `IQualitySignalProvider` gets pointed at the **right drift** — duplication, collapsed refactoring, dead abstraction, abandoned maintenance: all import-legal and therefore invisible to every fitness-function competitor. It enters as probabilistic evidence with a published κ and admissibility decided by policy, not by opinion. Phase Gate 3 moves from existence check to depth **with a number attached**.

**Years 2-3 — From judgement to series.** The time axis appears. Verdict per revision, violation fingerprints stable across tool upgrades, human-vs-agent attribution at generation time. Evolith answers: *is our architecture improving or eroding? what share of the [erosion](glossary-ai-native-en.md#architecture-drift--erosion) is agentic? which agents and models produce debt that persists?* That is a category — **Attributable Evolution Evidence** — that nobody occupies today, and it is won not by a better parser but by **having started accumulating earlier**.

**Years 3-5 — From series to market.** The accumulated asset is a multi-tenant calibration record: which rules predict real rework, which violations correlate with change failure, which models degrade which dimensions. At that point the regulatory packs ([EU AI Act](glossary-ai-native-en.md#eu-ai-act) [Annex IV](glossary-ai-native-en.md#annex-iv), ISO 42001, NIST) stop being plumbing and become **trivial exports of a ledger that is already conformant by design**. And enforcement — commodity by then — sells as a consequence of the record, not the other way round.

### The claim to be able to make in 2029

> *"Evolith is the only system that can tell you, with signed evidence and a published error rate, how your architecture changed, who or what changed it, under which rules in force at that moment, and whether that decision turned out to be right."*

Every word of that sentence is a deliverable of this route: *signed* → [SCITT](glossary-ai-native-en.md#scitt-rfc-9943); *published error rate* → calibration; *who or what* → typed actor; *rules in force at that moment* → [bi-temporality](glossary-ai-native-en.md#bi-temporality); *turned out to be right* → [DORA](glossary-ai-native-en.md#dora) as outcome label. None of the five is a language model.

### The real risk, stated plainly

**The risk is not picking the wrong AI technology. It is spending the window learning AI in the abstract while the data that constitutes the moat is not being written.** Telemetry, [provenance](glossary-ai-native-en.md#provenance) and authorship **cannot be backfilled**. A late deployment is recoverable; a year of anonymous history is not.

---

## 14. Methodology and verification

- **Product basis:** direct source inspection of `evolith` and `evolith_tracker` by six parallel agents (engine, Tracker, CLI/MCP, Agent Runtime, strategy, AI corpus), under the explicit rule *"where docs and code disagree, code wins"*. The corrected figures in §1 come from that.
- **Domain basis:** ten parallel researchers (one per domain), each required to judge against Evolith's real state and to declare what to ignore. 17 agents, ~1.58M tokens, 617 tool calls.
- **Direct verification (by me, not by an agent)** of the two claims that most change the recommendation:
  - **[MCP](glossary-ai-native-en.md#mcp) `2026-07-28`** — confirmed against the official changelog: removal of protocol sessions and `Mcp-Session-Id` (SEP-2567), removal of the `initialize` handshake (SEP-2575), mandatory [`server/discover`](glossary-ai-native-en.md#serverdiscover), the **[MRTR](glossary-ai-native-en.md#mrtr-multi-round-trip-requests)** pattern with [`InputRequiredResult`](glossary-ai-native-en.md#inputrequiredresult) (SEP-2322), deprecation of Roots/Sampling/Logging (SEP-2577) and of [DCR](glossary-ai-native-en.md#dcr-dynamic-client-registration-rfc-7591) in favour of [CIMD](glossary-ai-native-en.md#cimd-client-id-metadata-documents).
  - **Sonar Architecture Management GA 2026-03-02** — confirmed against the official announcement: automatic reverse-engineering with no setup, graphical intended architecture, violations via quality gate, Java/JS/TS/Python/C#, positioned explicitly against drift from AI-generated code.
- **Honest caveat:** the remaining citations (2026 papers, [DORA](glossary-ai-native-en.md#dora)/GitClear/METR figures, standards status) come from agent searches with an instruction to verify URLs. **Before using any of them in an investment or roadmap decision, revalidate against the primary source** — the same rule Evolith's own positioning document already applies.

---

*This document is a professional specialization route, not a syllabus. Its success criterion is not having studied the resources, but that within twelve months Evolith can publish a number about itself that no competitor can publish about theirs.*
