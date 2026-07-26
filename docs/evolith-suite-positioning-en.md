# Evolith as a single product — what it solves, what it competes against

> **Bilingual navigation:** [Versión en Español](evolith-suite-positioning-es.md) · **Unfamiliar term?** [AI-native Glossary](glossary-ai-native-en.md)
>
> **Companion document:** the [Career Path](evolith-ai-career-path-en.md) answers *what to learn*. This one answers *what is being built, and what it competes against*.
>
> **Basis:** direct source inspection of `evolith` and `evolith_tracker`, plus market research across eight categories. Date: 2026-07-26.

---

## Contents

**Part I — The product**
1. [Summary for the decision-maker](#1-summary-for-the-decision-maker)
2. [What Evolith is as a single product](#2-what-evolith-is-as-a-single-product)
3. [The components and the unit](#3-the-components-and-the-unit)

**Part II — The market**
4. [What it actually competes against](#4-what-it-actually-competes-against)
5. [Whole-product comparison](#5-whole-product-comparison)
6. [The category map](#6-the-category-map)

**Part III — The decision**
7. [What must be true to sell the whole](#7-what-must-be-true-to-sell-the-whole)
8. [Who buys this](#8-who-buys-this)
9. [Positioning](#9-positioning)
10. [Relationship to the Career Path](#10-relationship-to-the-career-path)
11. [Methodology and verification](#11-methodology-and-verification)

---

# Part I — The product

## 1. Summary for the decision-maker

*No jargon. If you read one section, read this one.*

**Evolith is hired for one job:** making sure that what gets built matches what was decided — and being able to prove it — now that a large share of the code is written by machines.

Four conclusions from the analysis:

**1 · It replaces nothing. It sells authority.** Evolith does not replace Jira, GitHub, or code-analysis tools. It sits above them and takes exactly **one thing** away: the power to declare a stage approved. That is a harder sale to make and a far harder one to displace.

**2 · Its real competitor is not a product — it is "we'll assemble it ourselves".** The individual pieces — catalogues, rule checkers, policy engines, repository blocking — are mature open source and free. A capable platform team assembles them. What they **never** assemble is the boring part: the record of who did what, signed and accumulated over time.

**3 · None of its five components is defensible on its own.** That is not a design flaw: it is what a suite is. What is defensible is the chain they form together.

**4 · Today the whole does not beat the parts.** Not by design, but by state: nothing has run in production, the error rate has never been measured, and no real audit record exists. Those are three questions every buyer asks in the first meeting, and today all three have the same answer.

> **The practical consequence:** what separates Evolith from being sellable is not features. It is deployment, measurement and accumulation. None of that is research.

---

## 2. What Evolith is as a single product

### 2.1 The job it is hired for

> **Making sure that what gets built matches what was decided — and being able to prove it — now that a large share of the code is written by machines.**

The two halves matter separately. *Making sure* is control. *Being able to prove it* is evidence. The market supplies the first; almost nobody supplies the second.

### 2.2 What it does not replace

A product is defined by what the buyer **stops doing** once they buy it. Here the answer is uncomfortable: **Evolith replaces nothing.**

| Still exists | What Evolith takes from it |
|---|---|
| Jira / Azure DevOps | Nothing. It still organises the work |
| GitHub / GitLab | Nothing. It still hosts the code and runs CI |
| Sonar and equivalents | Nothing. They still analyse quality and structure |
| The AI agent writing code | Nothing. It still writes |

The only thing Evolith takes is **the power to declare a stage approved**.

### 2.3 Why that changes the sales conversation

The buyer's question stops being *"which tool do I pick?"* and becomes:

> **"Who has the final word on whether this reaches production?"**

That is a **sale of authority**, not of features. It has two opposite consequences:

- **Harder to get in.** Nobody cedes authority for a good demo. It takes a crisis, an audit or a mandate.
- **Much harder to remove.** A tool is replaced in a quarter. An authority holding two years of accumulated record is not.

---

## 3. The components and the unit

### 3.1 What each component solves

| Component | For whom | What it solves |
|---|---|---|
| **Core** | The architect | "My decisions do not hold" → turns decisions into executable rules and issues a reproducible verdict |
| **Tracker** | Compliance and leadership | "I cannot prove what happened" → owns the record, the evidence and the signature |
| **CLI** | The developer and the pipeline | "I need this where I work" → universal interface; the [exit code](glossary-ai-native-en.md#exit-code) governs in any environment |
| **[MCP](glossary-ai-native-en.md#mcp)** | The AI agent | "What am I allowed to do here?" → the contract before generating |
| **Agent Runtime** | The team operating agents | "Who supervises the robot?" → policy preflight, human approval and [provenance](glossary-ai-native-en.md#provenance) |

### 3.2 Why none is defensible alone

| Component | Commodity substitute |
|---|---|
| Core | [ArchUnit](glossary-ai-native-en.md#archunit--deptrac--dependency-cruiser--import-linter), Deptrac, Sonar, OPA |
| Tracker | Jira plus an audit plugin; delivery-metrics platforms |
| CLI | Any checker with CI integration |
| [MCP](glossary-ai-native-en.md#mcp) | Any catalogue's read-only MCP |
| Agent Runtime | Any agent framework |

**This is not a pessimistic diagnosis.** It is the definition of a suite: its pieces are commodity and its value is in the composition. The mistake would be trying to win piece by piece.

### 3.3 The chain: the only non-commodity part

```
  decision → rule → violation → owner → evidence → signature → time series
                                   ▲
                    the same rules for people and agents
```

Nobody else holds the whole chain:

- **Code analysis** sees the code, but not the authority or the decision behind it.
- **Developer portals** see the catalogue, but do not block.
- **Delivery metrics** see the flow, but not conformance.
- **Agent gateways** block calls, but do not know which architectural decision was being violated.

### 3.4 The decision rule

> **The components are the commercial surface. The unit is the moat.**
>
> Strengthen a component only when that work **adds a link to the chain**. If it adds no link, it is commodity work — and somebody else will do it better and cheaper.

Applied to concrete decisions:

| Work | Adds a link? | Verdict |
|---|---|---|
| Exit codes in the CLI | Yes — turns advice into control across every environment at once | **Do it** |
| Actor typing in Tracker | Yes — it is the provenance link, and it expires | **Do it now** |
| Published per-rule error rate | Yes — it is what makes the verdict credible | **Do it** |
| A fifty-first MCP tool | No, unless it closes a link | **Justify or drop** |
| A semantic [knowledge graph](glossary-ai-native-en.md#knowledge-graph) | No — it solves a problem you do not have | **Do not** |

---

# Part II — The market

## 4. What it actually competes against

As a whole product, Evolith does not compete against Sonar or Port. It competes against **three complete alternatives**.

### 4.1 The three alternatives

| | What it is | Why it wins today | Its weakness |
|---|---|---|---|
| **A · Do nothing** | A wiki, decisions in three people's heads, manual review | Costs nothing and the pain is invisible | The cost arrives all at once: an audit, an incident, or the day agents multiply the mess |
| **B · Assemble it yourself** | Catalogue + rule checkers + policy engine + repository blocking + work tracker + a homegrown dashboard | **This is the real competitor.** Every piece is free and mature | It consumes two or three platform people permanently, and **nobody assembles the evidence half** |
| **C · Wait for a large player** | The adjacent categories expanding into this ground | They have channel, capital and installed presence | None has approval authority or an evidence chain; they would have to build both |

### 4.2 The real competitor is option B

Against "we'll assemble it ourselves" **you do not win on features**. The free pieces are good and they are free.

You win on what no internal team ever builds, because it is not interesting and it does not demo well: **the attributable record, the signature and the time series.** A platform team assembles detection in a quarter. It does not assemble a record that survives an audit two years later.

### 4.3 The clock

The adjacent players are already moving in:

- **From code analysis upward.** In March 2026 Sonar made architecture management generally available: automatic discovery with no setup, intended architecture, violations in the quality gate, five languages — sold explicitly against the mess AI introduces. *(Verified against the official announcement.)*
- **From catalogue toward governance.** Developer portals are adding agents on top of their graph.
- **From CI toward the [agentic](glossary-ai-native-en.md#agentic).** Repository platforms are beginning to offer agent workflows with validated outputs inside the pipeline itself.

**The detection half of the product is already free.** What remains to defend is the other half.

---

## 5. Whole-product comparison

| | **Assemble it yourself** | **An adjacent expanding** | **Evolith** |
|---|---|---|---|
| **Time to value** | Months, and never finished | Immediate within its slice | Days for detection, months for evidence |
| **Who maintains it** | Two or three people, permanently | The vendor | The vendor |
| **Covers AI agents** | No, unless you build it | Read-only | It is its reason to exist |
| **Leaves an auditable trail** | Almost never | No | **It is the product** |
| **Traceability decision → code → owner** | No | No | **Yes** |
| **Separates human from agent authorship** | No | No | **Yes (by design)** |
| **Vendor neutrality** | Total | None | High, by design |
| **Switching cost once inside** | N/A | Low | High, and growing with the record |
| **Proven maturity** | Each piece's own | High | **None yet** |

That last row is what decides today, and it is the only one in the red.

---

## 6. The category map

*Reference for technical conversations. The comparison that decides a purchase is §5.*

| Category | Evolith's posture |
|---|---|
| **Architecture analysis** | Detection cannot be won: it is already free and automatic. The win is the **governed [mapping](glossary-ai-native-en.md#mapping)** — discovering structure requires no approval or waiver authority; Evolith has both |
| **Developer portals** | They expose their catalogue to agents read-only. Evolith claims control — but its current surface is the one an agent can decline |
| **[Policy-as-code](glossary-ai-native-en.md#policy-as-code)** | Not a competitor: it is Evolith's engine. It governs infrastructure, not application architecture |
| **Delivery metrics** | A saturated, commoditizing category. **Integrate, never compete** |
| **Agent gateways** | They will own per-call authorization. The play is to **be the policy plane they consult**, not one more server in a list |
| **[Agentic](glossary-ai-native-en.md#agentic) CI** | The closest competitor to control inside the pipeline |
| **Work management** | High overlap on the broad narrative. **Do not fight there** |
| **AI observability** | Consume as an evidence provider behind a port. Do not reimplement |

### The uncontested lane

**Attributable, calibrated, time-series** evidence of how an architecture evolves under mixed human and agent authorship.

No competitor can currently state: *"this violation was introduced by this agent, with this model, persisted N revisions, under these rules in force at the time — and our false-block rate is this."*

---

# Part III — The decision

## 7. What must be true to sell the whole

A buyer evaluating Evolith as a whole product asks three questions in the first meeting. Today all three have the same answer:

| The question | Today's answer | What fixes it |
|---|---|---|
| "Who runs this in production?" | Nobody | Deploy |
| "What is the error rate of your blocks?" | Unmeasured | Measure the rules that already exist |
| "Show me a customer's record" | It does not exist | Type the actor and accumulate |

**None is fixed by more features.** And all three are the same four actions the [Career Path](evolith-ai-career-path-en.md) marks as priorities — which confirms they are not technical debt but **sales requirements**.

> One of the three **expires**: a change's authorship can only be recorded at the moment it happens. Every day of operation without recording it is record lost for good.

---

## 8. Who buys this

| Buyer | Their pain | Urgency today | Budget |
|---|---|---|---|
| **CTO / VP Engineering** | "We are scaling agents that write code and I do not know what they are doing to our architecture" | **High, with no packaged answer** | Yes |
| **Head of Architecture** | "My decisions do not hold" | Chronic, tolerated for years | Thin |
| **CISO / Compliance** | "I have to demonstrate conformance" | Medium — regulatory deadlines moved to 2027 | Yes, and large |

**The natural way in during 2026 is the first.** It is an acute, recent pain with no product answering it, and the person feeling it holds budget. The third is the expansion: same record, different invoice, larger ticket.

The second is the user, not the buyer. Worth not confusing them.

---

## 9. Positioning

### 9.1 The sentence

> **Evolith is your architecture's record: what was decided, what was built, who did it — person or agent — and under which rules in force at the time. Signed, and with a published error rate.**

### 9.2 Why it works

- **It does not promise to detect better than anyone.** That promise is already free and cannot be won.
- **It promises to accumulate what nobody else accumulates.** And what has accumulated cannot be copied — only started earlier.
- **It speaks the 2026 buyer's language**, not a feature catalogue's.

### 9.3 The caveat

**That sentence describes a product that does not yet exist.** It is the target, not the state.

Using it in a demo today invites the question *"show me"*, and the answer would be §7. It is for **aligning the roadmap**, not for selling this week.

### 9.4 What is sellable today

Honestly, the detection half — the commoditized one. The conclusion is not to soften the message but to **shorten the time until it can be backed**: deploy, measure, start accumulating.

---

## 10. Relationship to the Career Path

The two documents say the same thing from opposite sides of the table.

| | [Career Path](evolith-ai-career-path-en.md) | This document |
|---|---|---|
| **Answers** | What to learn, and in what order | What is being built, and against what |
| **Reader** | Whoever designs the next generation | Whoever decides where to invest |
| **Conclusion** | Instrument → measure → then generate | Deploy → measure → accumulate |

That two independent analyses — one about learning, one about market — converge on the same four actions is the strongest finding in either.

---

## 11. Methodology and verification

- **Product basis:** direct source inspection of `evolith` and `evolith_tracker`, under the rule that where documentation and code disagree, code wins.
- **Direct verification:** Sonar's move (architecture management reaching general availability, 2 March 2026) was checked against the official announcement, being the fact that most conditions the recommendation.
- **Caveat:** the rest of the competitive landscape comes from [multi-agent](glossary-ai-native-en.md#multi-agent--swarm) research. **Revalidate against primary sources before using it in an investment decision.**
- **Nature of this document:** it is a positioning analysis, not an approved decision. Any conclusion that becomes an architectural commitment needs its own decision record.

---

*This document is reviewed whenever Evolith's capability or any evaluated platform's position changes materially.*
