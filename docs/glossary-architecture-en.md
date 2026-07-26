# Architecture and SDLC Glossary

> **Bilingual navigation:** [Leer en Español](glosario-arquitectura-es.md) · **Document that uses it:** [Architecture: The Foundation of Estimation](why-architecture-en.md) · **AI-era vocabulary:** [AI-native Glossary](glossary-ai-native-en.md)
>
> Each term: **one sentence of definition** and **one short example**. Grouped by family. Covers the architecture, quality and lifecycle vocabulary used by this repository's articles; AI, agent and protocol vocabulary lives in the [AI-native glossary](glossary-ai-native-en.md).

---

## 1. The productivity triad

### SDD *(Spec-Driven Development)*
An approach where the executable specification is the contract governing design, written **before** the code.
*Example:* if the spec says the Transport module requires a UUID `Route_ID`, no room for interpretation is left.

### AI-DD *(AI-Driven Development)*
Using autonomous AI agents — not autocompletion — to build, refactor and verify system modules.
*Example:* the agent reads the approved specification and generates code respecting the boundaries it imposes.

### Production Harnesses
The infrastructure wrapping the application so that failing is safe and controlled.
*Example:* circuit breakers, feature flags, contract testing and shadow traffic acting at runtime or in the pipeline.

### SSOT *(Single Source of Truth)*
A single authoritative origin for each datum or decision, from which everything else derives.
*Example:* the OpenAPI specification as the contract's only truth — not the code, not the wiki.

### BMAD
An open-source methodology for structuring development through AI agents.
*Example:* it defines agent roles and phases so the AI does not improvise the process.

### Boilerplate
Repetitive, mechanical code that follows from the contract and carries no decisions.
*Example:* turning an OpenAPI schema into DTOs and validators — the work worth delegating.

---

## 2. Design and boundaries

### DDD *(Domain-Driven Design)*
Design that organises software around the business domain and its language rather than technical layers.
*Example:* the code says "Shipping Note" because that is what the business calls it.

### Bounded Context
An explicit boundary within which a domain term has exactly one meaning.
*Example:* "Customer" in Billing and "Customer" in Transport are distinct entities, not one shared model.

### Ubiquitous Language
A single shared vocabulary between business and code inside a context.
*Example:* if the business says "Bonded Warehouse", the class is not named `TempWarehouse`.

### Hexagonal Architecture *(ports and adapters)*
A style where the domain sits at the centre and everything external enters through ports with swappable adapters.
*Example:* moving off PostgreSQL touches an adapter, not the business logic.

### Clean Architecture
A family of styles with the same idea as hexagonal: dependencies point inward at the domain, never outward.
*Example:* the domain does not import the ORM; the ORM implements an interface the domain defines.

### Modular Monolith
A single deployable with strict internal boundaries between modules.
*Example:* the sensible starting point — it lets you extract a microservice later without rewriting the domain.

### Microservices
Independently deployable services, each owning its own data.
*Example:* justified when two teams genuinely need different deployment rhythms, not by fashion.

### Big Ball of Mud
A system with no discernible boundaries, where everything depends on everything.
*Example:* the usual destination of "being agile" read as "not defining the architecture".

### Platform Core
Shared foundational capabilities every module consumes instead of reimplementing.
*Example:* identity, events and audit solved once for the whole suite.

### C4
A four-level diagram model: context, containers, components and code.
*Example:* level 1 is what you show the business; level 3 is what the building team needs.

### Technical debt
The accumulated future cost of decisions taken to move fast.
*Example:* not inherently bad — dangerous when nobody records it or pays it down.

### SOLID
Five object-oriented design principles aimed at code you can change without breaking it.
*Example:* the highest-return one in practice is single responsibility.

---

## 3. Contracts and integration

### API-First
Designing and agreeing the API contract before implementing either side of it.
*Example:* frontend and backend start in parallel on day one, against the same contract.

### OpenAPI
The standard for describing REST APIs in a machine-readable way.
*Example:* clients, mocks and tests all generate from one OpenAPI file.

### AsyncAPI
The OpenAPI equivalent for asynchronous, event-driven APIs.
*Example:* it documents which events each domain publishes, and in what shape.

### Contract Testing
Tests verifying that consumer and provider still honour the agreed contract.
*Example:* Pact fails the provider's pipeline when it would break a real consumer, before production.

### Consumer-Driven Contracts
A variant where the consumer declares what it needs and the provider commits to it.
*Example:* it stops providers maintaining fields nobody consumes any more.

### API versioning
A strategy for evolving a contract without breaking existing consumers.
*Example:* `/api/v2` living alongside `/api/v1` while consumers migrate at their own pace.

### Anti-Corruption Layer *(ACL)*
A translation layer preventing an external system's model from contaminating your own.
*Example:* a legacy ERP's identifiers and statuses are mapped before entering the domain.

---

## 4. Data and consistency

### ACID
The four transactional guarantees: atomicity, consistency, isolation and durability.
*Example:* either stock is decremented and the invoice issued, or neither happens.

### Eventual consistency
A model where replicas converge over time rather than immediately.
*Example:* acceptable in a report; unacceptable in an account balance.

### Idempotency
The property that repeating an operation yields the same result as performing it once.
*Example:* if the client retries a payment after a timeout, it is not charged twice.

### Saga
A pattern coordinating a distributed transaction as a sequence of steps with compensations.
*Example:* if billing fails, the compensation releases the stock that had been reserved.

### Transactional Outbox
A pattern writing the event in the same transaction as the data, and publishing it afterwards.
*Example:* it eliminates "I saved the order but the event was lost".

### CQRS
Separating the write model from the read model.
*Example:* useful when queries and commands have very different shapes and loads; needless otherwise.

### Event Sourcing
Storing the sequence of events as the truth and deriving state from it.
*Example:* it lets you reconstruct the balance at any past moment, not just the current one.

### MDM *(Master Data Management)*
Governing shared master data so it means the same thing in every module.
*Example:* one product catalogue instead of five drifting copies.

### DB-per-module *(schema per context)*
Each module owns its data and nobody reads it from underneath.
*Example:* forbidding cross-schema joins is what makes extracting a service possible later.

### DLQ *(Dead Letter Queue)*
A queue holding messages that could not be processed, for inspection and reprocessing.
*Example:* it stops one poisoned message blocking the main queue indefinitely.

---

## 5. Resilience and operations

### Circuit Breaker
A mechanism that stops calling a failing dependency and retries later.
*Example:* if the customs service goes down, you stop hammering it and the main system keeps operating.

### Graceful degradation
Deciding in advance which functionality is sacrificed when something fails.
*Example:* if route calculation is unavailable, accept the order and plan it afterwards.

### Feature Flag *(feature toggle)*
A switch enabling or disabling functionality without deploying code.
*Example:* turn a feature on for 5% of users and revert within seconds if it misbehaves.

### Canary Release
Deploying to a small fraction of traffic before going to 100%.
*Example:* if errors rise in that 5%, propagation stops.

### Shadow Traffic
Sending a copy of real traffic to the new version without its responses counting.
*Example:* it measures behaviour under production load at zero risk.

### Zero-Downtime
Deployments and migrations with no unavailability window.
*Example:* it requires backward-compatible schemas during the transition.

### Chaos Engineering
Deliberately injecting failures to confirm the defences actually work.
*Example:* killing a replica during working hours, on purpose, and verifying nobody notices.

### Auto-healing
The system's ability to detect and replace unhealthy components without intervention.
*Example:* the orchestrator restarts the container that stopped answering its health check.

### SLA / SLO / SLI
The contractual commitment, the internal target and the metric that measures it.
*Example:* SLI = p95 latency; SLO = under 200 ms; SLA = what you contractually promise the customer.

### p95 / percentile
The value below which that percentage of observations falls.
*Example:* the average lies; p95 tells you what the user having a bad time experiences.

### Observability
The ability to answer new questions about a system from what it emits.
*Example:* not "having logs" — being able to find out why that specific order took 8 seconds.

### End-to-end tracing
Following one request across every service it touches.
*Example:* it cuts error diagnosis from days to minutes.

### AIOps
Applying analytics and AI over telemetry to detect and correlate incidents.
*Example:* alerting on an aggregate symptom instead of on each metric's individual threshold.

---

## 6. Security and governance

### Zero Trust
Trusting nothing by virtue of its network position: verify every request.
*Example:* being inside the perimeter grants no access on its own.

### RBAC / ABAC
Authorization by assigned role, versus authorization by attributes of the request and its context.
*Example:* RBAC: "auditors may read". ABAC: "may read if auditor **and** the record is in their country".

### OAuth2 / OIDC
The authorization-delegation standard, and the identity layer built on top of it.
*Example:* OAuth2 grants access to a resource; OIDC tells you **who** the user is.

### Defence in depth
Layering independent controls so no single one is the only point of failure.
*Example:* validating at the gateway, in the service and in the database.

### OWASP ASVS
An application security verification standard, with graded levels of rigour.
*Example:* it works as a checkable requirements list, not as vague advice.

### ADR *(Architecture Decision Record)*
A short record of an architectural decision: context, alternatives, decision and consequences.
*Example:* it stops the team re-litigating every six months why that choice was made.

### Quality Gate
A pipeline checkpoint that blocks progress when objective criteria are unmet.
*Example:* minimum coverage, zero critical vulnerabilities, no architecture violations.

### Fitness Function
An automated test continuously verifying an architectural property.
*Example:* a test that fails when one module imports another context's domain.

### IDP *(Internal Developer Platform)*
An internal platform giving teams governed self-service over infrastructure.
*Example:* Backstage as a catalogue and a portal of approved templates.

### NFR *(non-functional requirement)*
A requirement about how the system must behave, not about what it does.
*Example:* "sustain 500 orders per minute at p95 under 200 ms" — measurable, not aspirational.

---

## 7. Lifecycle and delivery

### SDLC
The full software lifecycle, from idea to production and its operation.
*Example:* discovery → design → construction → QA → release.

### MVP
The smallest version that lets you validate the hypothesis with real users.
*Example:* minimal in scope, not in the quality of structural decisions that will be expensive to reverse.

### WBS *(Work Breakdown Structure)*
A breakdown of the work into estimable pieces.
*Example:* it is the **consequence** of having the designs, not the starting point.

### IaC *(Infrastructure as Code)*
Defining infrastructure in versioned files and applying them reproducibly.
*Example:* it removes "it works on my machine" and the server nobody knows how to recreate.

### CI/CD
Continuous integration and continuous delivery or deployment.
*Example:* every commit is built and verified; every approved change can reach production without ceremony.

### Testing pyramid
Many unit tests, fewer integration tests, few end-to-end tests.
*Example:* inverting it produces slow, brittle suites nobody trusts.

### Mutation Testing
Introducing deliberate faults into the code to check whether the tests catch them.
*Example:* it measures test quality, which coverage does not.

### TDD
Writing the test before the code that satisfies it.
*Example:* its real value is the design it induces, more than the coverage it produces.

### Maturity model *(levels 1-4)*
A scale declaring the engineering rigour required on each quality axis.
*Example:* level 1 ships fast and accrues debt; level 4 demands advanced patterns and full automation.

### Deliverable-based estimation
Estimating from the architectural assets required, rather than from a list of features.
*Example:* this repository's central thesis — without the 15 deliverables, an estimate is a gamble.

---

## 8. Scalability and deployment

### Vertical / horizontal scaling
Giving one instance more resources, versus adding more instances.
*Example:* vertical hits a physical ceiling; horizontal requires the service to hold no state.

### Serverless
A model where the provider manages execution and you pay per use, scaling to zero.
*Example:* it fits intermittent load; it penalises sustained low-latency workloads.

### Kubernetes
A container orchestrator managing deployment, scaling and recovery.
*Example:* it solves a great deal and costs real effort to operate; not a new product's starting point.

### EDA *(Event-Driven Architecture)*
An architecture where components communicate by publishing and reacting to events.
*Example:* the route to real decoupling, at the price of harder debugging.

### API Gateway
A single entry point routing, authenticating and rate-limiting traffic to services.
*Example:* it concentrates cross-cutting policy instead of repeating it in every service.

### Cloud-agnostic
Designing so the provider can change without rewriting business logic.
*Example:* it has a real cost; justified by provider risk or a regulatory mandate, not by principle.

---

*If an architecture or lifecycle term is missing, add it here. If it belongs to AI, agents or protocols, it goes in the [AI-native Glossary](glossary-ai-native-en.md).*
