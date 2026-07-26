# Evolith en la era AI-native: Ruta de *Architecture Intelligence & Governance*

> Documento estratégico + ruta de aprendizaje para evolucionar **Evolith Core** y **Evolith Tracker** desde una plataforma tradicional de *architecture governance* hacia una plataforma de **Architecture Intelligence & Governance** capaz de comprender arquitectura, analizar código, coordinar y gobernar agentes de IA, validar sus decisiones, detectar desviaciones y generar **evidencia continua** sobre cómo evoluciona el software cuando humanos y agentes construyen juntos.
>
> Selección curada mediante investigación multi-agente (10 dominios de IA + síntesis) con **URLs verificadas**. Priorizada por **valor estratégico y horizonte temporal**, no por idioma: a este nivel el contenido de frontera está mayormente en inglés.

---

## 1. Tesis estratégica

Evolith no necesita "usar LLMs". Necesita convertirse en la **capa de contexto, razonamiento y evidencia** de un SDLC donde humanos *y* agentes diseñan, modifican y hacen evolucionar el software.

La ventaja defendible **no** será el modelo — eso es *commodity* y volátil. Será:

1. **El grafo vivo del sistema** (código + dependencias + arquitectura + decisiones + políticas + evidencia), consultable por agentes.
2. **Un motor neuro-simbólico** que razona sobre ese grafo: **el LLM propone, Rego verifica**.

> **La inteligencia viene del grafo; la governance es su *aplicación*, no el producto; la evidencia es la competencia durable que hace defendibles a ambas.**

### Los seis saltos

| De | A |
|---|---|
| Reglas estáticas | Análisis inteligente |
| Validación manual | Detección asistida por IA |
| Architecture Knowledge Base | Architecture Intelligence |
| Scorecard | Health intelligence |
| Architecture Decision Records | AI-assisted architecture decisions |
| Tracking de entrega | Software Evolution Intelligence |

---

## 2. Posicionamiento: valor real vs. viabilidad

Juzgados contra los activos reales de Evolith (motor OPA/Rego *stateless*, grafo `codebase-memory`, runtime hexagonal ADR-0102), los cinco encuadres **no** valen lo mismo:

| Encuadre | Veredicto | Racional |
|---|---|---|
| **Architecture Intelligence Layer** | **🟢 Liderar (núcleo)** | Ontología + grafo de código + neuro-simbólico (patrón IRIS) = foso durable, apalanca la fortaleza en arquitectura, respaldado por la literatura (recuperación, conformance, erosión). "Inteligencia" concreta, no rebranding. |
| **Software Evolution Intelligence Layer** | **🟠 North Star** | El más novedoso y de mayor techo: evidencia continua de cómo evoluciona el software con humanos+agentes (DORA + Rework Rate + contribución humano-vs-IA + trazas OTel). El menos saturado; el más amplio y menos inmediato. Alcanzar por incrementos. |
| **Agent Governance Layer** | Superponer (no marca) | Encaja con OPA-como-PDP + adaptadores hexagonales (allow/deny por *tool-call*). Pero saturado y con el primitivo duro —identidad/delegación de agentes— sin resolver y sin ventaja propia. Capacidad tras un puerto PDP. |
| **AI Governance Layer** | Adoptar solo como esquema | La apuesta más de moda y la más débil: mapeo NIST/EU AI Act = fontanería de políticas que muchos ofrecerán y que no explota el grafo. Usar como esquema de resultado y pack de criterios, no como identidad. |
| **Architecture Governance Layer** | No como identidad | Lo que Evolith ya es. Se está comoditizando (ArchUnit, CodeQL, fitness functions). Base, no bandera. |

**Recomendación:** liderar como **Architecture Intelligence Layer**, con **Software Evolution Intelligence** como estrella polar y vector de expansión, y tratar toda la governance (arquitectura / IA / agentes) como **packs de criterios derivados y superficies de enforcement encima de la inteligencia**.

**Caveats:** (1) el valor neuro-simbólico depende de mantener el LLM como *generador de specs* y Rego como *verificador* — nunca LLM-como-juez-final sin validación; (2) la promesa de *evolution intelligence* depende de estándares aún en movimiento (OTel GenAI, identidad de agentes) — ábstralos tras puertos y no los cablees.

---

## 3. La ruta en 7 fases

Secuenciada para reflejar la evolución de Evolith, no un temario genérico. Cada fase fija una decisión antes de habilitar la siguiente. Se asume la fortaleza previa en arquitectura de software (DDD, hexagonal, clean, microservicios, enterprise, governance): **no** se incluye.

**Horizonte:** `Cimiento` (durable, base) · `Estratégico` (durable, diferenciador) · `Móvil` (importante pero cambiante) · `Vigilar` (volátil).

---

### Fase 01 — Calibrar la máquina: frontera de fiabilidad del LLM y salidas estructuradas

**Objetivo:** modelo mental preciso de dónde un LLM es fiable y dónde alucina, y forzar salida conforme a esquema — para que toda decisión posterior descanse en evidencia sobre el comportamiento del modelo.
**Por qué primero:** fija la **frontera de confianza** que gobierna todo lo demás (qué sigue en Rego determinista, qué pasa a LLM).

- **[Deep Dive into LLMs like ChatGPT](https://www.youtube.com/watch?v=7xTGNNLPyMI)** — Andrej Karpathy · Charla · EN · Gratis · *Cimiento*
  - *Qué IA aporta:* tokenización/BPE, pre-entrenamiento, base vs instruct, RLHF y los modos de fallo (alucinación, recuerdo estadístico, confianza injustificada). Para decisores, no para entrenar modelos.
  - *Impacto en Evolith:* intuición calibrada para decidir dónde Core confía en el LLM y dónde debe mandar Rego — la tensión central de "reglas estáticas → análisis inteligente".
- **[Getting Structured LLM Output](https://www.deeplearning.ai/short-courses/getting-structured-llm-output/)** — DeepLearning.AI · Curso vídeo · EN · Audit gratis · *Estratégico*
  - *Qué IA aporta:* JSON-schema en la API, re-prompt (Instructor) y *constrained decoding* a nivel de logits; trade-offs de fiabilidad.
  - *Impacto en Evolith:* `EvaluationResult` deja de ser prosa y pasa a salida conforme a esquema (findings, madurez, topología, criterios) preservando ADR-0101. Base de los contratos tipados entre Winston y los agentes y de la evidencia auditable.

---

### Fase 02 — De *Knowledge Base* a *Intelligence*: recuperación, grafos y ontología

**Objetivo:** dominar recuperación GraphRAG (multi-hop y global), la distinción ontología-vs-grafo y el diseño híbrido grafo+vector, para que el grafo `codebase-memory` pase de índice a **sustrato de razonamiento**.
**Por qué aquí:** es donde la fortaleza en arquitectura empresarial se vuelve palanca — una ontología de arquitectura es el mismo pensamiento de reglas y restricciones que ya se hace en Rego, elevado a modelo de razonamiento. Es el **foso durable**.

- **[Knowledge Graphs for RAG](https://www.deeplearning.ai/courses/knowledge-graphs-rag)** — DeepLearning.AI · Neo4j · Curso vídeo · EN · Audit gratis · *Cimiento*
  - *Qué IA aporta:* cómo un grafo almacena entidades/relaciones, cómo se combinan búsqueda vectorial y estructura de grafo en un store, y por qué el grounding en grafo reduce alucinación y mejora multi-hop.
  - *Impacto en Evolith:* modelo mental de "grounding en grafo" para combinar el grafo estructural que Core ya tiene con recuperación semántica, con *provenance* — base de la "evidencia continua".
- **[GraphRAG: Unlocking LLM discovery on narrative private data](https://www.microsoft.com/en-us/research/blog/graphrag-unlocking-llm-discovery-on-narrative-private-data/)** — Microsoft Research · Ensayo · EN · Gratis · *Estratégico*
  - *Qué IA aporta:* extracción de entidades/relaciones por LLM, detección jerárquica de comunidades (Leiden), summarization por comunidad; por qué el grafo gana a RAG plano en preguntas holísticas.
  - *Impacto en Evolith:* análogo externo más cercano al grafo `codebase-memory`. Habilita responder preguntas de arquitectura completa ("cómo evolucionó el acoplamiento", "qué viola este ADR en todo el repo") — la esencia de detección de drift/violaciones.
- **[¿Ontología o Knowledge Graph?](https://enterprise-knowledge.com/whats-the-difference-between-an-ontology-and-a-knowledge-graph/)** — Enterprise Knowledge · Ensayo · EN · Gratis · *Cimiento*
  - *Qué IA aporta:* los fundamentos de modelado semántico que los tutoriales de GraphRAG saltan — por qué diseñas la ontología primero y cómo las restricciones habilitan razonamiento.
  - *Impacto en Evolith:* "Architecture Intelligence" necesita una **ontología explícita** (topologías, concerns, criterios, ADRs, violaciones, drift) como columna semántica. Reencuadra: la ontología es el foso; la governance es su aplicación.
- **[Retrieval Augmented Generation (RAG)](https://www.deeplearning.ai/courses/retrieval-augmented-generation)** — DeepLearning.AI · Curso vídeo · EN · Audit gratis · *Estratégico*
  - *Qué IA aporta:* RAG como arquitectura — retrievers, embeddings, ANN, búsqueda híbrida, chunking, reranking con cross-encoders y evaluación de recuperación, con sus fallos por etapa.
  - *Impacto en Evolith:* arquitectura de referencia para convertir grafo y contexto de repo en evidencia recuperable y rankeable, con el vocabulario que hace medible "¿este análisis está *grounded*?".

---

### Fase 03 — *Code & repository intelligence*: código como dato y recuperación de arquitectura

**Objetivo:** entender los grafos de código como estructura navegable por agentes, el modelo determinista "código como dato" y el límite honesto de la recuperación de arquitectura asistida por IA.
**Por qué aquí:** aplica el razonamiento sobre grafos al sujeto real (repo → componentes → dependencias → dominios → violaciones). Precede a los agentes porque su valor depende de recibir una interfaz de consulta al grafo, no ficheros crudos.

- **[RepoGraph: Repository-level Code Graph](https://arxiv.org/abs/2410.14684)** — arXiv · ICLR 2025 · Paper · EN · Gratis · *Estratégico*
  - *Qué IA aporta:* extraer estructura a un grafo y usarlo como navegación/contexto de repo para un agente — patrón ego-graph, esquema de nodos/aristas, por qué la granularidad a nivel de línea supera a la de fichero.
  - *Impacto en Evolith:* espejo publicado más cercano a `codebase-memory`. Informa cómo elevarlo a sustrato de Architecture Intelligence y cómo el grafo se vuelve `EvaluationContext` para detectar violaciones y deuda.
- **[About CodeQL — code as data](https://codeql.github.com/docs/codeql-overview/about-codeql/)** — GitHub · Guía/docs · EN · Gratis · *Cimiento*
  - *Qué IA aporta:* el primitivo durable bajo el análisis de código con IA — convertir un repo en un modelo relacional semántico (data-flow/control-flow) para que las violaciones sean consultas demostrables.
  - *Impacto en Evolith:* prueba de que una capa semántica determinista escala, y enmarca la decisión clave — qué parte de la detección de drift debe quedar determinista (consultar el grafo) y cuál necesita LLM. Mantiene defendible la "evidencia continua".
- **[AI for Software Architecture: Literature Review and the Road Ahead](https://arxiv.org/pdf/2504.04334)** — arXiv · survey 2025 · Paper · EN · Gratis · *Estratégico*
  - *Qué IA aporta:* taxonomía de lo que la IA sí y no puede hacer por la arquitectura (reconstrucción, smells/violaciones, acoplamiento, ADRs asistidos) y los huecos explícitos.
  - *Impacto en Evolith:* el recurso que más arma la decisión de posicionamiento; nombra qué transiciones están respaldadas por investigación vs. son aspiracionales, para acotar el roadmap con honestidad.

---

### Fase 04 — Arquitectura de agentes: *workflows* vs. agentes, *context engineering* y *harnesses*

**Objetivo:** taxonomía para clasificar qué es realmente "Winston + 9 agentes", dominar *context engineering* como contrato Tracker→Core, y diseño de *harness* como sustrato de la evidencia continua.
**Por qué aquí:** con el sustrato de inteligencia entendido, se audita ADR-0102 con honestidad — muchos handoffs son en realidad *routing* u *orchestrator-worker* que deberían ser deterministas y por tanto gobernables.

- **[Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)** — Anthropic Engineering · Ensayo · EN · Gratis · *Cimiento*
  - *Qué IA aporta:* taxonomía precisa — LLM aumentado como unidad base, frontera workflow vs. agente, los cinco patrones y el principio de minimizar agencia.
  - *Impacto en Evolith:* enmarca qué es el fleet de agentes. El patrón *evaluator-optimizer* es plantilla casi exacta para Core como "evaluador" del bucle (agente propone → Core evalúa contra Rego → revisa).
- **[Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)** — Anthropic Engineering · Ensayo · EN · Gratis · *Estratégico*
  - *Qué IA aporta:* construir con LLMs es "¿qué configuración de contexto maximiza la conducta deseada?" — compactación, recuperación just-in-time, aislamiento de contexto entre sub-agentes, y por qué los contextos largos degradan.
  - *Impacto en Evolith:* reencuadra el ensamblado del `EvaluationContext` — en vez de volcar repos, recuperación dirigida por consulta sobre el grafo. La mayor mejora al contrato Tracker→Core.
- **[Agentic AI](https://www.deeplearning.ai/courses/agentic-ai)** — DeepLearning.AI · Andrew Ng · Curso vídeo · EN · **De pago** · *Estratégico*
  - *Qué IA aporta:* mecánica de reflection, tool use, planning y coordinación multi-agente, más metodología de evaluación/error-analysis.
  - *Impacto en Evolith:* reflection/evaluation mapean con validar decisiones de agentes; la postura "build before framework" protege a Core de sobre-comprometerse con un framework volátil (agnóstico tras puertos).
- **[Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)** — Anthropic Engineering · Ensayo · EN · Gratis · *Estratégico*
  - *Qué IA aporta:* la disciplina del *harness* — externalizar estado, acotar y verificar cada unidad de trabajo, restringir tools, diseñar handoffs y monitoreo.
  - *Impacto en Evolith:* blueprint más cercano a "evidencia continua". Los artefactos por sesión son lo que Tracker debe ensamblar y Core evaluar; valida el diseño *stateless* del motor.

---

### Fase 05 — Validar decisiones de IA: evaluación de agentes, jueces y observabilidad

**Objetivo:** evaluación por trayectoria vs. resultado, cómo *validar* (no confiar en) un juez LLM, los sesgos del juez, y las convenciones OpenTelemetry GenAI como esquema portable de evidencia.
**Por qué aquí:** es el núcleo de credibilidad del giro. Si Core pasa de pass/fail Rego a detección asistida por IA, debe demostrar que sus juicios son fiables — es lo que hace defendible el enforcement.

- **[Evaluating AI Agents](https://www.deeplearning.ai/courses/evaluating-ai-agents)** — DeepLearning.AI · Arize · Curso vídeo · EN · Gratis · *Estratégico*
  - *Qué IA aporta:* bucle completo — instrumentar con spans/traces, elegir el evaluador por componente, construir datasets desde trazas reales y llevar evals a producción.
  - *Impacto en Evolith:* el recurso con la forma más "Evolith": trace-then-evaluate mapea sobre `EvaluationContext/Result` para evaluar a los agentes mismos y emitirlo como evidencia. "Scorecard → health intelligence".
- **[Using LLM-as-a-Judge for Evaluation](https://hamel.dev/blog/posts/llm-judge/index.html)** — Hamel Husain · Ensayo · EN · Gratis · *Cimiento*
  - *Qué IA aporta:* cómo hacer un juez LLM que coincida con el experto y **cómo demostrarlo** (medir el juez con TPR/TNR), flujo error-analysis-first. Metodología, no tooling.
  - *Impacto en Evolith:* responde la pregunta de credibilidad más dura — ¿cómo confiar en un juicio de IA para gatear merges? Defiende la postura híbrida: Rego para restricciones duras, jueces validados solo para criterios blandos.
- **[A Survey on Evaluation of LLM-based Agents](https://arxiv.org/html/2503.16416v2)** — arXiv · Paper · EN · Gratis · *Móvil*
  - *Qué IA aporta:* mapa de evaluación (resultado vs. trayectoria vs. tool-calls) y los sesgos del juez (posición, verbosidad, self-enhancement) que hacen poco fiable "IA validando IA".
  - *Impacto en Evolith:* el catálogo de sesgos es el argumento más fuerte para la postura híbrida — determinista + juez validado — frente al ingenuo "IA valida IA".
- **[AI Agent Observability — Evolving Standards](https://opentelemetry.io/blog/2025/ai-agent-observability/)** — OpenTelemetry · CNCF · Guía/docs · EN · Gratis · *Estratégico*
  - *Qué IA aporta:* el estándar abierto emergente de instrumentación de agentes (eventos `action`, `artifact`, `memory`) y dónde se detiene (scoring es capa aparte).
  - *Impacto en Evolith:* espina técnica de "evidencia continua": esquema portable y estándar para ese flujo (no telemetría propietaria), dejando abierto el hueco de evaluación/scoring que el motor puede poseer.

---

### Fase 06 — Governance como *enforcement*: policy-as-code, taxonomía de riesgo y la interfaz MCP

**Objetivo:** traducir normas a controles verificables por máquina, extender OPA/Rego de admission-time a autorización por-acción del agente, adoptar una taxonomía de riesgo reconocida para el esquema de resultado, y decidir la superficie MCP que Core expone.
**Por qué aquí:** solo tras poder evaluar con fiabilidad tiene sentido el enforcement.

- **[NIST AI Risk Management Framework + GenAI Profile](https://www.nist.gov/itl/ai-risk-management-framework)** — NIST · Guía/docs · EN · Gratis · *Cimiento*
  - *Qué IA aporta:* taxonomía durable de riesgo de IA (válida/fiable, segura, resiliente, responsable/transparente, explicable, privacidad, justa) mapeada a acciones govern/map/measure/manage.
  - *Impacto en Evolith:* mejor candidato a esquema para `EvaluationResult` y para el modelo de evidencia del Tracker — taxonomía reconocida en vez de inventada.
- **[From Governance Norms to Enforceable Controls](https://arxiv.org/pdf/2604.05229)** — arXiv (Koch, 2026) · Paper · EN · Gratis · *Estratégico*
  - *Qué IA aporta:* governance-como-sistema — descomponer una norma abstracta por capas hasta controles deterministas que un motor de conformance evalúa continuamente.
  - *Impacto en Evolith:* casi un blueprint de la transición central (normas → controles → evidencia continua); generaliza el motor de conformance de checks de arquitectura a governance runtime del fleet.
- **[Agentic AI Governance: Policy-as-Code](https://policyascode.dev/guides/agentic-ai-governance/)** — policyascode.dev · Guía/docs · EN · Gratis · *Móvil*
  - *Qué IA aporta:* por qué la governance por prompt es insuficiente y cómo un gate policy-as-code (request → agente decide tool-call → OPA evalúa → allow/deny) restaura control determinista y auditable.
  - *Impacto en Evolith:* mapea directo sobre el núcleo OPA/Rego y el runtime hexagonal — extender el motor a *admission controller* de acciones de agente. Soporte de la posición "Agent Governance" donde OPA es foso.
- **[MCP: Build Rich-Context AI Apps](https://www.deeplearning.ai/courses/mcp-build-rich-context-ai-apps-with-anthropic)** — DeepLearning.AI · Anthropic · Curso vídeo · EN · Gratis · *Estratégico*
  - *Qué IA aporta:* arquitectura e intención de MCP — host/client/server, primitivos tools vs resources vs prompts, y por qué reduce integración N×M a N+M.
  - *Impacto en Evolith:* decide la forma MCP de Core — exponer motor y grafo como recursos MCP que cualquier agente gobernado consulta a mitad de build, convirtiendo Core de validador batch en asesor en-el-bucle.

---

### Fase 07 — El pago: *Architecture Intelligence* neuro-simbólica + *Software Evolution Intelligence*

**Objetivo:** sintetizar todo en las dos capacidades que definen a Evolith — un motor neuro-simbólico (LLM propone, Rego verifica) que emite señales graduadas de erosión/drift, y un Tracker que mide cómo evoluciona el software bajo autoría humano+IA.
**Por qué al final:** presupone todo lo anterior y es donde la decisión de posicionamiento se vuelve concreta y construible.

- **[IRIS: LLM-Assisted Static Analysis](https://openreview.net/forum?id=9LdJDU7E91)** — OpenReview · ICLR 2025 · Paper · EN · Gratis · *Estratégico*
  - *Qué IA aporta:* arquitectura neuro-simbólica concreta — el LLM genera las specs/hipótesis que un analizador determinista verifica, razonamiento a nivel de repo, efectos medidos en precisión/recall.
  - *Impacto en Evolith:* el blueprint más directo de "reglas estáticas → análisis inteligente". Conserva el núcleo determinista (auditable, ADR-0101) añadiendo un LLM que propone hipótesis que Rego valida. De-riesga *dónde* insertar el LLM: como generador de specs, no como juez final.
- **[Violation Symptoms of Architecture Erosion](https://arxiv.org/html/2306.08616)** — arXiv · Paper · EN · Gratis · *Estratégico*
  - *Qué IA aporta:* cómo se detecta erosión/drift con ML/NLP sobre artefactos, la distinción "síntoma de violación" vs. ruptura dura, y el uplift humano+IA.
  - *Impacto en Evolith:* lleva el veredicto binario de Core a un modelo de "síntoma" — señales graduadas de erosión. El uplift 25.9%→64.7% es la justificación empírica de "scorecard → health intelligence".
- **[Accelerate State of DevOps Report 2024](https://dora.dev/research/2024/dora-report/)** — DORA · Google Cloud · Guía/docs · EN · Gratis · *Estratégico*
  - *Qué IA aporta:* marco de medición validado de la entrega y la evidencia de cómo la adopción de IA mueve esas métricas (positivo en flujo/calidad, negativo en estabilidad/throughput).
  - *Impacto en Evolith:* spec canónico de señales para Tracker como Software Evolution Intelligence (4 keys + Rework Rate). La paradoja IA-vs-entrega es el caso de uso estrella del análisis humano-vs-IA.
- **[From Determinism to Delegation](https://arxiv.org/pdf/2606.28791)** — arXiv (Alenezi, 2026) · Paper · EN · Gratis · *Estratégico*
  - *Qué IA aporta:* nombra los tres cambios de la ingeniería agéntica y reencuadra el rol del ingeniero como gobernar conducta autónoma probabilística.
  - *Impacto en Evolith:* la columna intelectual del reposicionamiento — el giro de correctitud (binario → estadístico) es la transición que Core debe hacer; el giro de responsabilidad es la razón de mercado de una capa de governance + evidencia continua.

---

## 4. Mapa de capacidades (Core / Tracker)

Traducción directa de "lo que aprendes" a "lo que Evolith puede hacer":

| Área de aprendizaje | Capacidad en Evolith Core | Capacidad en Evolith Tracker |
|---|---|---|
| Frontera del LLM + salidas estructuradas | `EvaluationResult` conforme a esquema (findings, madurez, topología, criterios) preservando ADR-0101, con reparto calibrado determinista-Rego vs. LLM | Evidencia como registros estructurados y auditables, cada uno etiquetado según venga de check determinista o inferencia LLM |
| Recuperación, grafos y ontología (GraphRAG) | Ontología de arquitectura explícita + recuperación GraphRAG local/global sobre el grafo para sensemaking de sistema completo | Ensamblado de contexto híbrido grafo+vector con provenance, antes de enviarlo inline a Core |
| Code & repository intelligence | Consultas deterministas al grafo de código alimentando `EvaluationContext`; recuperación y conformance como patrones de subgrafo | Extracción de subgrafo del repo (patrón RepoGraph/CodexGraph) enviada inline en vez de volcado de ficheros |
| Arquitectura de agentes + harnesses | Core como evaluator-optimizer / evaluador independiente sobre la salida del agente, stateless por paso acotado | Artefactos de harness por sesión (progreso, checkpoints, handoffs) como registro auditable de evolución |
| Evaluación y observabilidad de agentes | Validación por trayectoria con jueces LLM validados (TPR/TNR) solo sobre criterios blandos; Rego sobre restricciones duras | Ingesta de spans OTel GenAI/agente (tareas, acciones, artefactos, memoria) como flujo de evidencia portable |
| Governance & policy-as-code | OPA/Rego extendido a PDP runtime que autoriza acciones de agente por tool-call; `EvaluationResult` alineado a NIST AI RMF | Documentación técnica audit-ready y logging automático (forma EU AI Act Art. 11) como evidencia de conformidad continua |
| Neuro-simbólico + evolución del software | Motor neuro-simbólico (LLM propone specs, Rego verifica) que emite síntomas graduados de erosión/drift junto al veredicto binario | DORA (4 keys) + Rework Rate + analítica de contribución humano-vs-IA: evidencia de si los agentes mejoran o erosionan el sistema |

---

## 5. Radar — vigilar, no estudiar como curso

Tecnología y estándares en vuelo. Ábstralos tras un puerto y revísalos en cada release; **no** inviertas un curso en ellos.

1. **OpenTelemetry GenAI/agent semantic conventions** — el SIG `gen_ai.*` (tasks/actions/artifacts/memory), pre-estable.
2. **Identidad y autorización delegada de agentes** — OIDC-A, iniciativa de identidad de agentes de NIST, SPIFFE, cadenas *on-behalf-of*. El primitivo más sin resolver.
3. **OWASP Top 10 for Agentic Applications** + *Agentic AI Threats & Mitigations* (dic 2025) — fuente viva de criterios Rego derivables.
4. **EU AI Act** — obligaciones high-risk con plena aplicabilidad agosto 2026 (Art. 11 documentación técnica, logging automático, conformidad/QMS).
5. **Especificación y seguridad de MCP** — transporte, negociación de capacidades, auth, tool-scoping por tenant.
6. **Variantes de coste de GraphRAG** — LazyGraphRAG / LightRAG; construcción del grafo query-time vs build-time.
7. **Berkeley LLM Agents / Agentic AI MOOC (Dawn Song)** — continuación otoño 2025; verificación de programas y generación de código.
8. **Tooling policy-as-code para agentes** — PDPs runtime OPA/Cedar y el Agent Governance Toolkit de Microsoft como arquitecturas de referencia.

---

## 6. Metodología y verificación

- Selección producida por **investigación multi-agente**: 10 agentes en paralelo (uno por dominio de IA) + una fase de síntesis, con las URLs obtenidas de búsquedas reales.
- Las URLs de mayor riesgo se **verificaron individualmente**, incluidos los papers de arXiv de 2026 (reales; fecha de elaboración: julio 2026).
- Criterio de priorización: **valor estratégico** para evolucionar Evolith y **horizonte temporal** (durable vs. tecnología pasajera) — no idioma ni popularidad.

**Plan de estudio calendarizado (semanas, horas y mini-proyecto por fase):** ver [`evolith-ai-native-plan-es.md`](evolith-ai-native-plan-es.md).
