# Evolith — Diagnóstico: qué funciona, qué falla, qué hacer

> **Navegación bilingüe:** [Read in English](evolith-assessment-en.md) · **¿Un término que no conoces?** [Glosario AI-native](glosario-ai-native-es.md)
>
> **Documentos hermanos:** el [Career Path](evolith-ai-career-path-es.md) dice *qué aprender*; el [Posicionamiento](evolith-suite-positioning-es.md) dice *contra quién se compite*. **Este dice qué hay, qué está roto y en qué orden arreglarlo.**
>
> **Base:** inspección del código real por cinco evaluadores en paralelo, uno por componente, más síntesis de conjunto y FODA. Todo hallazgo lleva su evidencia: fichero, [ADR](glosario-ai-native-es.md#adr-architecture-decision-record) o cifra. Fecha: 2026-07-26.

---

## Índice

- [Cómo leer esto](#cómo-leer-esto)
- [Cuadro de mando](#cuadro-de-mando)

**Por componente**
1. [Evolith Core](#1-evolith-core)
2. [Evolith Tracker](#2-evolith-tracker)
3. [Evolith CLI](#3-evolith-cli)
4. [Evolith MCP](#4-evolith-mcp)
5. [Evolith Agent Runtime](#5-evolith-agent-runtime)

**Como producto**
6. [El conjunto](#6-el-conjunto)
7. [FODA](#7-foda)
8. [Plan: qué hacer y en qué orden](#8-plan-qué-hacer-y-en-qué-orden)
9. [Metodología y una corrección](#9-metodología-y-una-corrección)

---

## Cómo leer esto

Cada componente tiene la misma estructura: **qué hace bien** (con evidencia, porque hay que saber sobre qué construir), **qué hace mal** (ordenado por consecuencia, no por facilidad), **qué mejorar** (con el cómo concreto y el esfuerzo) y **la única cosa** si solo cabe una.

Una regla de lectura, porque cambia el sentido de todo: **casi nada de lo que falla es un fallo de diseño.** El patrón dominante es *código correcto, probado y sin conectar*. Eso es buena noticia — se arregla en semanas, no en trimestres — y mala — significa que el producto lleva meses pareciendo más completo de lo que está.

---

## Cuadro de mando

Puntuación de 1 a 5. **D**=diseño · **I**=implementación · **O**=operación · **C**=defensibilidad frente a un competidor.

| Componente | Veredicto en una línea | D | I | O | C | La única cosa |
|---|---|:-:|:-:|:-:|:-:|---|
| **Core** | Fronteras y modos de fallo bien diseñados, pero **91 reglas "bloqueantes" no ejecutan nada** y el rastro de auditoría se escribe en blanco | 4 | 2 | 3 | 2 | Degradar las 91 reglas fantasma y poblar el mapper |
| **Tracker** | El código más serio de la suite — auditoría inmutable por base de datos, 12 robots que muerden en CI — pero **el ledger de agentes está escrito, probado y sin registrar en DI** | 4 | 3 | 2 | 2 | Conectar el ledger y **tipar el actor** |
| **CLI** | Contrato máquina bien diseñado y **socavado por falsos verdes**: cinco comandos pintan un menú y salen 0 | 4 | 3 | 2 | 3 | Modo máquina que nunca pregunta + taxonomía de códigos de salida |
| **[MCP](glosario-ai-native-es.md#mcp)** | El servidor MCP mejor gobernado que he leído — y **15 de sus 50 herramientas están denegadas hoy** por su propia política compilada | 4 | 2 | 3 | 2 | Un manifiesto único que genere rego, catálogo y esquemas |
| **Agent Runtime** | El mejor ingeniería de la suite, **envolviendo casi ningún agente**: 7 skills, cero que pidan aprobación, índice vacío | 4 | 2 | 3 | 2 | Catálogo de skills derivado del manifiesto (7 → 16) |

**Lectura del cuadro:** el diseño está en 4 en los cinco. La implementación en 2-3. La operación y la defensibilidad en 2-3. **Eso no es un producto mal diseñado: es un producto bien diseñado y sin terminar de cablear.**

---

# Por componente

## 1. Evolith Core

> **Veredicto:** el motor está bien construido y certifica mucho menos de lo que aparenta.

### 1.1 Qué hace bien

| Acierto | Evidencia | Por qué fue la decisión correcta |
|---|---|---|
| **La frontera stateless es real** | `evaluation-orchestrator.service.ts` son 120 líneas; `binding: false` es un tipo literal. ADR-0101 **corrige explícitamente un error de altitud** de ADR-0100: habías subido `Producto`/`Iniciativa` a Core y lo revertiste | Es la razón de que un solo motor se embeba en CLI, [MCP](glosario-ai-native-es.md#mcp) y REST **sin tres modelos de estado**. La reversión es el acto arquitectónico más valioso del repo |
| **Falla cerrado, y el razonamiento está escrito** | `opa-evaluator.ts:75-81` (falta `policy.wasm` → todas las reglas `failed`, no omitidas); `shell-enforcer-adapter.ts:57-66` **lanza** con el comentario "una herramienta sin informe parseable nunca certificó nada"; GT-569 dejó de degradar excepciones a `skipped` | Tres sitios donde lo fácil era un falso aprobado y elegiste lo difícil |
| **El veredicto declara su propio denominador** | `ruleset-validator.service.ts:111-116` emite `rulesChecked/Skipped/Errored/Total` + los IDs | Casi ninguna herramienta de governance te dice **qué no comprobó**. Es lo que hace descubrible el problema de §1.2 |
| **La paridad dual la impone maquinaria, no la costumbre** | `.github/workflows/opa-parity.yml` barre a diario; GT-556/557/558 documentan **una puerta de paridad que amplió su propio alcance y salía 0 — encontrada y matada** | Disciplina rara: mataste un test que se autocertificaba |
| **La identidad de violación sobrevive al cambio de herramienta** | `violation.ts` calcula huella con ruta+regla+herramienta+coords y **excluye `message`** | Una actualización de [dependency-cruiser](glosario-ai-native-es.md#archunit--deptrac--dependency-cruiser--import-linter) no rompe las líneas base. Precondición para que cualquier acumulación valga algo dentro de un año |
| **Normalizar salida OSS en vez de construir extractor propio** | `ownership.ts` (prefijo más largo sobre Backstage/Port/Cortex), `compliance.ts` (catálogo como **dato versionado**) | Te ahorró 18 meses que no tenías |

### 1.2 Qué hace mal

| # | Defecto | Evidencia | Consecuencia |
|---|---|---|---|
| **1** | **91 reglas bloqueantes no ejecutan nada** | De 126 generadas, 91 son `blocking:true, enforcement:"executable"` y las 91 contienen la cadena literal *"Concrete checks to be wired into the [harness](glosario-ai-native-es.md#harness)"*. `NativeEvaluator` no encuentra handler → `skipped` | Un prospecto lee "126 reglas, 91 bloqueantes" y encuentra que trabajan 41 ficheros escritos a mano. **Lo descubre con un grep en diez minutos**, y esa pérdida de credibilidad no se arregla después |
| **2** | **Tres campos de trazabilidad siempre vacíos, y dos consumidores los leen** | `canonical-result.mapper.ts:130,133,134` fijan `rulesExecuted: []`, `risks: []`, `missingEvidence: []` incondicionalmente. `sarif-exporter.ts:256` y `drift-gate.ts:203` derivan de ahí | **Todo [SARIF](glosario-ai-native-es.md#sarif) y todo manifiesto de evidencia que emites hoy dice "0 reglas evaluadas".** El grafo de auditoría que es el foso se está escribiendo en blanco |
| **3** | **El rastro registra el motor equivocado** | `canonical-result.mapper.ts:72` fija `engine: 'opa'` siempre, corriera quien corriera | En un producto cuya paridad dual es argumento de venta, el artefacto que la probaría **falsifica la mitad de sus registros** |
| **4** | **Cinco adaptadores de enforcement, un ruleset escrito** | Los cinco se cablean en las tres superficies. Solo `adr-0002-hexagonal.rules.json` escribe bloques `enforce:` — 6 reglas, **todas dependency-cruiser** | La promesa multi-lenguaje es código de adaptador sin corpus detrás. **Un prospecto .NET recibe cero reglas** |
| **5** | **ADR-0111 es `Proposed` y tiene cero adaptadores** | No hay implementación de `IStructuralReviewer` en `src/`; `TenantQualitySignalRegistry` no se instancia fuera de tests | La costura sancionada para meter IA es un enchufe con la forma correcta y sin nada conectado |
| **6** | **La cadena OPA está 18 meses atrás y el artefacto va commiteado** | `compile-opa-wasm.mjs` descarga v0.65.0; upstream va por 1.18.2 (ruptura mayor de Rego). `policy.wasm` es un binario en git; los caminos de distribución de ADR-0085 están en cero pasos de CI | No puedes adoptar Rego moderno, y el día que caiga un CVE envías un blob que no puedes reconstruir bajo revisión |
| **7** | **`kinds` no acota la evaluación** | `:39` corre el pipeline completo antes de leer `ctx.kinds`; `:51` descarta silenciosamente los kinds sin evaluador (`evidence`, `rule`) | Quien pide solo `topology` recibe un veredicto global fijado por puertas que nunca pidió |

### 1.3 Qué mejorar

| # | Arreglo | Cómo | Esfuerzo |
|---|---|---|---|
| 1 | Degradar las 91 reglas a `blocking:false, enforcement:"advisory"` y añadir puerta de CI que rechace `blocking && executable` sin handler ni `.rego` | Modificar `generate-adr-rulesets.mjs` + test | 3 días |
| 2 | Poblar `rulesExecuted` y el `engine` real en el mapper | Pasar el resultado del evaluador al mapper en vez de literales | 1 semana |
| 3 | Escribir corpus `enforce:` para al menos un lenguaje más | Un ruleset import-linter (Python) y uno NetArchTest (.NET) | 2 semanas |
| 4 | Decidir la cadena OPA: subir a 1.x o vendorizar 0.65 conscientemente | Los 32 `.test.rego` son el arnés de migración | 2-3 semanas |
| 5 | Acotar por `kinds` antes de ejecutar | Filtrar en `:39`; error explícito para kind sin evaluador | 3 días |

### 1.4 La única cosa

**Arreglos 1 y 2, juntos.** El primero elimina la afirmación más falsable del producto; el segundo hace que lo que se escriba a partir de mañana valga algo. Hoy Core **decide bien y registra en blanco**.

---

## 2. Evolith Tracker

> **Veredicto:** el código más serio de la suite, incapaz todavía de responder la pregunta que el producto vende.

### 2.1 Qué hace bien

| Acierto | Evidencia | Por qué importa |
|---|---|---|
| **Auditoría inmutable por base de datos, no por convención** | Migración `20260719202323_MakeAuditEntriesAppendOnly.cs`: triggers UPDATE/DELETE/**TRUNCATE** + REVOKE, y el comentario explica **por qué el REVOKE solo no basta** (el dueño ignora sus propios grants) y qué sigue sin cubrir (`DROP TABLE`) | Un log que la aplicación puede modificar no es evidencia. **En un producto de governance esa propiedad *es* el producto** |
| **RoboSoft no es una suite de tests: es una puerta de despliegue que muerde** | 12 robots, 1.632 LOC, cero dependencias, **108 aserciones**. `deploy-check.yml:96` los corre contra **kind + Helm + Postgres reales**, entre un despliegue local y uno de producción; luego `verify-failclosed` prueba que `dev-bypass` es inalcanzable en la imagen de producción | **Es el mejor artefacto de ingeniería de los dos repos.** Prueba de comportamiento de semántica de governance contra infraestructura real, no mocks |
| **El canal [HITL](glosario-ai-native-es.md#hitl-human-in-the-loop) tiene identidades genuinamente opuestas** | `/runtime-approvals` atado **por nombre de esquema** a auth de máquina (lo que hace inalcanzable `dev-bypass`); `/resolve` solo humanos; el Core **no tiene método de concesión** (GT-441); tenant del claim, nunca del cuerpo; idempotencia por `correlationId` | Si quien pide puede conceder, la puerta humana es decorativa. Aquí no puede |
| **[Provenance](glosario-ai-native-es.md#provenance-procedencia) promovida a columnas por la razón correcta** | T-048 sacó `dimension` y `determinism` del jsonb con el argumento "enterrada en un jsonb no se puede filtrar ni gobernar" | `determinism` (medición determinista vs estimación probabilística) es exactamente lo que pregunta una auditoría |
| **Escala real** | 92 migraciones, 45 tablas en 7 esquemas, **915 `[Fact]`/`[Theory]` en 163 ficheros**, capas hexagonales con filtro de solución para tests de arquitectura | — |

### 2.2 Qué hace mal

| # | Defecto | Evidencia | Consecuencia |
|---|---|---|---|
| **1** | **El ledger de turnos de agente está completo, probado y sin conectar** | `AgentExecutionService.cs` hace lo correcto —valida alcance, **audita antes de ejecutar y aborta el turno si falla la escritura de auditoría**— y `IAgentExecutionPort` aparece en **cero registros de DI y cero endpoints**. `AssistantEndpoints.cs` pasa de largo y **no persiste nada** | Todo turno de agente que ha corrido está sin registrar. **La afirmación diferenciadora del producto es hoy falsa en código que está al 90%** |
| **2** | **`audit_entries.actor_id` es un `Guid` pelado** | `AuditEntryProps.cs:11`. Sin `actor_type`, sin agent/model/session id | Aunque se conecte el ledger, cada fila es ambigua — y **como la tabla es [append-only](glosario-ai-native-es.md#append-only) por trigger, no se puede rellenar hacia atrás**. Cada día produce historia permanentemente sin tipar |
| **3** | **El grafo de evidencia es una lista que nadie recorre** | `References` es `List<string>` en jsonb; el único consumidor no-test es un `Contains()` para deduplicar. Sin tabla de aristas, sin tipo, sin consulta por profundidad | "Qué [ADR](glosario-ai-native-es.md#adr-architecture-decision-record) se movió por qué decisión de puerta por qué turno de agente" es **inrespondible**, y esa cadena es el foso declarado |
| **4** | **`repository_revision` se guarda y nunca se lee como serie** | Solo hay `GET /` y `GET /{id}`. Sin consulta por repo, sin orden por revisión, sin diff | El sustrato perfecto del drift existe y **no produce ninguna señal de drift** |
| **5** | **Telemetría apagada por defecto y sin atributos** | `TrackerTracing.cs` retorna temprano y **no registra nada** si `Otlp:Endpoint` está vacío (el defecto). Cero `StartActivity` en producción | No hay forma de reconstruir el relato después |
| **6** | **Deriva documental sistemática** | Badge dice 30 decisiones (van por T-054); el diseño de datos declara 10 esquemas/33 tablas contra **7/45 reales**, y nombra cinco esquemas que **no existen**; el README de robosoft dice 3 robots contra 12 | Una diligencia debida lee el diseño y encuentra cinco esquemas inexistentes |

### 2.3 Qué mejorar

| # | Arreglo | Cómo | Esfuerzo |
|---|---|---|---|
| 1 | **Conectar `AgentExecutionService` + tipar el actor** | Registrar `IAgentExecutionPort` en DI; enrutar `AssistantEndpoints` a través de él; migración con `actor_type`, `agent_id`, `model_id`, `session_id`; ampliar `audit-trail.robot.mjs` | **2 semanas** |
| 2 | Promover `references` a tabla `evidence_edges` tipada | Tabla con índices en ambos sentidos; backfill; `GET /{id}/graph?depth=n` | 3 semanas |
| 3 | Convertir `core_evaluation_transactions` en serie por revisión | `GET ?repositoryUrl=&since=`; columna de proyección `verdict`; fila `DriftDetected` al cambiar veredicto entre revisiones | 2-3 semanas |
| 4 | Encender telemetría con atributos de dominio | `Otlp:Endpoint` en el configmap; `StartActivity` con tenant/initiative/agent | 1 semana |
| 5 | Reconciliar diseño de datos y badges con el código | Regenerar desde el snapshot del modelo | 3 días |

### 2.4 La única cosa

**Arreglo 1.** No el despliegue, y la razón es de **orden, no de tamaño**: la tabla es inmutable a nivel de base de datos, así que las filas escritas antes de que exista `actor_type` **no se pueden corregir jamás**. Son dos semanas sobre código ya escrito y probado.

---

## 3. Evolith CLI

> **Veredicto:** buen contrato máquina, socavado por una clase de defecto que fabrica falsos verdes.

### 3.1 Qué hace bien

| Acierto | Evidencia |
|---|---|
| **El envelope ADR-0073 es real y compartido** | 30 de 35 comandos pueden emitirlo; `error.code` —no el estado HTTP— es el contrato entre CLI, [MCP](glosario-ai-native-es.md#mcp) y REST |
| **`makeStdioBlocking()` es un arreglo sofisticado** | Node bufferiza escrituras a tubería; cualquier `process.exit()` trunca la salida en 64 KiB y convierte un envelope grande en JSON no parseable. Arreglado una vez, centralmente. **La mayoría de las CLIs nunca encuentran este bug** |
| **La aplicación en tiempo de edición funciona — verificada en vivo** | `enforce edit` normaliza payload agnóstico de proveedor y sale **2** para vetar. Prueba real: fichero de dominio importando infraestructura → `EXIT=2`, [stderr](glosario-ai-native-es.md#stdout--stderr) `HXA-01 [ADR-0002]`. **Es la pieza más defendible del paquete** |
| **El generador de catálogo no puede derivar** | Arranca el servidor MCP real por stdio, hace el handshake JSON-RPC y escribe el catálogo. Las cifras son `TOOLS.length`, nunca literales |
| **Higiene de tests inusualmente honesta** | La cabecera de `surface-parity.e2e-spec.ts` documenta haber quitado aserciones blandas que dejaban regresar GT-452/GT-474 en verde, y dice que el "DONE" de GT-223 es inexacto |

### 3.2 Qué hace mal

| # | Defecto | Evidencia | Consecuencia |
|---|---|---|---|
| **1** | **Falsos verdes: menú interactivo en stdout, salida 0, bajo `--format json`** | Verificado en vivo con stdin cerrado: `adr`, `standards`, `agents`, `satellite:create` y `sdlc handoff` pintan un menú `@clack` en español con ANSI **en stdout** y **salen 0** | Un paso de CI hace `\| jq`, recibe basura, lee salida 0 y **da verde sobre un repo que nunca se evaluó**. Una herramienta de governance que fabrica falsa confianza es peor que ninguna |
| **2** | **Los códigos de salida no separan veredicto de fallo** | 20 `process.exit(1)` y 78 `process.exitCode = 1`; el único código distinto es el 2 del hook de edición. Verificado: `gate evaluate` con Core inalcanzable sale **1** — idéntico a un `GATE_BLOCKED` real | **El producto está tirando la única distinción que constituye su valor** |
| **3** | **`api --inspect` está muerto para las 50 herramientas** | El catálogo generado contiene `inputSchema` **cero veces**; los `TOOL_SCHEMAS` a mano son 3 y **ninguno existe** entre los 50 reales. `api --inspect gate-evaluate` devuelve **un envelope de éxito con un esquema fabricado para una herramienta inexistente** | La superficie de autodescubrimiento **engaña activamente a los agentes** |
| **4** | **`waiver` —el comando que anula un veredicto— está fuera del contrato** | Sin `--format`; imprime un array crudo sin `success`, sin `meta`, sin `correlationId` | La única acción que **cancela** governance es la que el Tracker no puede ingerir ni correlacionar |
| **5** | **`chat` es una llamada RPC vendida como REPL** | 91 líneas: imprime, llama una vez, imprime, sale. Sin bucle, sin sesión | Cualquier comprador lo descubre en 30 segundos |
| **6** | **La guía inglesa está escrita en español** | `using-the-cli.md` | **La cuña OSS no tiene documentación en inglés desde la que adoptarse** |

### 3.3 Qué mejorar

| # | Arreglo | Cómo | Esfuerzo |
|---|---|---|---|
| 1 | **Modo máquina que nunca pregunta + taxonomía de salida** | En `BaseEvolithCommand`: rechazar todo prompt si `format==='json'` o no hay TTY → envelope de error + código distinto de 0. Mapa: 0 pasa · 1 fallo de herramienta · 2 veredicto bloqueado · 3 entrada inválida. Sustituir los 98 unos | 1-2 semanas |
| 2 | Generar esquemas y retirar `TOOL_SCHEMAS` | El generador ya recibe `inputSchema` en la respuesta y lo descarta: persistirlo | 2-3 días |
| 3 | Conformidad de envelope sobre los 35 comandos | Dirigir el test por tabla desde la lista de comandos del módulo | 1 semana |
| 4 | Meter `waiver` en el contrato | `--format`, envelope, `correlationId` | 2 días |
| 5 | Guía real en inglés y borrar código muerto | — | 1 semana |

### 3.4 La única cosa

**Arreglo 1.** Los demás son huecos de capacidad; **este es un hueco de integridad**. Desacredita la cuña en el momento en que el pipeline de un cliente da verde sobre un repo que nunca se evaluó.

---

## 4. Evolith MCP

> **Veredicto:** el servidor [MCP](glosario-ai-native-es.md#mcp) mejor gobernado que he leído, con el 30% de su superficie denegada hoy por su propia política.

### 4.1 Qué hace bien

| Acierto | Evidencia |
|---|---|
| **La puerta [HITL](glosario-ai-native-es.md#hitl-human-in-the-loop) está guardada por un test derivado, no por una fixture** | `mutative-hitl-parity.spec.ts` deriva el conjunto de herramientas que mutan **desde el clasificador ABAC** y exige que declaren `mutative:true`. **Una herramienta de escritura que olvide la marca rompe la compilación** — el bypass clásico se vuelve estructuralmente imposible |
| **ABAC falla cerrado donde importa** | Deniega duro si falta `policy.wasm` en producción; cualquier excepción de OPA → denegar; el dispatch exige que **ambos** motores permitan |
| **Cada llamada produce auditoría con veredicto e identidad** | Distingue `denied` de `error` —la distinción que un auditor necesita—, redacta claves sensibles y usa huella de [token](glosario-ai-native-es.md#token) |
| **Descubrimiento previo sin gastar llamada** | `evolith://capabilities` y `evolith://contracts`. **Muy pocos servidores MCP publican manifiesto de capacidades** |
| **Higiene por encima de la norma** | 390 `it()`, 87,3% de líneas; comparación de clave en tiempo constante, tope de 1 MB, límite por IP, saneador de traversal; SDK en la versión actual |

### 4.2 Qué hace mal

| # | Defecto | Evidencia | Consecuencia |
|---|---|---|---|
| **1** | **El 30% de la superficie está muerta ahora mismo** | Cargando **el artefacto compilado que se usa en dispatch** y evaluándolo: 15 herramientas ([ADR](glosario-ai-native-es.md#adr-architecture-decision-record), patrones, scaffold, upgrade, init, fixtures, docs) devuelven `ABAC-03` para un arquitecto en producción. El `.rego` gemelo nunca las recibió; **nada guarda rego↔TS** | Un agente pide a Evolith sus propios ADRs y **es rechazado**. En producción es silencioso y total |
| **2** | **`tools/list` cacheado bajo clave global** | Clave literal `mcp:tools:list`, leída **antes** del filtro por alcance. El primer llamante gana durante 600 s | **Fuga de autorización en la superficie de descubrimiento**: un admin cebando la caché filtra el inventario de escritura a todos los lectores |
| **3** | **Cero `outputSchema`, cero [`structuredContent`](glosario-ai-native-es.md#outputschema--structuredcontent), cero anotaciones** | El tipo `McpToolSchema` es exactamente `{name, description, inputSchema}`. Los resultados van como texto | Un `EvaluationResult` **es** un esquema; emitirlo como prosa obliga al modelo a extraer con regex un veredicto que debería poder validar. Es **el coste directo del principio de paridad de superficies**: la CLI no necesita esquemas de salida, así que MCP no los tuvo |
| **4** | **ADR-0093 está Aceptado y al 0%** | Exige `baseSha`, verificación de HEAD, contrato de conflicto y bloqueos. Cero apariciones. Hay 20 herramientas que mutan | Dos agentes sobre un workspace producen exactamente la actualización perdida que el ADR se escribió para evitar |
| **5** | **RFC 9728 incumplido y un agujero en OAuth** | Sin `.well-known`, sin `WWW-Authenticate`. Y `oauth-resource-server.ts:234` valida `exp` solo *si existe*: **un token sin `exp` no caduca nunca** | Ningún cliente conforme descubre el servidor de autorización; y hay una credencial perpetua aceptable |
| **6** | **El modelo de sesión lo borra la especificación** | 10 referencias a `sessionId`; devuelve 400 si falta la cabecera. La revisión `2026-07-28` elimina `Mcp-Session-Id` e `initialize` | Todo cliente conforme se rompe |

### 4.3 Qué mejorar

| # | Arreglo | Cómo | Esfuerzo |
|---|---|---|---|
| 1 | **Un manifiesto canónico que genere rego, catálogo, esquemas y anotaciones** | Emitir `tools.manifest.json` desde el registro; generar los conjuntos del `.rego` y recompilar en CI; test que evalúe el wasm sobre los 50 nombres | 1-2 semanas |
| 2 | Cachear `tools/list` por principal, o borrar la caché | Clave con hash de alcances+tenant; mejor, quitarla | 1 día |
| 3 | Añadir `outputSchema`, `structuredContent` y anotaciones honestas | Ensanchar el tipo; generar desde `SCHEMA_VERSION` | 2-3 semanas |
| 4 | Implementar ADR-0093 | `baseSha` en las 20 herramientas mutativas | 2-3 semanas |
| 5 | [PRM](glosario-ai-native-es.md#prm-protected-resource-metadata-rfc-9728) + reto de alcance + `exp` obligatorio | Servir `.well-known`; rechazar tokens sin `exp` numérico | 1 semana |
| 6 | Shim de doble protocolo para `2026-07-28` | [`server/discover`](glosario-ai-native-es.md#serverdiscover), `_meta`, [MRTR](glosario-ai-native-es.md#mrtr-multi-round-trip-requests) sustituyendo el token portador | 4-6 semanas |

### 4.4 La única cosa

**Arreglo 1.** Es el único que es a la vez arreglo de una caída, arreglo de diseño y habilitador: convierte la paridad **de disciplina en artefacto de compilación**, y deja todo lo demás como cambio de generador en vez de edición a mano por 50 sitios.

---

## 5. Evolith Agent Runtime

> **Veredicto:** la mejor ingeniería de la suite, envolviendo casi ningún agente.

### 5.1 Qué hace bien

| Acierto | Evidencia |
|---|---|
| **Falla cerrado en el arranque** | En perfil producción **lanza** si faltan endpoint del Core, [token](glosario-ai-native-es.md#token), directorio de estado durable u OPA real. La aprobación por defecto es denegar |
| **La frontera de puertos aguantó presión real** | El servicio importa **cero adaptadores**. Prueba de que pagó: Hermes → Swarms → Cowork → Gemini se añadieron **sin tocar el orquestador**. 309 tests en 1,57 s sin red ni disco |
| **El sellado de procedencia es el diferenciador real** | Cada resultado lleva `executedBy/validatedBy/governedBy/policyEngine/approvedBy/groundedBy{corpusVersion,citations}`. **Eso no lo produce quien atornilla un [LLM](glosario-ai-native-es.md#llm) a un linter** |
| **Los controles de salida al LLM son mejores que los de la mayoría** | Clave en cabecera nunca en URL, timeout, presupuesto de bytes que **falla cerrado en vez de truncar un prompt gobernado**, respuesta validada contra esquema, y evento de auditoría sin contenido **incluso en los rechazos** |
| **Detalles de operación pensados de verdad** | Detecta un binario OPA de arquitectura equivocada cacheado y lo re-descarga en build. Un comentario de 20 líneas registra un incidente real de producción y el arreglo — **eso vale una semana de la vida de alguien** |

### 5.2 Qué hace mal

| # | Defecto | Evidencia | Consecuencia |
|---|---|---|---|
| **1** | **Nada requiere aprobación humana, así que la puerta [HITL](glosario-ai-native-es.md#hitl-human-in-the-loop) nunca ha disparado** | Los 7 skills y las 16 capacidades del manifiesto declaran `requiresApproval: false` | ~1.000 líneas del subsistema de aprobación son inalcanzables; el contador de aprobaciones es estructuralmente 0. **La afirmación de governance más ruidosa no se ha ejecutado nunca** |
| **2** | **El catálogo de skills es un array de 7 mientras el manifiesto expone 16** | El registro siembra `DEFAULT_SKILLS` y nunca lee el manifiesto —aunque el adaptador de proceso sí lo lee | El agente ofrece el 25% de lo que el [harness](glosario-ai-native-es.md#harness) ya sabe hacer, y la postura de governance tiene **dos fuentes de verdad**: exactamente la deriva que ADR-0102 nombró como su riesgo principal y no mitigó |
| **3** | **El grounding es decorativo y el índice está vacío** | Se calcula y se usa en **un solo sitio: la traza**. Nunca se pasa a `plan()` ni al contexto de evaluación. Y el adaptador por defecto es un array que nadie siembra | **El sistema cita fuentes que no consultó.** Los 276 LOC de [pgvector](glosario-ai-native-es.md#pgvector), el esquema SQL y el sidecar están construidos y el workflow corre en dry-run permanente |
| **4** | **La memoria es de solo escritura** | Llama `append` dos veces y nunca `history()` ni `recall()`, que el puerto define | El turno 2 no sabe nada del turno 1. Para un producto que se vende como operar el Core agénticamente, es el hueco que aparece en la primera demo |
| **5** | **Los argumentos propuestos por el motor se descartan** | Todos los motores devuelven `proposedArguments`; el servicio consume solo `proposedTool` | El día que entre un motor real, **elegirá la herramienta correcta y la ejecutará con parámetros obsoletos** — la peor clase de fallo para un producto de auditoría |
| **6** | **Sin [sandbox](glosario-ai-native-es.md#sandbox) ni limpieza de credenciales** | Se lanzan procesos hijo con `...process.env`, entregando a cada script el token del Core, el del tracker y la URL de la base vectorial. ADR-0081 es papel — igual que 0082, 0086, 0088, 0089, 0092 y 0094: **cero apariciones** | — |

> **Sobre "17 puertos y 49 adaptadores para una sola pasada":** el camino caliente depende de 9 puertos requeridos y está **bien dimensionado, admirablemente contenido**. Lo sobre-inventariado es el borde: dos adaptadores de interacción sin ninguna llamada, y `StructuralReviewProvider` completo y conectado a nada. **El error no es construirlo: es contarlo como capacidad en los documentos de visión.**

### 5.3 Qué mejorar

| # | Arreglo | Cómo | Esfuerzo |
|---|---|---|---|
| 1 | **Catálogo de skills derivado del manifiesto, con postura heredada** | Nuevo adaptador que lea `.harness/manifest.yaml` (el cargador ya existe); la postura viene del manifiesto; test de CI que exija catálogo ⊇ manifiesto | 1 semana |
| 2 | Encender HITL de punta a punta en ≥2 capacidades destructivas | `requiresApproval: true` en dos; un e2e pendiente→aprobado→ejecutado | 1-2 semanas |
| 3 | Hacer que grounding y memoria carguen peso | Pasar los fragmentos a `plan()` y al contexto; leer `history()`; sembrar pgvector | 2 semanas |
| 4 | Consumir `proposedArguments` + limpiar el entorno del spawn | Fusionar sobre los parámetros con revalidación; lista blanca de variables | 3-5 días |
| 5 | Marcar 0081/0082/0086/0088/0089/0092/0094 como `Proposed` | Cambio de estado + nota "implementación: ninguna" | 1 día |

### 5.4 La única cosa

**Arreglo 1.** Es el único que a la vez triplica lo que el agente puede hacer, da a la postura de governance **una sola fuente de verdad**, y convierte el arreglo 2 en un cambio de configuración en vez de un proyecto. Todo lo demás refina el envoltorio; **este mete algo valioso dentro**.

---

# Como producto

## 6. El conjunto

### 6.1 Lo que solo existe por composición

- **Una semántica de evaluación llega a tres superficies sin tres modelos de estado.** Dividendo directo de la reversión ADR-0100→0101 más el envelope. Y está **impuesto**: `api-catalog-parity.spec.ts` arranca el grafo de DI real y exige que el catálogo de la CLI sea igual al registro [MCP](glosario-ai-native-es.md#mcp) vivo.
- **El invariante asesor/vinculante sobrevive a una frontera de repo, lenguaje y equipo.** Core devuelve `binding:false`; Tracker posee la decisión. Mejor aún: CD-11 persiste `rulesetsApplied`, de modo que **un veredicto fabricado por el fallback simulado queda registrado como tal** y sigue siendo distinguible de uno real. Eso es honestidad a nivel de composición.
- **La separación de funciones es estructural a través de la frontera**, y las dos mitades existen y son compatibles campo a campo.
- **Falla cerrado es postura de suite, no cinco costumbres:** la misma elección tomada de forma independiente en cinco sitios.

### 6.2 Lo que falla por composición

| # | Fallo | Evidencia |
|---|---|---|
| **1** | **El camino de escritura es unidireccional y apunta al lado equivocado** | Grep en CLI, MCP y core-domain: **ninguna URL base del Tracker, ningún cliente de ingesta**. Los únicos escritores son endpoints iniciados por el propio Tracker. **Cada `evolith validate`, cada veto de edición, cada llamada MCP y cada ejecución del gate de CI se evapora al salir** |
| **2** | **Dos grafos de evidencia, cada uno sin la mitad del otro** | Core define aristas tipadas y tiene **cero consumidores fuera de su propio test**; Tracker persiste una lista de cadenas con un solo lector. **El modelo tipado vive donde nada persiste; el persistido vive donde nada está tipado** |
| **3** | **Costuras completas y emparejadas que nunca han disparado** | Aprobación: ambas mitades construidas y probadas — y 0 de 16 capacidades la piden |
| **4** | **La identidad se degrada en cada salto** | `engine` falsificado, tres campos vacíos, `actor_id` sin tipo, `waiver` sin envelope |
| **5** | **No existe ninguna firma** | Cero apariciones de cosign/sigstore/in-toto en ambos repos. La integridad es local y **no verificable por un tercero** |

### 6.3 El test de la cadena

La cadena que el producto vende: `decisión → regla → violación → responsable → evidencia → firma → serie temporal`, con las mismas reglas para personas y agentes.

| Eslabón | ¿Existe? | ¿Conectado? | Qué lo rompe |
|---|:-:|:-:|---|
| **decisión ([ADR](glosario-ai-native-es.md#adr-architecture-decision-record))** | ✅ El activo más fuerte | Parcial | 91 de 126 reglas generadas son bloqueantes sin handler |
| **regla → violación** | ✅ Solo en Node | Parcial | Un ruleset escrito (6 reglas); Python/.NET/IaC sin corpus; 15 de 50 herramientas MCP denegadas |
| **violación → responsable** | ✅ Ambos modelos | ❌ **No** | Dos resolutores independientes; **ninguna ejecución persiste una violación con su responsable** |
| **responsable → evidencia** | ✅ El almacén es real | ❌ **Cortado** | **Nada en CLI, MCP, CI ni Core escribe en él** |
| **evidencia → firma** | ❌ No existe | — | Sin atestación; y lo poco que se escribe va con el motor falsificado |
| **firma → serie** | ❌ No existe | ❌ Cortado | `repository_revision` guardado, jamás consultado como serie |
| **mismas reglas, humanos y agentes** | ❌ No | ❌ Cortado | Sin `actor_type`; ledger sin conectar; la puerta [HITL](glosario-ai-native-es.md#hitl-human-in-the-loop) nunca ha ejecutado |

> **La cadena está intacta en dos eslabones y cortada desde `evidencia` en adelante. Hoy el producto sabe *decidir*; no sabe *acumular*.**

### 6.4 Qué mejorar a nivel de suite

| # | Arreglo | Cómo | Esfuerzo | Toca |
|---|---|---|---|---|
| 1 | **Tipar el actor antes de que nada escriba** | `actor{type,id,modelId,sessionId}` en el `meta` del envelope, propagado hasta 4 columnas nuevas | 2 sem | Los cinco |
| 2 | **Abrir el camino de escritura** | Un contrato de ingesta posteado por CLI, MCP y CI al Tracker; poblar el mapper; cliente compartido con auth de clave-máquina como ya hace aprobaciones | 3-4 sem | Core, CLI, MCP, Tracker |
| 3 | **Un solo modelo de aristas tipadas** | Promover el tipo de Core al contrato compartido; tabla `evidence_edges`; endpoint de grafo | 3 sem | Core, Tracker |
| 4 | **Un manifiesto genera todas las superficies** | rego + catálogo CLI + [`outputSchema`](glosario-ai-native-es.md#outputschema--structuredcontent) + catálogo de skills desde una fuente | 3-4 sem | MCP, CLI, Runtime, Core |
| 5 | **Disparar HITL de punta a punta una vez** | Dos capacidades destructivas; un e2e completo | 1 sem tras #4 | Runtime, Tracker |
| 6 | **Firmar y serializar** | Atestación sobre la ingesta; endpoint de serie por revisión | 3 sem | Core, Tracker |

---

## 7. FODA

### 7.1 Fortalezas

*Internas, reales y difíciles de copiar.*

1. **Inmutabilidad de auditoría impuesta por Postgres, no por código.** Un competidor añade una tabla de auditoría en un sprint; **retrofitar "la aplicación no puede reescribir su propia historia" en un esquema ya desplegado es una migración que nadie se ofrece a hacer.**
2. **Fallar cerrado como elección repetida y razonada en cuatro bases de código.** Seis sitios independientes donde el camino fácil era un falso aprobado. **Eso es cultura, y la cultura es lo más lento de copiar.**
3. **Maquinaria que se niega a dejar que el producto se autocertifique.** GT-556/557/558; el test derivado de [HITL](glosario-ai-native-es.md#hitl-human-in-the-loop); el de paridad de catálogo; 12 robots con 108 aserciones contra Kubernetes real, más la prueba de que el bypass no existe en la imagen de producción.
4. **El modelo de identidad que hace que la acumulación sobreviva al cambio de herramientas.** Huella sin `message`, ownership por prefijo, catálogo de cumplimiento como dato versionado.
5. **Dos costuras dibujadas bien bajo presión.** La reversión de altitud de ADR-0101, y el canal HITL con identidades genuinamente opuestas.
6. **Un veto en tiempo de edición que funciona, con payload agnóstico de proveedor.** **Nadie más en esta categoría se sienta en el momento de la escritura del agente.**
7. **Procedencia como artefacto de primera clase**, más control de salida al [LLM](glosario-ai-native-es.md#llm) que falla cerrado antes que truncar un prompt gobernado.

### 7.2 Debilidades

*Internas, con su consecuencia.*

1. **El foso se está escribiendo en blanco y mal atribuido.** Campos vacíos, motor falsificado, y [SARIF](glosario-ai-native-es.md#sarif) y el gate de PR leyendo de ahí.
2. **El ledger de agentes está escrito, probado, sin conectar — y el actor no se puede tipar después.** La tabla es inmutable por trigger.
3. **El corpus es una fachada.** 91 reglas fantasma; cinco adaptadores tras un ruleset.
4. **Las superficies máquina fabrican falsos verdes.** Menú ANSI en [stdout](glosario-ai-native-es.md#stdout--stderr) con salida 0.
5. **El 30% de la superficie [MCP](glosario-ai-native-es.md#mcp) está muerta en producción**, más una fuga de autorización en el descubrimiento.
6. **HITL nunca ha disparado.**
7. **Nada ha acumulado jamás.** Sin despliegue, sin telemetría, sin cliente de referencia.
8. **ADRs Aceptados sin código y documentos que contradicen el esquema.** Siete ADRs con cero apariciones; cinco esquemas documentados que no existen; la guía inglesa en español.
9. **El agente es decorativo donde se le ve.** Cita lo que no consultó; el turno 2 olvida el turno 1.

### 7.3 Oportunidades

*Externas, alcanzables desde donde está el producto.*

| Oportunidad | Horizonte | Por qué es alcanzable |
|---|---|---|
| **Poseer el momento de la escritura** | 0-3 meses | `enforce edit` ya funciona. Sonar escanea en CI, los gateways autorizan llamadas, los portales tienen el catálogo — **ninguno puede rechazar la edición del agente citando un [ADR](glosario-ai-native-es.md#adr-architecture-decision-record)**. Es la única superficie desocupada del mercado |
| **Atribución agente-vs-humano como categoría de uno** | 3-6 meses | Conectar el puerto y cuatro columnas son ~2 semanas sobre código probado. **Ningún portal, gateway ni vendor de métricas puede responderlo, porque ninguno posee un modelo de concesión de aprobación. Evolith ya lo tiene** |
| **Drift por revisión con datos que ya se escriben** | 2-3 meses | `repository_url` y `repository_revision` ya se persisten. Una consulta de serie convierte eso en **exactamente la señal que Sonar comercializa — pero evidenciada por revisión y por ADR, no inferida** |
| **Ser el plano de políticas que un gateway invoca** | 3-9 meses | Convierte la amenaza del gateway en **distribución** en vez de competir en una superficie que no se puede ganar |
| **El comprador de cumplimiento** | 6-12 meses | `dimension` y `determinism` ya son columnas, el catálogo ya es dato versionado, la auditoría ya es inmutable. Es el comprador con presupuesto al que los portales no sirven |

### 7.4 Amenazas

**Ya está pasando:**

| Amenaza | Velocidad |
|---|---|
| **Sonar, disponibilidad general 2-mar-2026** — auto-descubrimiento, gratis, cinco lenguajes, vendido explícitamente contra el drift de la IA. **Gana la evaluación del primer día** ("¿dice algo de *mi* repo sin que yo escriba reglas?") contra 6 reglas escritas y 91 fantasma | Continua, ~5 meses de base instalada ya |
| **Gateways de agentes** comoditizando la autorización por llamada, **en una superficie que el agente no puede declinar** — mientras MCP sí se puede declinar | Ahora |
| **La revisión stateless de MCP** rompe clientes conformes en fecha conocida | 1-2 trimestres |
| **Portales añadiendo agentes** sobre su catálogo — y `ownership.ts` **lee sus ficheros**, lo que enmarca a Evolith como su complemento, no su par | 2-4 trimestres |
| **Saturación de métricas de entrega**: la parte más terminada de la suite es la menos vendible | Ya |

**Plausible, aún no:** un vendor de agentes enviando ganchos de política propios (cerraría la cuña desde arriba, ~12 meses) · un CVE en OPA 0.65 · **una sola lectura de diligencia debida** — siete ADRs vacíos, 91 reglas que no ejecutan y SARIF diciendo "0 reglas evaluadas" se encuentran en una tarde.

### 7.5 Los cuatro cruces

**Fortaleza × Oportunidad — qué presionar.** El veto en tiempo de edición **más** el sello de procedencia. Juntos —cada escritura de agente rechazada o permitida produciendo una fila de evidencia— son una demo que **ni un escáner, ni un gateway, ni un portal pueden montar**. Presiónalo este trimestre, en inglés, gratis.

**Fortaleza × Amenaza — qué te defiende.** Contra Sonar, defender **en evidencia, nunca en detección**: no puede producir una cadena inmutable, ligada a aprobación y atribuida a agente, porque **no posee modelo de aprobación ni plano de estado**. Contra los gateways, ser la política que invocan.

**Debilidad × Oportunidad — qué vas a perder.** Las dos oportunidades de más valor pasan por los mismos tres arreglos: poblar el mapper, conectar el ledger, tipar el actor. **Cinco a siete semanas sobre código ya escrito y en verde.** Hasta entonces el diferenciador se demuestra como una lista de cadenas en jsonb.

**Debilidad × Amenaza — la existencial.**

> **Campos de trazabilidad vacíos más un ledger de agentes sin tipar y sin conectar, contra una ventana de atribución que se cierra.**
>
> El mecanismo es de **orden, no de tamaño**: la estrategia se apoya en evidencia *acumulada*; la acumulación no ha empezado; el esquema que la haría significativa no existe; y la tabla es [append-only](glosario-ai-native-es.md#append-only) **por trigger de base de datos**, así que **nada escrito antes del arreglo se puede corregir jamás**.
>
> Si el despliegue llega antes que el mapper y el ledger, el primer año de historia real de cliente llega estructuralmente incapaz de distinguir un humano de un agente — la única pregunta que Evolith vende. **El riesgo competitivo es sobrevivible; un corpus que hay que descartar no lo es, porque no se puede regenerar.**

---

## 8. Plan: qué hacer y en qué orden

### 8.1 La secuencia

| Orden | Qué | Por qué ahí |
|---|---|---|
| **1º — juntos** | **Tipar el actor** (migración primero) **y abrir el camino de escritura** | El fallo es específico e irrecuperable: en el momento en que se abre la tubería, CLI, [MCP](glosario-ai-native-es.md#mcp) y CI empiezan a verter filas en una tabla inmutable con una columna de actor sin tipo. Cada una de esas filas **falla permanentemente** en responder "¿humano o agente?" |
| **2º — en paralelo desde el día 1** | **El manifiesto único** | Es trabajo de generador, en otra superficie, y desbloquea por separado las 15 herramientas muertas y las 91 reglas fantasma |
| **3º** | **Modo máquina de la CLI + taxonomía de salida** | Es el hueco de integridad; sin él no hay adopción fiable en CI |
| **4º** | **Aristas tipadas** | Necesita las filas del paso 1 para tener qué conectar |
| **5º** | **[HITL](glosario-ai-native-es.md#hitl-human-in-the-loop) de punta a punta** | Se vuelve configuración una vez existe el manifiesto |
| **6º** | **Firmar y serializar** | Solo tiene sentido sobre contenido que ya existe |

### 8.2 El error de secuencia que hay que evitar

> **No pongas el despliegue en producción por delante de tipar el actor.**
>
> Desplegar ahora significa que los primeros meses de historia real de cliente llegan **sin tipar, sin enlazar, sin firmar y sin acumular** — exactamente el resultado que toda la arquitectura se construyó para evitar.

### 8.3 Resumen en tres frases

**Dónde está el producto.** Una suite de governance genuinamente bien arquitecturada —cuatro bases de código con semántica real de fallo cerrado, auditoría inmutable impuesta por base de datos, doce robots de comportamiento que muerden en CI contra Kubernetes real y un veto en tiempo de edición que funciona— envuelta alrededor de un corpus de reglas que en su mayoría no ejecuta nada y un rastro de evidencia que hoy se escribe en blanco, y que nunca ha corrido donde un cliente pueda alcanzarlo.

**La palanca.** Unas cinco semanas de cableado sobre código que **ya existe y pasa sus tests**: poblar `rulesExecuted` y el motor real en el mapper, registrar el puerto de ejecución de agentes y añadir `actor_type`/`agent_id`, y promover `references` a tabla de aristas tipadas — lo que convierte cada ejecución futura **de una fila en blanco en el activo que toda la estrategia da por supuesto**.

**Si no cambia nada en doce meses.** Sonar posee la detección a precio cero en cinco lenguajes, los gateways poseen la autorización por llamada, los portales poseen catálogo-más-agente, y Evolith llega con un envoltorio admirable, 91 reglas que no ejecutan nada, y un grafo de auditoría cuyo primer año **no sabe distinguir un humano de un agente** — defendible solo reconstruyendo una historia que ya no está en condiciones de crear.

---

## 9. Metodología y una corrección

- **Cinco evaluadores en paralelo**, uno por componente, con instrucción de evidenciar cada afirmación con fichero, [ADR](glosario-ai-native-es.md#adr-architecture-decision-record) o cifra, y de ser tan específicos con los aciertos como con los defectos. Luego síntesis de conjunto y FODA sobre sus resultados. 7 agentes, ~692K tokens, 247 llamadas a herramientas.
- **Varios hallazgos se verificaron ejecutando**, no leyendo: el veto de `enforce edit` (`EXIT=2` real), los falsos verdes de los cinco comandos (con stdin cerrado), y las 15 herramientas [MCP](glosario-ai-native-es.md#mcp) denegadas — **cargando el `policy.wasm` compilado que se usa en dispatch y evaluándolo**, no infiriéndolo del código fuente.
- **Una corrección entre evaluadores.** El evaluador del Agent Runtime afirmó que el endpoint `/runtime-approvals` "no existe en el repo del Tracker". **Es falso:** el sintetizador de conjunto verificó ambas mitades y son compatibles campo a campo. Se deja constancia porque ilustra el propio hallazgo — cuando una costura nunca se ha ejecutado de punta a punta, **cada lado duda de que el otro exista**.
- **Dato de mercado verificado directamente:** la disponibilidad general de gestión de arquitectura de Sonar (2 de marzo de 2026), contra el anuncio oficial. El resto del panorama competitivo procede de investigación y **debe revalidarse contra fuente primaria** antes de usarse en una decisión de inversión.

---

*Este documento es un diagnóstico técnico, no una decisión aprobada. Se revisa cuando cambie materialmente el estado del código.*
