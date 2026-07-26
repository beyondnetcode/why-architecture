# Glosario de Arquitectura y SDLC

> **Navegación bilingüe:** [Read in English](glossary-architecture-en.md) · **Documento que lo usa:** [Arquitectura: El Cimiento de la Estimación](why-architecture-es.md) · **Vocabulario de la era AI:** [Glosario AI-native](glosario-ai-native-es.md)
>
> Cada término: **una frase de definición** y **un ejemplo corto**. Agrupados por familia. Cubre el vocabulario de arquitectura, calidad y ciclo de vida que usan los artículos de este repositorio; el vocabulario de IA, agentes y protocolos vive en el [glosario AI-native](glosario-ai-native-es.md).

---

## 1. La tríada de la productividad

### SDD *(Spec-Driven Development)*
Enfoque en el que la especificación ejecutable es el contrato que gobierna el diseño, escrita **antes** del código.
*Ejemplo:* si la spec dice que el módulo de Transporte requiere un `ID_Ruta` tipo UUID, no queda espacio para interpretación.

### AI-DD *(AI-Driven Development)*
Uso de agentes autónomos de IA —no autocompletado— para construir, refactorizar y verificar módulos.
*Ejemplo:* el agente lee la especificación aprobada y genera el código respetando las fronteras que impone.

### Arneses de Producción *(Production Harnesses)*
Infraestructura que envuelve la aplicación para que fallar sea seguro y controlado.
*Ejemplo:* circuit breakers, feature flags, contract testing y shadow traffic actuando en runtime o en el pipeline.

### SSOT *(Single Source of Truth)*
Un único origen autoritativo para cada dato o decisión, del que todo lo demás deriva.
*Ejemplo:* la especificación OpenAPI como única verdad del contrato, no el código ni el wiki.

### BMAD
Metodología open source para estructurar el desarrollo mediante agentes de IA.
*Ejemplo:* define roles de agente y fases para que la IA no improvise el proceso.

### Boilerplate
Código repetitivo y mecánico que se deduce del contrato y no aporta decisiones.
*Ejemplo:* traducir un esquema OpenAPI a DTOs y validadores — el trabajo típico que conviene delegar.

---

## 2. Diseño y fronteras

### DDD *(Domain-Driven Design)*
Diseño que organiza el software alrededor del dominio del negocio y su lenguaje, no de capas técnicas.
*Ejemplo:* el código habla de "Guía de Remisión" porque el negocio la llama así.

### Bounded Context *(contexto delimitado)*
Frontera explícita dentro de la cual un término del dominio tiene un único significado.
*Ejemplo:* "Cliente" en Facturación y "Cliente" en Transporte son entidades distintas, no una compartida.

### Lenguaje Ubicuo
Vocabulario único y compartido entre negocio y código dentro de un contexto.
*Ejemplo:* si el negocio dice "Depósito Temporal", la clase no se llama `TempWarehouse`.

### Arquitectura Hexagonal *(puertos y adaptadores)*
Estilo en el que el dominio queda al centro y todo lo externo entra por puertos con adaptadores intercambiables.
*Ejemplo:* cambiar de PostgreSQL a otro motor toca un adaptador, no la lógica de negocio.

### Clean Architecture
Familia de estilos con la misma idea que hexagonal: las dependencias apuntan hacia el dominio, nunca al revés.
*Ejemplo:* el dominio no importa el ORM; el ORM implementa una interfaz que el dominio define.

### Monolito Modular *(Modular Monolith)*
Un solo despliegue con fronteras internas estrictas entre módulos.
*Ejemplo:* el punto de partida sensato: permite extraer un microservicio después sin reescribir el dominio.

### Microservicios
Servicios desplegables de forma independiente, cada uno dueño de sus datos.
*Ejemplo:* se justifica cuando dos equipos necesitan ritmos de despliegue distintos, no por moda.

### Big Ball of Mud
Sistema sin fronteras discernibles, donde todo depende de todo.
*Ejemplo:* el destino habitual de "ser ágil" entendido como "no definir arquitectura".

### Platform Core
Capacidades base compartidas que todos los módulos consumen en vez de reimplementar.
*Ejemplo:* identidad, eventos y auditoría resueltos una vez para toda la suite.

### C4
Modelo de diagramas en cuatro niveles: contexto, contenedores, componentes y código.
*Ejemplo:* el nivel 1 se le muestra a negocio; el 3 al equipo que va a construir.

### Deuda técnica
Coste futuro acumulado por decisiones que se tomaron para ir rápido.
*Ejemplo:* no es intrínsecamente mala; es peligrosa cuando nadie la registra ni la paga.

### SOLID
Cinco principios de diseño orientado a objetos para código que se pueda cambiar sin romperlo.
*Ejemplo:* el más rentable en la práctica es el de responsabilidad única.

---

## 3. Contratos e integración

### API-First
Diseñar y acordar el contrato de la API antes de implementar cualquiera de sus dos lados.
*Ejemplo:* frontend y backend arrancan en paralelo el mismo día, contra el mismo contrato.

### OpenAPI
Estándar para describir APIs REST de forma legible por máquina.
*Ejemplo:* de un fichero OpenAPI salen los clientes, los mocks y los tests.

### AsyncAPI
El equivalente de OpenAPI para APIs asíncronas y dirigidas por eventos.
*Ejemplo:* documenta qué eventos publica cada dominio y con qué forma.

### Contract Testing
Pruebas que verifican que consumidor y proveedor siguen respetando el contrato acordado.
*Ejemplo:* Pact hace fallar el pipeline del proveedor si rompe a un consumidor real, antes de producción.

### Consumer-Driven Contracts
Variante donde el consumidor declara qué necesita y el proveedor se compromete a cumplirlo.
*Ejemplo:* evita que el proveedor mantenga campos que ya nadie usa.

### Versionado de APIs
Estrategia para evolucionar un contrato sin romper a quien ya lo consume.
*Ejemplo:* `/api/v2` conviviendo con `/api/v1` mientras los consumidores migran a su ritmo.

### Anti-Corruption Layer *(ACL)*
Capa de traducción que impide que el modelo de un sistema externo contamine el propio.
*Ejemplo:* los identificadores y estados de un ERP legado se mapean antes de entrar al dominio.

---

## 4. Datos y consistencia

### ACID
Cuatro garantías de una transacción: atomicidad, consistencia, aislamiento y durabilidad.
*Ejemplo:* o se descuenta el stock y se emite la factura, o no ocurre ninguna de las dos.

### Consistencia eventual
Modelo en el que las réplicas convergen con el tiempo, no de forma inmediata.
*Ejemplo:* aceptable en un reporte; inaceptable en el saldo de una cuenta.

### Idempotencia
Propiedad por la que repetir una operación produce el mismo resultado que ejecutarla una vez.
*Ejemplo:* si el cliente reintenta un pago por timeout, no se cobra dos veces.

### Saga
Patrón para coordinar una transacción distribuida como una secuencia de pasos con compensaciones.
*Ejemplo:* si falla el paso de facturación, se ejecuta la compensación que libera el stock reservado.

### Transactional Outbox
Patrón que escribe el evento en la misma transacción que el dato, y lo publica después.
*Ejemplo:* elimina el caso de "guardé el pedido pero el evento se perdió".

### CQRS
Separar el modelo de escritura del modelo de lectura.
*Ejemplo:* útil cuando las consultas y los comandos tienen cargas y formas muy distintas; innecesario si no.

### Event Sourcing
Guardar la secuencia de eventos como verdad, y derivar el estado a partir de ella.
*Ejemplo:* permite reconstruir el saldo de cualquier momento pasado, no solo el actual.

### MDM *(Master Data Management)*
Gobierno de los datos maestros compartidos para que signifiquen lo mismo en todos los módulos.
*Ejemplo:* un único catálogo de productos, en vez de cinco versiones desincronizadas.

### DB-per-module *(esquema por contexto)*
Cada módulo es dueño de sus datos y nadie los lee por debajo.
*Ejemplo:* prohibir los joins entre esquemas es lo que hace posible extraer un servicio después.

### DLQ *(Dead Letter Queue)*
Cola donde acaban los mensajes que no se pudieron procesar, para inspección y reproceso.
*Ejemplo:* evita que un mensaje envenenado bloquee la cola principal indefinidamente.

---

## 5. Resiliencia y operación

### Circuit Breaker
Mecanismo que corta las llamadas a un dependiente que está fallando, y las reintenta más tarde.
*Ejemplo:* si el servicio de aduanas se cae, se deja de insistir y el sistema principal sigue operando.

### Degradación controlada
Diseñar de antemano qué funcionalidad se sacrifica cuando algo falla.
*Ejemplo:* si el cálculo de rutas no responde, se acepta el pedido y se planifica después.

### Feature Flag *(feature toggle)*
Interruptor que habilita o deshabilita funcionalidad sin desplegar código.
*Ejemplo:* activar una función para el 5% de usuarios y revertir en segundos si algo va mal.

### Canary Release
Desplegar a una fracción pequeña del tráfico antes de ir al 100%.
*Ejemplo:* si los errores suben en ese 5%, se detiene la propagación.

### Shadow Traffic
Enviar una copia del tráfico real a la versión nueva sin que sus respuestas cuenten.
*Ejemplo:* mide comportamiento con carga de producción y riesgo cero.

### Zero-Downtime
Despliegues y migraciones sin ventana de indisponibilidad.
*Ejemplo:* exige compatibilidad hacia atrás en el esquema durante la transición.

### Chaos Engineering
Inyectar fallos deliberadamente para comprobar que las defensas funcionan.
*Ejemplo:* apagar una réplica en horario laboral, a propósito, y verificar que nadie lo nota.

### Auto-healing
Capacidad del sistema de detectar y reemplazar componentes enfermos sin intervención.
*Ejemplo:* el orquestador reinicia el contenedor que dejó de responder al health check.

### SLA / SLO / SLI
El compromiso contractual, el objetivo interno y la métrica que lo mide.
*Ejemplo:* SLI = latencia p95; SLO = por debajo de 200 ms; SLA = lo que se promete al cliente por contrato.

### p95 / percentil
El valor por debajo del cual cae ese porcentaje de las observaciones.
*Ejemplo:* la media miente; el p95 dice qué experimenta el usuario que lo pasa mal.

### Observabilidad
Capacidad de responder preguntas nuevas sobre el sistema a partir de lo que emite.
*Ejemplo:* no es "tener logs": es poder averiguar por qué ese pedido concreto tardó 8 segundos.

### Trazabilidad E2E
Seguir una petición a través de todos los servicios que atraviesa.
*Ejemplo:* reduce el diagnóstico de un error de días a minutos.

### AIOps
Uso de analítica y IA sobre telemetría para detectar y correlacionar incidentes.
*Ejemplo:* alertar por síntoma agregado en vez de por umbral individual de cada métrica.

---

## 6. Seguridad y gobierno

### Zero Trust
No confiar en nada por su posición en la red: verificar cada petición.
*Ejemplo:* estar dentro del perímetro no da acceso a nada por sí solo.

### RBAC / ABAC
Autorización por rol asignado, frente a autorización por atributos de la petición y su contexto.
*Ejemplo:* RBAC: "los auditores pueden leer". ABAC: "puede leer si es auditor **y** el dato es de su país".

### OAuth2 / OIDC
Estándar de delegación de autorización, y la capa de identidad construida sobre él.
*Ejemplo:* OAuth2 concede acceso a un recurso; OIDC dice **quién** es el usuario.

### Defensa en profundidad
Superponer controles independientes para que ninguno sea el único punto de fallo.
*Ejemplo:* validar en el gateway, en el servicio y en la base de datos.

### OWASP ASVS
Estándar de verificación de seguridad en aplicaciones, con niveles de exigencia.
*Ejemplo:* sirve como lista de requisitos comprobables, no como recomendación vaga.

### ADR *(Architecture Decision Record)*
Registro breve de una decisión arquitectónica: contexto, alternativas, decisión y consecuencias.
*Ejemplo:* evita rediscutir cada seis meses por qué se eligió aquello.

### Quality Gate
Punto del pipeline que bloquea el avance si no se cumplen criterios objetivos.
*Ejemplo:* cobertura mínima, cero vulnerabilidades críticas, sin violaciones de arquitectura.

### Fitness Function
Prueba automatizada que verifica de forma continua una propiedad arquitectónica.
*Ejemplo:* un test que falla si un módulo importa el dominio de otro contexto.

### IDP *(Internal Developer Platform)*
Plataforma interna que ofrece a los equipos autoservicio gobernado sobre la infraestructura.
*Ejemplo:* Backstage como catálogo y portal de plantillas aprobadas.

### NFR *(requisito no funcional)*
Requisito sobre cómo debe comportarse el sistema, no sobre qué hace.
*Ejemplo:* "soportar 500 pedidos por minuto con p95 bajo 200 ms" — medible, no una aspiración.

---

## 7. Ciclo de vida y entrega

### SDLC
El ciclo completo de vida del software, de la idea a producción y su operación.
*Ejemplo:* descubrimiento → diseño → construcción → QA → release.

### MVP
La versión mínima que permite validar la hipótesis con usuarios reales.
*Ejemplo:* mínimo en alcance, no en calidad de las decisiones estructurales que serán caras de revertir.

### WBS *(Work Breakdown Structure)*
Desglose del trabajo en piezas estimables.
*Ejemplo:* es la **consecuencia** de tener los diseños, no el punto de partida.

### IaC *(Infrastructure as Code)*
Definir la infraestructura en ficheros versionados y aplicarlos de forma reproducible.
*Ejemplo:* elimina el "en mi máquina sí funciona" y el servidor que nadie sabe recrear.

### CI/CD
Integración continua y entrega o despliegue continuo.
*Ejemplo:* cada commit se construye y verifica; cada cambio aprobado puede llegar a producción sin ceremonia.

### Pirámide de testing
Muchos tests unitarios, menos de integración, pocos end-to-end.
*Ejemplo:* invertirla produce suites lentas y frágiles en las que nadie confía.

### Mutation Testing
Introducir fallos deliberados en el código para comprobar si los tests los detectan.
*Ejemplo:* mide la calidad de los tests, no la del código — la cobertura no lo hace.

### TDD
Escribir la prueba antes del código que la satisface.
*Ejemplo:* su valor real es el diseño que induce, más que la cobertura que produce.

### Modelo de madurez *(niveles 1-4)*
Escala que declara el rigor de ingeniería exigido en cada eje de calidad.
*Ejemplo:* nivel 1 sale rápido y acumula deuda; nivel 4 exige patrones avanzados y automatización total.

### Estimación basada en entregables
Estimar a partir de los activos arquitectónicos necesarios, no de una lista de funcionalidades.
*Ejemplo:* la tesis central de este repositorio: sin los 15 entregables, la estimación es una apuesta.

---

## 8. Escalabilidad y despliegue

### Escalado vertical / horizontal
Dar más recursos a una instancia, frente a añadir más instancias.
*Ejemplo:* el vertical topa con un límite físico; el horizontal exige que el servicio no guarde estado.

### Serverless
Modelo donde el proveedor gestiona la ejecución y se paga por uso, escalando hasta cero.
*Ejemplo:* encaja en cargas intermitentes; penaliza en las de latencia sostenida y baja.

### Kubernetes
Orquestador de contenedores que gestiona despliegue, escalado y recuperación.
*Ejemplo:* resuelve mucho y cuesta operarlo; no es el punto de partida de un producto nuevo.

### EDA *(Event-Driven Architecture)*
Arquitectura donde los componentes se comunican publicando y reaccionando a eventos.
*Ejemplo:* es la vía al desacoplamiento real, y a cambio la depuración se vuelve más difícil.

### API Gateway
Punto de entrada único que enruta, autentica y limita el tráfico hacia los servicios.
*Ejemplo:* concentra las políticas transversales en vez de repetirlas en cada servicio.

### Cloud-agnóstico
Diseñar para poder cambiar de proveedor sin reescribir la lógica de negocio.
*Ejemplo:* tiene coste real; se justifica por riesgo de proveedor o mandato regulatorio, no por principio.

---

*Si echas en falta un término de arquitectura o de ciclo de vida, añádelo aquí. Si es de IA, agentes o protocolos, va en el [Glosario AI-native](glosario-ai-native-es.md).*
