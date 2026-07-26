# Evolith AI Career Path — Ruta de especialización para diseñar la suite AI-native

> **Navegación bilingüe:** [Read in English](evolith-ai-career-path-en.md)
>
> **Sustituye** a [`evolith-ai-native-route-es.md`](evolith-ai-native-route-es.md) y a [`evolith-ai-native-plan-es.md`](evolith-ai-native-plan-es.md). Aquellos partían de "aprender IA aplicada a architecture governance". Este parte de la pregunta correcta: **¿qué debo dominar para diseñar Evolith Core + Tracker + CLI + MCP + Agents como un ecosistema AI-native?** — y llega a una respuesta distinta.
>
> **Base:** inspección directa del código real de `evolith` y `evolith_tracker` (no de su documentación), más investigación multiagente sobre 10 dominios con fuentes primarias. Fecha: 2026-07-25.

---

## 0. Resumen ejecutivo — la tesis corregida

La propuesta anterior asumía que el cuello de botella de Evolith era **conocimiento de IA**. No lo es.

El cuello de botella es que **el dato que constituye el foso no existe todavía, y cada día que el sistema corre sin instrumentar se destruye permanentemente parte de él**. Las tres o cuatro decisiones de mayor impacto en los próximos doce meses casi no requieren IA nueva: tipar una columna, definir códigos de salida, publicar un Check Run, firmar una decisión.

De ahí se siguen cinco correcciones fuertes:

| # | Corrección | Por qué |
|---|---|---|
| **1** | **El foso no es el grafo de conocimiento. Es el registro de procedencia atribuible.** | La lineage que Evolith necesita es un *time series con joins*, no un problema de traversal. El grafo semántico sobre prosa de ADRs importa no-determinismo al único sistema cuya promesa es el veredicto reproducible. |
| **2** | **Determinismo ≠ corrección.** Evolith bloquea merges sin haber medido nunca su tasa de falsos positivos. | El día que un gate con IA bloquee mal, la culpa irá al LLM y no habrá dato para demostrar lo contrario. **La calibración es la licencia para usar IA en absoluto.** |
| **3** | **El wedge apunta al drift equivocado.** | La evidencia longitudinal 2026 dice que el daño de la IA es duplicación, refactor colapsado y mantenimiento abandonado — **todo legal en términos de imports**. Las 167 reglas de frontera son ciegas a ello. Y el 2-mar-2026 Sonar sacó GA la mitad detectora del wedge, gratis y auto-descubierta. |
| **4** | **MCP es la superficie de control más débil, no la más fuerte.** | MCP es cooperativo con el cliente: el agente que no lo invoca queda íntegramente ingobernado. El control real vive donde el agente no puede esquivarlo: **código de salida, hook `PreToolUse`, Checks API, gateway**. |
| **5** | **La secuencia de aprendizaje se invierte.** | Tu hipótesis empieza en fundamentos de IA y termina en governance. Para *este* producto el orden correcto es: **instrumentar → medir → recién entonces generar**. |

**La pregunta que debe guiar la ruta no es "¿qué IA necesito aprender?" sino:**

> **¿Qué debo dominar para que Evolith pueda afirmar, con evidencia firmada y una tasa de error publicada, cómo evoluciona una arquitectura cuando humanos y agentes la escriben juntos?**

Todo lo demás — RAG, grafos, agentes, orquestación — es medio o distracción según sirva o no a esa frase.

---

## 1. El estado real del producto (lo que el código dice, no los docs)

Necesario porque **la documentación de Evolith tiene drift sistemático con el código**, y una ruta de aprendizaje construida sobre los docs aprendería el producto equivocado.

| Componente | Realidad verificada en código | Doc dice |
|---|---|---|
| **Core** | 12 `EvaluationKinds`, **solo 7 KindEvaluators**; `design` y `phase-artifacts` siempre PASS | 10 kinds |
| **Rulesets** | 20 directorios; 167 `*.rules.json` (**126 autogenerados**); 36 `.rego` + 32 `.test.rego` | 26 categorías |
| **MCP** | **50 tools, 12 resources, 8 prompts**; SDK 1.29.0; cero `outputSchema`, cero annotations, cero PRM `.well-known` | 47/11/8 |
| **CLI** | **35 comandos**; 29 usan el envelope ADR-0073; **20 × `process.exit(1)`, un único valor**; ~320 `console.log` vs 9 escrituras a stderr; sin NDJSON | 31 comandos |
| **Agent Runtime** | **17 puertos, 49 adaptadores**; pipeline de **una sola pasada, sin bucle ReAct**; un `plan()`; Hermes/Swarms/Cowork son cascarones vacíos | 16/38 |
| **Tracker** | .NET 10, EF Core, **91 migraciones**; 12 robots RoboSoft; HITL real (`/runtime-approvals`) | — |
| **RAG (ADR-0090/0112)** | pgvector 1024-dim HNSW + sidecar Qwen3 + delta sync + 38 tests verdes — **jamás encendido; cero chunks indexados; ningún tool MCP de búsqueda** | "shipped" |
| **OPA** | pinneado en **v0.65.0**; upstream va por v1.18.2; `npm opa-wasm` sin release desde nov-2024 | — |

**El seam que lo cambia todo:** **ADR-0111 `IQualitySignalProvider`**. Evolith ya diseñó y envió la costura sancionada por la que el no-determinismo entra al motor: como `EvaluationContext.qualitySignals`, con `Evidence{determinism, findings, provenance{collectedBy, adapterVersion, artifactHash}}`, recogido en agent-runtime (Core nunca ejecuta un provider) y plegado deterministamente. **Toda la IA que Evolith añada debe entrar por ahí.** Esto no hay que inventarlo: hay que apuntarlo a lo correcto y medirlo.

**Y los tres defectos que definen los próximos doce meses:**

1. `tracker_governance.audit_entries.actor_id` es un `Guid` **sin discriminador humano/máquina**, sin agent_id, model_id ni session_id. No existe tabla `agent_runs`. **Evolith no puede responder su propia pregunta fundacional.**
2. `core_evaluation_transactions` ya lleva `repository_revision` — y **nada lo lee como serie**. No hay `metric_snapshots`, ni `drift_alerts`, ni ingesta de webhooks SCM. *El producto se llama "evolution" y no tiene dimensión temporal.*
3. **GT-435/GT-448 (P0): nada ha corrido nunca en producción.** `VPS_DEPLOY_ENABLED` jamás se activó. Cero filas acumuladas en el "grafo de auditoría acumulado" que el posicionamiento llama la mitad fuerte del foso.

---

## 2. Crítica de la descomposición conceptual que propones

Propones nueve piezas: Core, Tracker, CLI, MCP, AI/Agents, Knowledge, Governance, Evidence, Intelligence. **Cinco son componentes; cuatro no lo son, y tratarlas como productos es el error caro.**

| Pieza | Veredicto | Razón |
|---|---|---|
| **Core, Tracker, CLI, MCP, Agent Runtime** | ✅ Componentes reales | Existen en código, tienen fronteras y contratos. Correcto. |
| **Evolith Governance** | ❌ No es un componente | *Es* Core. Los rulesets, las políticas OPA y los phase gates ya son eso. Separarlo duplica el motor. |
| **Evolith Knowledge** | ❌ No es un producto | Es `IKnowledgePort` + un adaptador. Elevarlo a producto es cómo se acaba construyendo un stack RAG completo que nunca se enciende (ya pasó). |
| **Evolith Evidence** e **Intelligence** | ⚠️ Son **la misma cosa** vista dos veces | Ambas son proyecciones sobre **un solo sustrato**: el registro atribuible y fechado. "Evidence" es su lectura puntual; "Intelligence" es su lectura como serie. Un sustrato, dos vistas. |

**Falta la pieza que sí importa y que no nombraste: los adaptadores de enforcement.** Códigos de salida, hook `PreToolUse`, Check Run, Agent Skill. Ahí es donde vive el CONTROL, y está ausente de tu modelo mental.

**Descomposición corregida:**

```
COMPONENTES (existen)          Core · Tracker · CLI · MCP · Agent Runtime
                                          │
UN COMPONENTE NUEVO      ──►    El Ledger  (procedencia atribuible, firmada, temporal)
                                = el sustrato único de Evidence + Intelligence
                                          │
UNA DISCIPLINA TRANSVERSAL ──►  Calibración (toda regla y todo juicio lleva su tasa de error)
                                          │
UNA FAMILIA DE ADAPTADORES ──►  Enforcement (exit codes · PreToolUse · Checks API · Skill · gateway)
```

Un componente nuevo, una disciplina, una familia de adaptadores. No nueve productos.

---

## 3. Crítica de tu secuencia hipotética

Propusiste: `AI Engineering → GenAI → LLM Engineering → RAG → KG → Agents → Agentic → MCP → AI-native apps → Agentic SWE → AI-native SDLC → AI Architecture → Architecture Intelligence → AI Governance → Agent Governance → Core → Tracker → CLI+MCP → Suite`.

Tres problemas:

1. **Es una secuencia para construir un producto de IA desde cero.** Evolith no lo es: es un motor determinista maduro con una costura de no-determinismo ya diseñada. Empezar por fundamentos de LLM es empezar por donde menos falta te hace.
2. **Pone governance al final.** Pero governance es lo que Evolith *ya es*; lo que falta es **medirlo**. La medición no es un capítulo tardío: es el prerequisito para admitir IA en el veredicto.
3. **Pone RAG y Knowledge Graphs temprano y con peso alto.** Son las dos apuestas que la investigación desaconseja con más fuerza. GraphRAG-Bench muestra que el grafo pierde contra RAG plano en recuperación factual; el corpus de Evolith son unos cientos de markdown con identificadores exactos (`ADR-0111`, `SCHEMA_VERSION`) — un problema de índice y BM25, no de embeddings. Y el mercado fue al revés: los agentes que Evolith quiere gobernar **borraron sus índices vectoriales** porque la recuperación just-in-time con herramientas les gana en corpus así.

**Secuencia corregida — instrumentar, medir, y solo entonces generar:**

```
0 · Protocolo e interfaces        ─ MCP 2026-07-28 · exit codes · schemas · streams
1 · Procedencia y evidencia       ─ actor typing · PROV-O · SCITT · OTel gen_ai · git-ai
2 · Medición y calibración        ─ error analysis · TPR/TNR/κ · judge validation · admisibilidad como política
3 · Generación estructurada       ─ constrained decoding · format/constraint tax · dos pasadas · caching
4 · Code & repository intelligence─ SCIP · tree-sitter · reflexion models · RepoFacts · mapping C4↔código
5 · Arquitectura agéntica         ─ durable execution · journaling · harnesses · orquestación-como-código
6 · Evolution intelligence        ─ serie temporal · DORA como etiqueta de resultado · señales GitClear
7 · Governance como producto      ─ NIST · EU AI Act · OWASP ASI · ISO 42001 como packs derivados
```

Nótese la inversión: **etapa 2 (medir) precede a etapa 3 (generar)**. Ese es el punto entero.

---

## 4. Career Path — 2 a 3 años

### Año 1 — *El instrumentador* (etapas 0-2)

**Identidad profesional al terminar:** el arquitecto que sabe convertir un sistema de governance determinista en uno que **mide su propia fiabilidad** y **registra procedencia atribuible** — y que por tanto puede admitir IA sin perder auditabilidad.

Dominar: contratos de protocolo (MCP moderno, JSON Schema 2020-12, semántica de exit codes), diseño de esquemas de evidencia, procedencia y ledgers verificables (PROV-O, SCITT/RFC 9943, OTel GenAI), y **metodología de evaluación** (error analysis, validación de jueces con estadística corregida por azar, evals en CI).

Por qué primero: los datos de procedencia **no son rellenables retroactivamente**. El censo de Khosravani & Mockus sobre 180M repos muestra que la detección post-hoc de autoría por IA recupera ~3,3 % con la señal que usa todo el mercado. Cada día sin tipar el actor es historia anónima para siempre.

### Año 2 — *El calibrador de juicio* (etapas 3-5)

**Identidad:** el arquitecto que sabe **dónde y cómo insertar juicio probabilístico dentro de un motor determinista** sin romper el contrato de auditoría, y que puede demostrarlo con números.

Dominar: generación estructurada y sus costes medidos (format tax / constraint tax, diseño en dos pasadas razonar-luego-conformar, prompt caching como restricción arquitectónica sobre el registro de tools), code intelligence determinista (SCIP, tree-sitter, modelos de reflexión, el paso de *mapping* asistido por LLM y confirmado por humano), y ejecución durable con journaling.

Aquí es donde el `IQualitySignalProvider` deja de ser una costura vacía y pasa a ser el mecanismo por el que Evolith gana **profundidad** en Phase Gate 3.

### Año 3 — *El diseñador de la categoría* (etapas 6-7)

**Identidad:** quien define qué significa *Software Evolution Intelligence* y lo puede sostener con evidencia reproducible frente a un auditor, un CISO y un competidor.

Dominar: series temporales de conformidad arquitectónica, atribución humano-vs-agente en tiempo de generación, taxonomías regulatorias como packs derivados (no como identidad), y economía de la evidencia acumulada.

---

## 5. Learning Path de 12 meses — calendarizado

**Ritmo:** ~6 h/semana (4 h estudio + 2 h aplicación). ~52 semanas ≈ **310 h**. Cada trimestre cierra en artefacto de producto, no en certificado.

### T1 (semanas 1-13) — Protocolo, interfaces y procedencia · ~78 h

| Sem | Foco | Entregable Evolith |
|---|---|---|
| 1-2 | **Urgente:** changelog MCP `2026-07-28`, patrón MRTR, autorización (PRM RFC 9728, RFC 8707, RFC 9207, CIMD) | Plan de migración de `@beyondnet/evolith-mcp`; eliminar `sessionId`; `server/discover` |
| 3-5 | Semántica de exit codes; `clig.dev`; UI machine-readable de Terraform; MCP Tools draft (`outputSchema`, `structuredContent`, annotations) | **Taxonomía de exit codes** (0 PASS / 2 uso / 3 **veredicto FAIL** / 1 infra / 4 HITL) + disciplina stdout-stderr, gobernada por un ruleset propio con paridad Rego |
| 6-8 | JSON Schema 2020-12; registro único de capacidades | `capability-registry.json` con `inputSchema`/`outputSchema` reales; borrar `TOOL_SCHEMAS` a mano; robot RoboSoft #13 de paridad de superficies |
| 9-11 | **PROV-O**; SCITT **RFC 9943**; convenciones OTel GenAI (`gen_ai.evaluation.result`, `mcp.*`); `git-ai` / Git Notes | Migración #92: `actor_type`, `agent_id`, `model_id`, `session_id` + tabla `agent_runs`; telemetría encendida con atributos tenant/initiative/actor |
| 12-13 | MRTR como mecanismo HITL; Enterprise-Managed Authorization / ID-JAG | Gate HITL re-expresado como `InputRequiredResult` con `requestState` sellado (AEAD) ligando principal + digest + TTL |

> **Gate T1 — *Nada más se aprende hasta que el actor esté tipado y el reloj corriendo.*** Si al final del trimestre `audit_entries` sigue sin discriminador, todo lo demás construye sobre historia anónima.

### T2 (semanas 14-26) — Medición y calibración · ~78 h

| Sem | Foco | Entregable |
|---|---|---|
| 14-16 | Error analysis primero; Hamel Husain *Evals FAQ*; Anthropic *Demystifying evals* (outcome sobre trayectoria) | Set etiquetado a mano: ~150-200 diffs reales de los repos Evolith, binarios, contra **una** rúbrica estrecha; κ humano-humano como techo |
| 17-19 | Validación de jueces: TPR/TNR, κ de Cohen, intervalos de Wilson; sesgos (verbosidad domina, posición ya casi muerta); *Reliability without Validity* | `evolith-cli judge:validate` devolviendo matriz de confusión + κ + CI95 en envelope ADR-0073 |
| 20-22 | **Calibrar primero lo determinista** | Precisión publicada **por ruleset** de las reglas ya existentes, minando `core_evaluation_transactions` × `gate_decisions` (cada override humano es una etiqueta gratis) |
| 23-24 | Admisibilidad como política | `probabilistic-evidence-admissibility.rules.json` + paridad `.rego`/`.test.rego`: evidencia probabilística solo bloquea si `tpr ≥ θ₁ ∧ tnr ≥ θ₂ ∧ antigüedad ≤ θ₃`; si no, degrada a advisory |
| 25-26 | Compatibility gates ante cambio de modelo; `model-registry.json` | Gate CI que re-corre el set congelado al actualizar modelo y bloquea si TPR/TNR cae fuera del intervalo |

> **Gate T2 — *¿Puedes publicar la tasa de falso bloqueo de tus gates actuales?*** Si no, no añadas IA al veredicto: primero mide lo que ya envías.

### T3 (semanas 27-39) — Generación estructurada y code intelligence · ~78 h

| Sem | Foco | Entregable |
|---|---|---|
| 27-29 | Constrained decoding; **format tax** y **constraint tax**; diseño en dos pasadas; prompt caching como restricción de arquitectura | `LlmArchitectureDriftProvider` tras `quality-signal-provider.port.ts`: razonamiento libre + extracción constreñida separada; prefijo cacheado con el corpus de reglas |
| 30-32 | Context engineering; recuperación just-in-time; encender el RAG dormido | Tool MCP #51 `knowledge-search` **híbrido con BM25 primero** sobre identificadores; `EVOLITH_RAG_SYNC` activado; arnés de eval de recuperación en CI |
| 33-36 | **SCIP** (gobernanza abierta desde mar-2026), tree-sitter, stack-graphs; modelos de reflexión (Murphy/Notkin/Sullivan) | `RepoFacts`: paquete de hechos estructurales content-hashed, extraído **fuera** de Core, entrando como miembro determinista de `EvaluationContext` |
| 37-39 | Mapping asistido por LLM (ExArch-style, F1 ~0.86); FINOS CALM como formato de ingesta | **El mapping C4↔código como activo gobernado**: el modelo propone, el HITL confirma, Tracker lo persiste versionado → después es entrada determinista |

> **Gate T3 — *Decisión de sustrato.*** ¿Core recibe `RepoFacts` inline (respeta ADR-0101) o el Tracker los posee? Documenta y cierra; condiciona todo lo posterior.

### T4 (semanas 40-52) — Evolución, durabilidad y la profundidad del wedge · ~78 h

| Sem | Foco | Entregable |
|---|---|---|
| 40-42 | Ejecución durable en modo librería sobre el Postgres existente; sesión-como-log-de-eventos | `handleStream` como workflow durable: `plan()`, harness, cada provider y el evaluate de Core como pasos journaled; resume tras `kill -9` |
| 43-45 | Orquestación-como-código para profundidad (no más agentes); aislamiento de subagentes | Recolección de evidencia por script determinista con workers acotados — la vía a profundidad sin romper la pureza del fold |
| 46-48 | **El drift correcto**: señales GitClear (duplicación, densidad de llamadas cross-file, ratio refactor:copia, constructos que enmascaran errores); DORA como etiqueta de resultado | Evaluadores de esas señales, **advisory primero**; serie de conformidad por `repository_revision` |
| 49-50 | Superficies de enforcement reales | `POST /api/v1/hooks/pretooluse` (contrato JSON HTTP documentado) + Check Run con `conclusion: failure` como required check |
| 51-52 | Síntesis | **Documento de reposicionamiento** con evidencia acumulada: ¿sigue siendo Architecture Intelligence el núcleo, o el producto es *Attributable Evolution Evidence*? |

> **Gate T4 — Build / no-build.** Sales con roadmap priorizado y una cifra publicable, o con la constatación honesta de que el wedge necesita reorientarse.

---

## 6. Tecnologías — dominar / conocer / vigilar

### 6.1 DOMINAR (12) — sin esto no puedes diseñar la suite

| Tecnología | Por qué es innegociable |
|---|---|
| **MCP moderno (`2026-07-28`)**: stateless, `server/discover`, MRTR, `outputSchema`, annotations, PRM/RFC 8707/9207, CIMD | Rompe tu servidor **en 3 días**. Y MRTR *es* tu producto: aprobación como protocolo |
| **Semántica de exit codes + disciplina stdout/stderr + NDJSON** | `process.exit(3)` es el primitivo de control más barato y más neutral entre agentes que existe |
| **JSON Schema 2020-12 como contrato de capacidad** | Unifica CLI, MCP y REST en un registro generado, no en prosa |
| **Metodología de evaluación y validación de jueces** (error analysis, TPR/TNR, κ, Wilson) | La licencia para admitir IA en un veredicto que bloquea merges |
| **Format tax / constraint tax y diseño en dos pasadas** | Conformidad de esquema es **anti-señal** de corrección si no se mide aparte |
| **W3C PROV-O** | El vocabulario exacto del modelo de lineage; estable desde 2013, cero riesgo de moda |
| **SCITT / RFC 9943 + recibos COSE** | La forma *estandarizada* del ledger de auditoría; convierte el foso propietario en algo que un auditor reconoce |
| **OTel GenAI: `gen_ai.evaluation.result` y `mcp.*`** | Formato de cable para ADR-0111 y ADR-0086; la telemetría no se rellena a posteriori |
| **SCIP + tree-sitter** | Cómo Core razona sobre un repo que nunca ha visto sin violar ADR-0101 |
| **Modelos de reflexión (intended vs actual)** | Evolith ya *es* uno, incompleto: le falta el paso de mapping |
| **Recuperación híbrida (BM25 + denso) y su evaluación** | Ingeniería asentada; el corpus de Evolith se consulta por identificadores exactos |
| **Ejecución durable / journaling de no-determinismo** | La auditabilidad se consigue **registrando** el no-determinismo, no prohibiéndolo |

### 6.2 CONOCER (10) — decidir con criterio, no construir

OPA/Rego v1.x y la migración desde v0.65 · Agent Skills (`SKILL.md`) y AGENTS.md como **vehículo de distribución, no de control** · GitHub Checks API y rulesets sobre PRs de agentes · Claude Code hooks (`PreToolUse` HTTP) · RFC 8693 token exchange + SPIFFE/SPIRE · OWASP Agentic Top 10 (ASI01-ASI10) y MITRE ATLAS como **metadata de ruleset** · DORA 5 keys y SPACE como vocabulario de resultado (nunca como dashboard propio) · Apache AGE (el único motor de grafo que valdría añadir, y solo si la serie SQL se queda corta) · FINOS CALM como segundo formato de ingesta · Modelado bi-temporal (valid time vs ingestion time) para supersesión de ADRs.

### 6.3 VIGILAR (8) — abstraer tras un puerto, revisar por release

Identidad delegada de agentes (ID-JAG es lo único adoptado por WG; OIDC-A/DAAP/AIP siguen en `-00`) · EU AI Act tras el Digital Omnibus (Anexo III diferido a dic-2027; transparencia Art. 50 sigue en ago-2026) · NIST COSAiS overlays · MCP interceptors y patrones de gateway · MCP Server Cards y registro privado · SLSA v1.2 / in-toto / Sigstore · Information-flow control contra prompt injection (CaMeL, FIDES) · A2A v1.0.

### 6.4 IGNORAR explícitamente (y por qué duele decirlo)

| No construir | Razón |
|---|---|
| **GraphRAG / extracción de entidades por LLM sobre ADRs** | Importa no-determinismo al núcleo cuya promesa es lo contrario; y probablemente ni siquiera mejora las respuestas |
| **Base de datos de grafos** | La lineage es un time series con joins; recursive CTEs en Postgres cubren profundidad ≤4 |
| **OWL / razonadores DL / triplestores** | Duplican OPA con semántica distinta: pesadilla de paridad, cero ganancia |
| **Vector DB dedicada** | pgvector ya está en el esquema; el corpus no llegará a 10M vectores esta década |
| **Fine-tuning sobre el corpus** | Congela un snapshot de reglas que cambian semanalmente; rompe el contrato `versions{}` |
| **Bucle ReAct, memoria de agente, topologías swarm** | Multiplican gates sin añadir control; la memoria de agente competiría con Tracker como sistema de registro |
| **Un coding agent propio (Hermes/Swarms/Cowork)** | Cascarones vacíos que diluyen el wedge contra Cursor/Copilot/Devin |
| **Dashboard DORA/SPACE propio** | ~10 vendors financiados, categoría comoditizándose; Code Climate Velocity ya cerró |
| **Detector post-hoc de código IA como hecho** | ~3,3 % de recall con la señal estándar; solo admisible como quality signal probabilística |
| **Sampling de MCP, C2PA, MCP Apps, sandbox propio** | Depreciado / capa equivocada / commodity resuelto |

---

## 7. Proyectos prácticos — complejidad creciente, todos contra el repo real

| # | Proyecto | Semanas | Prueba |
|---|---|---|---|
| **1** | **Exit codes + paridad de superficies.** Taxonomía de salida; registro único de capacidades con schemas; robot RoboSoft #13 que invoca cada operación por CLI, MCP y REST y exige `data` idéntico tras canonicalizar | 3-4 | Que la "surface parity" de ADR-0073 deja de ser prosa y pasa a ser aserción ejecutable — y que **`exit 3` gobierna en Claude Code, Codex, Cursor, pre-commit y Actions sin escribir un adaptador para ninguno** |
| **2** | **`evolith-mcp` 2.0 conforme.** `server/discover`, `_meta`, borrar `sessionId`, MRTR con `requestState` sellado, PRM `.well-known`, `outputSchema` para los 12 kinds, `tools/list` filtrado por claims | 4-6 | Que el HITL sobrevive a la ausencia de sesión — la objeción que mata a la mayoría de diseños de enforcement |
| **3** | **Ledger de procedencia + actor tipado.** Migración #92, `agent_runs` como stream append-only, `TransparencyService` con statements COSE y recibos, `evolith-cli audit verify` | 4-6 | Que Evolith puede atribuir cambio arquitectónico a humano vs agente — y que el ledger es **portante** (una regla falla si los recibos no verifican), no decorativo |
| **4** | **Arnés de calibración.** 150-200 diffs etiquetados a mano, `judge:validate` con κ y Wilson, admisibilidad como ruleset con paridad Rego, **precisión publicada de las reglas deterministas actuales** | 5-6 | La única frase de marketing que ningún catálogo ni rulefile puede imitar: *"nuestros gates tienen tasa de falso bloqueo publicada, por regla y por tenant"* |
| **5** | **Reflexion Pack.** `scip-typescript` → grafo de módulos → `RepoFacts` content-hashed → `EvaluationContext` → evaluador `architecture` → SARIF, corrido sobre los últimos 200 commits | 4-6 | Que Core emite veredicto sobre un repo que nunca vio, **solo desde contexto** — validando ADR-0101 bajo carga real — y produce la primera acumulación auténtica |
| **6** | **Mapping gobernado C4↔código.** Provider probabilístico propone bindings; HITL confirma; Tracker persiste versionado; después es determinista | 4-6 | Que Evolith convierte una conjetura en activo gobernado — precisamente lo que Sonar **no** puede hacer, porque no tiene autoridad de aprobación ni de waiver |
| **7** | **Gate en tiempo de edición + ledger de drift.** `POST /api/v1/hooks/pretooluse` → `evaluateEdit` → `permissionDecision`, con paridad de motores por llamada y evento de run disparado al Tracker | 3-4 | Un `deny` que el agente **obedece a mitad de edición**; p95 del hook; tasa de bloqueo y de falso bloqueo, descubierta por el autor y no por un cliente |
| **8** | **Serie de conformidad atribuida.** Replay de PRs (corpus público de PRs agénticos + muestra humana) por el orquestador; deltas de duplicación / refactor / error-masking segmentados por autoría | 5-6 | Si el código agéntico degrada la conformidad más que el humano — afirmación que ningún vendor de DPIP puede hacer, y **no bloqueada por el despliegue** |

**Orden recomendado:** 1 → 3 → 2 → 4 → 5 → 7 → 6 → 8. El 3 va segundo pese a ser más grande, porque es el único cuyo dato **se destruye si esperas**.

---

## 8. Arquitecturas de referencia que estudiar

1. **Temporal / DBOS — workflow determinista + actividades journaled.** El modelo mental exacto para reconciliar auditoría con LLMs: no prohíbas el no-determinismo, regístralo y reprodúcelo.
2. **Anthropic Managed Agents — Session / Harness / Sandbox.** La sesión como log de eventos externo, el harness desechable. Es la forma objetivo de `IHarnessPort` y del ledger `agent_runs`.
3. **Modelos de reflexión (Murphy/Notkin/Sullivan, FSE 1995).** Nombra lo que `structurizr-parser.ts` + `c4-compiler.ts` ya son, y lo que les falta: el mapping.
4. **CodeQL "code as data" y Glean/Angle.** No para desplegarlos — para el vocabulario de diseño de esquemas de hechos.
5. **UI machine-readable de Terraform.** La implementación de referencia del stream NDJSON versionado que le falta a la CLI.
6. **SCITT (RFC 9943).** La forma estandarizada de un ledger de decisiones a prueba de manipulación.
7. **GitHub Agentic Workflows (`gh-aw`).** El competidor más cercano al claim de CONTROL dentro de CI: token read-only por defecto, safe-outputs gate, firewall de egreso, presupuestos.
8. **Sonar Architecture Management (GA 2-mar-2026).** Estúdialo como **amenaza**, no como adopción: hace descubrimiento automático + arquitectura intencional + violaciones en quality gate para 5 lenguajes, y se vende explícitamente contra el drift causado por IA.

---

## 9. Repositorios open source que analizar

| Repo | Qué extraer |
|---|---|
| `open-telemetry/semantic-conventions-genai` | El registro real de `gen_ai.*` y `mcp.*`; estado Development — pinnear commit |
| `open-telemetry/weaver` | Validar un registro semántico propio `evolith.*` **con políticas Rego** — mismo músculo que ya tienes |
| `pgvector/pgvector` | HNSW, iterative scans, `halfvec`; ya está en tu esquema |
| `getzep/graphiti` | **El modelo bi-temporal, no la dependencia**: valid time vs ingestion time, hechos invalidados en vez de borrados |
| `git-ai-project/git-ai` | Atribución línea a línea vía Git Notes, **sin heurísticas** — la alternativa correcta a los detectores |
| `modelcontextprotocol/modelcontextprotocol` | Los SEP: 2567, 2575, 2322 (MRTR), 2663 (Tasks), 414 (trace context) |
| `openhands` SDK | Estado agéntico event-sourced con replay determinista |
| Indexadores SCIP (`scip-typescript`, etc.) | El productor de `RepoFacts` |
| `dependency-cruiser`, `import-linter`, ArchUnit, Deptrac | La disciplina que ya elegiste bien: **normalizar salida de enforcers OSS, no re-parsear código** |

---

## 10. Documentación oficial a seguir (suscripción permanente)

- **Especificación MCP** — changelog, MRTR, autorización, tools draft, extensiones, ciclo de vida de deprecación. *Revisión: cada revisión de spec.*
- **OpenTelemetry GenAI semconv** — `gen_ai.*`, `mcp.*`, `gen_ai.evaluation.result`. *Revisión: mensual mientras siga en Development.*
- **W3C PROV-O** — estable; leer una vez, usar siempre.
- **IETF: RFC 9943 (SCITT), RFC 9728 (PRM), RFC 8707, RFC 9207, RFC 8693; draft ID-JAG.**
- **OPA / Rego v1.x** — tienes una migración v0→v1 pendiente sobre 36 políticas, con 32 tests como arnés.
- **SCIP** (`scip-code.org`) — ahora bajo gobernanza abierta con comité Meta/Uber/Sourcegraph.
- **OWASP GenAI Security Project** — Agentic Top 10, LLM Top 10.
- **DORA** — informes anuales, como vocabulario de resultado.
- **Agent Skills / AGENTS.md** — como vehículo de distribución.
- **Claude Code hooks reference** — el contrato JSON de `PreToolUse` es la superficie (b).

---

## 11. Certificaciones — la respuesta honesta

**Ninguna certificación de IA aporta valor material a este objetivo.** Los certificados de vendor (Azure AI Engineer, Google ML Engineer, AWS ML) certifican operación de plataforma; tu problema es diseño de contratos de evidencia y metodología de medición. No hay certificación para eso.

Las tres únicas con retorno plausible, y todas por razón **comercial**, no técnica:

| Certificación | Cuándo | Por qué |
|---|---|---|
| **ISO/IEC 42001 Lead Auditor / Lead Implementer** | Año 2-3, solo con Tracker en producción | 42006:2025 hizo la certificación auditable. Es el idioma del comprador enterprise, y te enseña qué evidencia pide un auditor — que es literalmente tu producto |
| **CISSP o equivalente** | Solo si el comprador acaba siendo el CISO | El wedge de compliance apunta a ese bolsillo |
| *(Ninguna otra)* | — | El tiempo rinde ~10× más en los 8 proyectos de §7 |

**Sustituto real de la certificación:** publicar. Un post técnico con la matriz de confusión de tus propias reglas deterministas, o la serie de conformidad humano-vs-agente sobre un corpus público, vale más que cualquier credencial en esta categoría — y **es** marketing de producto.

---

## 12. Matriz de conocimientos — Core × Tracker × CLI × MCP × Agents × Suite

| Área de conocimiento | Evolith Core | Evolith Tracker | CLI | MCP | Agent Runtime | Suite |
|---|---|---|---|---|---|---|
| **Contratos de protocolo** (MCP 2026-07, JSON Schema 2020-12) | Contratos versionados legibles | — | Taxonomía de exit codes; NDJSON | **`server/discover`, MRTR, `outputSchema`, annotations, PRM** | `_meta` trace context | **Un registro de capacidades genera las tres superficies** |
| **Procedencia y evidencia** (PROV-O, SCITT, git-ai) | `Evidence.provenance` como dato inerte plegado puro | **Ledger firmado; `actor_type`; `agent_runs`; recibos COSE** | `audit verify` | `audit.verifyReceipt` (read-only) | Emite procedencia en tiempo de generación | **El sustrato único del foso** |
| **Medición y calibración** (TPR/TNR, κ, admisibilidad) | Admisibilidad **como regla Rego con paridad** | Persiste el récord de calibración por regla y tenant | `judge:validate` | Verdicts con score estructurado | Recoge signals con validación adjunta | **La licencia para usar IA en un gate** |
| **Generación estructurada** (constraint tax, dos pasadas, caching) | Nunca ejecuta un LLM | — | — | **Registro de tools cache-estable** (invariante de coste) | `IQualitySignalProvider`: razonar → conformar | Coste y corrección como propiedades de diseño |
| **Recuperación** (híbrida, BM25 primero, eval) | Solo como `qualitySignals` | Sirve el índice | `knowledge-search` | **Tool #51 + resources/templates para nodos** | `IKnowledgePort` con etiqueta de confianza | Encender lo ya construido |
| **Code intelligence** (SCIP, tree-sitter, reflexión) | **`RepoFacts` como miembro determinista del contexto** | Persiste el mapping C4↔código confirmado | `repofacts` | `architecture.query` sobre el grafo de hechos | Extractor fuera de Core | **Profundidad del wedge** |
| **Arquitectura agéntica** (durable, harness, orquestación-como-código) | Se mantiene sin bucle, sin estado | Journal de pasos | — | Tasks / MRTR | **Workflow durable; journaling** | Profundidad sin romper la pureza del fold |
| **Evolution intelligence** (serie, DORA, señales GitClear) | Evaluadores de esas señales, advisory primero | **Serie por `repository_revision`; drift alerts** | `conformance-series` | Read tool | Etiqueta autoría en el evento | **La categoría que nadie ocupa** |
| **Governance / compliance** (NIST, EU AI Act, OWASP ASI, ISO 42001) | Taxonomía como metadata de ruleset | Export Anexo-IV; retención | Packs de criterios | ABAC en `tools/list` por claims | ABAC por tool-call | **Packs derivados — nunca la identidad** |
| **Enforcement** (exit codes, PreToolUse, Checks, Skill) | `evaluateEdit` puro | Registra cada denegación | **`exit 3` = el producto** | Superficie (a), la más débil | — | **Neutralidad entre agentes por construcción** |

**Cómo leer la matriz:** las filas 1-3 son año 1 y son casi todas Tracker+CLI+MCP. Core apenas cambia. Ese es el hallazgo: **la evolución AI-native de Evolith ocurre mayoritariamente fuera de Core** — exactamente como ADR-0101 obliga.

---

## 13. The Future of Evolith — hipótesis a 3-5 años

### El escenario que hay que evitar

Evolith se convierte en **"otro checker de imports con MCP"**. Sonar auto-descubre arquitectura gratis en cinco lenguajes; los portales (Port, Cortex) añaden agentes sobre su grafo; los gateways de MCP (Kong, APIM) se comen la autorización por tool-call. Evolith queda con un motor elegante, cero filas acumuladas y un wedge cerrado. **Este es hoy el escenario por defecto**, porque nada corre en producción y la ventana declarada de 12-18 meses lleva meses consumiéndose.

### El escenario defendible

Evolith deja de venderse como *detección* y se convierte en la **capa de evidencia atribuible y calibrada** del SDLC agéntico. La secuencia:

**Años 0-1 — De motor a instrumento.** Actor tipado, ledger firmado, telemetría encendida, exit codes que gobiernan, MCP conforme. Al final del año 1 Evolith puede decir dos frases que nadie más dice: *"esta violación fue introducida por este agente, con este modelo, en esta sesión, y persistió N revisiones"* y *"esta regla tiene esta tasa de falso bloqueo, medida"*.

**Años 1-2 — De instrumento a juicio calibrado.** El `IQualitySignalProvider` se apunta al **drift correcto** — duplicación, refactor colapsado, abstracción muerta, mantenimiento abandonado: todo legal en imports y por tanto invisible para todo competidor de fitness functions. Entra como evidencia probabilística con κ publicado y admisibilidad decidida por política, no por opinión. Phase Gate 3 pasa de existence check a profundidad **con un número adjunto**.

**Años 2-3 — De juicio a serie.** El eje temporal aparece. Veredicto por revisión, huella de violación estable a través de upgrades de herramienta, atribución humano-vs-agente en tiempo de generación. Evolith responde: *¿nuestra arquitectura está mejorando o erosionando?, ¿qué proporción de la erosión es agéntica?, ¿qué agentes y qué modelos producen deuda que persiste?* Esa es una categoría — **Attributable Evolution Evidence** — que hoy no ocupa nadie, y que no se gana con mejor parser sino con **haber empezado a acumular antes**.

**Años 3-5 — De serie a mercado.** El activo acumulado es un récord de calibración multi-tenant: qué reglas predicen retrabajo real, qué violaciones correlacionan con fallo de cambio, qué modelos degradan qué dimensiones. En ese punto los packs regulatorios (EU AI Act Anexo IV, ISO 42001, NIST) dejan de ser fontanería y pasan a ser **exportaciones triviales de un ledger que ya es conforme por diseño**. Y el enforcement — que para entonces será commodity — se vende como consecuencia del récord, no al revés.

### La afirmación que hay que poder hacer en 2029

> *"Evolith es el único sistema que puede decirte, con evidencia firmada y una tasa de error publicada, cómo cambió tu arquitectura, quién o qué la cambió, bajo qué reglas vigentes en ese momento, y si esa decisión resultó correcta."*

Cada palabra de esa frase es un entregable de esta ruta: *firmada* → SCITT; *tasa de error publicada* → calibración; *quién o qué* → actor tipado; *reglas vigentes en ese momento* → bi-temporalidad; *resultó correcta* → DORA como etiqueta de resultado. Ninguna de las cinco es un modelo de lenguaje.

### El riesgo real, dicho sin adornos

**El riesgo no es elegir mal la tecnología de IA. Es gastar la ventana aprendiendo IA en abstracto mientras el dato que constituye el foso no se está escribiendo.** La telemetría, la procedencia y la autoría **no se rellenan hacia atrás**. Un despliegue tardío se recupera; un año de historia anónima, no.

---

## 14. Metodología y verificación

- **Base de producto:** inspección directa del código de `evolith` y `evolith_tracker` por seis agentes en paralelo (motor, Tracker, CLI/MCP, Agent Runtime, estrategia, corpus AI), con la regla explícita *"donde docs y código discrepen, gana el código"*. De ahí salen las cifras corregidas de §1.
- **Base de dominio:** diez investigadores en paralelo (uno por dominio), cada uno obligado a juzgar contra el estado real de Evolith y a declarar qué ignorar. 17 agentes, ~1,58 M tokens, 617 llamadas a herramientas.
- **Verificación directa (por mí, no por agente)** de las dos afirmaciones que más cambian la recomendación:
  - **MCP `2026-07-28`** — confirmado contra el changelog oficial: eliminación de sesiones y `Mcp-Session-Id` (SEP-2567), eliminación del handshake `initialize` (SEP-2575), `server/discover` obligatorio, patrón **MRTR** con `InputRequiredResult` (SEP-2322), deprecación de Roots/Sampling/Logging (SEP-2577) y de DCR en favor de CIMD.
  - **Sonar Architecture Management GA 2-mar-2026** — confirmado contra el anuncio oficial: ingeniería inversa automática sin setup, arquitectura intencional gráfica, violaciones vía quality gate, Java/JS/TS/Python/C#, posicionado explícitamente contra el drift de código generado por IA.
- **Caveat honesto:** el resto de citas (papers de 2026, cifras de DORA/GitClear/METR, estado de estándares) proviene de búsquedas de los agentes con instrucción de verificar URL. **Antes de usar cualquiera de ellas en una decisión de inversión o roadmap, revalídala contra la fuente primaria** — la misma regla que ya aplica el documento de posicionamiento de Evolith.

---

*Este documento es una ruta de especialización profesional, no un temario. Su criterio de éxito no es haber estudiado los recursos, sino que al cabo de doce meses Evolith pueda publicar una cifra sobre sí mismo que ningún competidor pueda publicar sobre el suyo.*
