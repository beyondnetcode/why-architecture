# Plan de estudio calendarizado — Evolith AI-native

> ⚠️ **SUPERADO (2026-07-25)** por el plan de 12 meses de [`evolith-ai-career-path-es.md`](evolith-ai-career-path-es.md) (§5). Se conserva por trazabilidad.

> Compañero operativo de [`evolith-ai-native-route-es.md`](evolith-ai-native-route-es.md). Convierte la ruta de 7 fases en un calendario con **semanas, horas y un mini-proyecto aplicado a Evolith** por fase, más **decision gates** entre fases.

## Cómo usar este plan

- **Perfil asumido:** arquitecto senior con fortaleza previa en arquitectura de software; el plan **no** repasa DDD/hexagonal/clean/microservicios.
- **Ritmo asumido:** ~**6 h/semana** (4 h de estudio + 2 h de aplicación al mini-proyecto). Ajustable: a 3 h/semana, duplica las semanas; a 12 h/semana, divídelas.
- **Duración total:** ~**19 semanas** (≈ 4,5 meses) a 6 h/semana → ~**112 h**.
- **Principio:** cada fase termina en un **artefacto concreto de Evolith**, no en un certificado. El aprendizaje se valida construyendo.
- **Regla de oro:** todo lo del *Radar* (identidad de agentes, OTel GenAI, spec MCP, EU AI Act) se **abstrae tras un puerto** y se revisa por release — no se estudia como curso ni se cablea.

## Vista general

| Fase | Semanas | Horas | Mini-proyecto (entregable Evolith) | Gate |
|---|---|---|---|---|
| 01 · Calibrar la máquina | 2 | 12 | Mapa de frontera de confianza + `EvaluationResult` v2 (JSON Schema) | **G1** |
| 02 · KB → Intelligence | 3 | 18 | Ontología de arquitectura v0 + PoC GraphRAG sobre `codebase-memory` | — |
| 03 · Code intelligence | 2,5 | 15 | Pipeline repo→subgrafo→`EvaluationContext` + 1 conformance como subgrafo | **G2** |
| 04 · Arquitectura de agentes | 3 | 18 | Auditoría ADR-0102 (reclasificar handoffs) + contrato Tracker→Core just-in-time | — |
| 05 · Validar decisiones IA | 3 | 18 | Juez LLM validado (TPR/TNR medidos) + adaptador de ingesta de trazas OTel | **G3** |
| 06 · Governance / enforcement | 2,5 | 15 | PoC OPA runtime PDP (allow/deny por tool-call) + mapeo `EvaluationResult`→NIST | — |
| 07 · Neuro-simbólico + evolución | 3 | 18 | **Capstone:** PoC LLM→Rego (síntoma graduado) + dashboard Tracker DORA + humano-vs-IA | **G4** |

> Total: **19 semanas / ~114 h**. Los *gates* son puntos de decisión donde se para y se decide si el aprendizaje cambió una hipótesis de producto.

---

## Fase 01 — Calibrar la máquina · 2 semanas · 12 h

**Estudio:** *Deep Dive into LLMs like ChatGPT* (Karpathy) → *Getting Structured LLM Output*.

**Mini-proyecto — Mapa de frontera de confianza + `EvaluationResult` v2**
1. Inventaría los tipos de check que Core hace hoy y clasifícalos en **{determinista-Rego, LLM-asistido, híbrido}** con un criterio explícito (¿es demostrable por consulta? ¿es subjetivo? ¿tolera falso positivo?).
2. Redefine `EvaluationResult` como **JSON Schema** (findings, madurez, topología recomendada, criterios derivados, `source: rule|llm`) preservando el contrato ADR-0101.
3. Escribe 1 página: "¿Dónde puede alucinar un LLM dentro de Core y qué capa de verificación lo contiene?".

**Gate G1 — Frontera de confianza firmada.** Si no puedes trazar la línea determinista/LLM con criterio, **no** avances: todo lo demás hereda esta decisión.

---

## Fase 02 — De Knowledge Base a Intelligence · 3 semanas · 18 h

**Estudio:** *Knowledge Graphs for RAG* → *GraphRAG* (MS Research) → *Ontología vs. KG* → *RAG* (DeepLearning.AI).

**Mini-proyecto — Ontología de arquitectura v0 + PoC GraphRAG**
1. Modela una **ontología explícita**: topologías, concerns, criterios, ADRs, violaciones, drift — con sus relaciones y restricciones. Es tu foso; apalanca tu experiencia empresarial.
2. Sobre `codebase-memory`, monta un **PoC GraphRAG** (local + global) que responda 3 preguntas de *arquitectura completa* que hoy ningún RAG plano contesta (p. ej. "¿qué clusters de acoplamiento cruzan bounded contexts?").
3. Anota *provenance* en cada respuesta (nodo/arista que la sustenta) — semilla de la "evidencia continua".

---

## Fase 03 — Code & repository intelligence · 2,5 semanas · 15 h

**Estudio:** *RepoGraph* → *About CodeQL* → *AI for Software Architecture: Literature Review*.

**Mini-proyecto — repo→subgrafo→`EvaluationContext`**
1. Pipeline que, dado un repo, extrae un **subgrafo relevante** (patrón RepoGraph) y lo envía como `EvaluationContext` en vez de volcar ficheros.
2. Implementa **1 check de conformance como patrón de subgrafo determinista** (p. ej. "ningún adaptador importa el dominio de otro bounded context").
3. Usando el *survey*, marca en una tabla qué capacidades de tu roadmap están **respaldadas por investigación** vs. son aspiracionales.

**Gate G2 — Decisión de sustrato.** Decide: ¿Core **posee** la extracción del grafo o la **recibe** inline del Tracker? Documenta la razón. Condiciona F4-F7.

---

## Fase 04 — Arquitectura de agentes · 3 semanas · 18 h

**Estudio:** *Building Effective Agents* → *Effective Context Engineering* → *Agentic AI* (Ng) → *Effective Harnesses*.

**Mini-proyecto — Auditoría ADR-0102 + contrato Tracker→Core**
1. Reclasifica cada handoff de "Winston + 9" en **{workflow determinista (routing/orchestrator-worker), agente genuino}** con la taxonomía de Anthropic. Lo que sea workflow → hazlo determinista y gobernable.
2. Rediseña el contrato **Tracker→Core** con *context engineering*: de "volcar repo" a **recuperación just-in-time** sobre el grafo (con compactación).
3. Sitúa a Core como **evaluator-optimizer** del bucle (agente propone → Core evalúa contra Rego → revisa). Diagrama el bucle.

---

## Fase 05 — Validar decisiones de IA · 3 semanas · 18 h

**Estudio:** *Evaluating AI Agents* → *LLM-as-a-Judge* (Hamel) → *Survey on Evaluation of LLM-based Agents* → *AI Agent Observability* (OTel).

**Mini-proyecto — Juez validado + ingesta OTel**
1. Elige **1 criterio de arquitectura blando** (p. ej. "¿esta decisión respeta la intención del ADR-X?"). Etiqueta a mano ~30-50 casos.
2. Construye un **LLM-judge** y **mide su TPR/TNR** contra tu set. Itera con error-analysis hasta que el juez sea defendible; documenta dónde falla.
3. Prototipa un **adaptador de ingesta de trazas OTel GenAI** (action/artifact/memory) como entrada de evidencia — tras un puerto.

**Gate G3 — Credibilidad.** Si el juez no alcanza fiabilidad demostrable, ese criterio **se queda en Rego**. Regla: LLM solo donde el juez está validado; Rego para lo duro.

---

## Fase 06 — Governance como enforcement · 2,5 semanas · 15 h

**Estudio:** *NIST AI RMF + GenAI Profile* → *From Governance Norms to Enforceable Controls* → *Agentic AI Governance: Policy-as-Code* → *MCP*.

**Mini-proyecto — OPA runtime PDP + esquema NIST + superficie MCP**
1. Extiende Rego de admission-time a un **PDP runtime**: allow/deny por **tool-call de agente** (request → agente decide → OPA evalúa → decisión), tras un puerto/adaptador.
2. Mapea `EvaluationResult` a la **taxonomía NIST AI RMF** (usa una taxonomía reconocida, no inventada).
3. Decide y documenta la **superficie MCP de Core**: ¿motor + grafo expuestos como recursos MCP que agentes gobernados consultan a mitad de build?

---

## Fase 07 — Neuro-simbólico + Software Evolution Intelligence · 3 semanas · 18 h (capstone)

**Estudio:** *IRIS* → *Violation Symptoms of Architecture Erosion* → *DORA 2024* → *From Determinism to Delegation*.

**Mini-proyecto capstone — PoC neuro-simbólico + Tracker de evolución**
1. **Motor neuro-simbólico (patrón IRIS):** el LLM **propone** una hipótesis de violación/erosión sobre el grafo → **Rego verifica** → Core emite un **síntoma graduado** (no solo pass/fail). Mide precisión sobre casos conocidos.
2. **Tracker de evolución:** dashboard con las **4 keys de DORA + Rework Rate** y una primera métrica de **contribución humano-vs-IA** a partir de las trazas de F5.
3. **Documento de decisión de posicionamiento:** con toda la evidencia acumulada, confirma o revisa la recomendación (*Architecture Intelligence Layer* como núcleo, *Software Evolution Intelligence* como North Star) y marca qué construir primero.

**Gate G4 — Build / no-build.** Decisión final: ¿el PoC neuro-simbólico justifica invertir en el motor? ¿La evidencia de evolución es diferenciadora y factible? Sal con un roadmap de producto priorizado, no con más hipótesis.

---

## Notas de ejecución

- **Sustituto gratuito de la Fase 04:** *Agentic AI* (Ng) es de pago; sus conceptos (reflection/planning/eval) se cubren en gran parte con los ensayos de Anthropic + la *Survey* de la Fase 05 si prefieres no pagar.
- **Un commit de observabilidad antes que una hipótesis:** cuando un mini-proyecto se atasque, añade primero medición (trazas, métricas del juez), no otra suposición.
- **Los gates son reales:** su función es evitar arrastrar una decisión mal tomada a las fases siguientes, que es donde se vuelve cara.
