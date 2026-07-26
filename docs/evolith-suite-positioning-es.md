# Evolith como producto único — qué resuelve, contra qué compite

> **Navegación bilingüe:** [Read in English](evolith-suite-positioning-en.md) · **¿Un término que no conoces?** [Glosario AI-native](glosario-ai-native-es.md)
>
> **Documento hermano:** el [Career Path](evolith-ai-career-path-es.md) responde *qué hay que aprender*. Este responde *qué se está construyendo y contra qué compite*.
>
> **Base:** inspección directa del código de `evolith` y `evolith_tracker`, más investigación de mercado sobre ocho categorías. Fecha: 2026-07-26.

---

## Índice

**Parte I — El producto**
1. [Resumen para quien decide](#1-resumen-para-quien-decide)
2. [Qué es Evolith como un solo producto](#2-qué-es-evolith-como-un-solo-producto)
3. [Los componentes y la unidad](#3-los-componentes-y-la-unidad)

**Parte II — El mercado**
4. [Contra qué compite de verdad](#4-contra-qué-compite-de-verdad)
5. [Comparativa a nivel de producto completo](#5-comparativa-a-nivel-de-producto-completo)
6. [El panorama por categorías](#6-el-panorama-por-categorías)

**Parte III — La decisión**
7. [Qué tiene que ser verdad para vender el todo](#7-qué-tiene-que-ser-verdad-para-vender-el-todo)
8. [Quién compra esto](#8-quién-compra-esto)
9. [Posicionamiento](#9-posicionamiento)
10. [Relación con el Career Path](#10-relación-con-el-career-path)
11. [Metodología y verificación](#11-metodología-y-verificación)

---

# Parte I — El producto

## 1. Resumen para quien decide

*Sin tecnicismos. Si solo lees una sección, lee esta.*

**Evolith se contrata para una cosa:** garantizar que lo que se construye coincide con lo que se decidió — y poder demostrarlo — ahora que buena parte del código lo escriben máquinas.

Cuatro conclusiones del análisis:

**1 · No sustituye a nada. Vende autoridad.** Evolith no reemplaza Jira, ni GitHub, ni las herramientas de análisis de código. Se sitúa encima y les quita **una sola cosa**: la potestad de declarar que una etapa está aprobada. Es una venta más difícil de hacer y mucho más difícil de desalojar.

**2 · Su competidor real no es un producto: es "ya me lo monto yo".** Las piezas sueltas —catálogos, verificadores de reglas, motores de políticas, bloqueo en el repositorio— son software libre maduro y gratuito. Un buen equipo de plataforma las ensambla. Lo que **nunca ensambla** es la parte aburrida: el registro de quién hizo qué, firmado y acumulado en el tiempo.

**3 · Ninguno de sus cinco componentes es defendible por separado.** Eso no es un defecto de diseño: es lo normal en una suite. Lo defendible es la cadena completa que forman.

**4 · Hoy el todo no le gana a las partes.** No por diseño, sino por estado: nada ha corrido en producción, la tasa de error nunca se ha medido y no existe ni un expediente de auditoría real. Son tres preguntas que cualquier comprador hace en la primera reunión, y hoy las tres tienen la misma respuesta.

> **La consecuencia práctica:** lo que separa a Evolith de ser vendible no es funcionalidad. Es despliegue, medición y acumulación. Nada de eso es investigación.

---

## 2. Qué es Evolith como un solo producto

### 2.1 El trabajo para el que se contrata

> **Garantizar que lo que se construye coincide con lo que se decidió — y poder demostrarlo — ahora que buena parte del código lo escriben máquinas.**

Las dos mitades importan por separado. *Garantizar* es control. *Poder demostrarlo* es evidencia. El mercado ofrece la primera; casi nadie ofrece la segunda.

### 2.2 Lo que no sustituye

Un producto se define por lo que el comprador **deja de hacer** al comprarlo. Aquí la respuesta es incómoda: **Evolith no sustituye a nada.**

| Sigue existiendo | Evolith le quita |
|---|---|
| Jira / Azure DevOps | Nada. Sigue organizando el trabajo |
| GitHub / GitLab | Nada. Sigue albergando el código y ejecutando el CI |
| Sonar y análogos | Nada. Siguen analizando calidad y estructura |
| El agente de IA que escribe código | Nada. Sigue escribiendo |

Lo único que Evolith se lleva es **la potestad de declarar que una etapa está aprobada**.

### 2.3 Por qué eso cambia la conversación de venta

La pregunta del comprador deja de ser *"¿qué herramienta elijo?"* y pasa a ser:

> **"¿Quién tiene la última palabra sobre si esto pasa a producción?"**

Eso es una **venta de autoridad**, no de funcionalidad. Tiene dos consecuencias opuestas:

- **Es más difícil de entrar.** Nadie cede autoridad por una demo bonita. Hace falta una crisis, una auditoría o un mandato.
- **Es mucho más difícil de sacar.** Una herramienta se sustituye en un trimestre. Una autoridad con dos años de expediente acumulado, no.

---

## 3. Los componentes y la unidad

### 3.1 Qué resuelve cada componente

| Componente | A quién | Qué le resuelve |
|---|---|---|
| **Core** | Al arquitecto | "Mis decisiones no se cumplen" → convierte decisiones en reglas ejecutables y emite un veredicto reproducible |
| **Tracker** | A cumplimiento y dirección | "No puedo demostrar qué pasó" → posee el registro, la evidencia y la firma |
| **CLI** | Al desarrollador y al pipeline | "Necesito esto donde trabajo" → interfaz universal; el código de salida gobierna en cualquier entorno |
| **[MCP](glosario-ai-native-es.md#mcp)** | Al agente de IA | "¿Qué me está permitido aquí?" → el contrato antes de generar |
| **Agent Runtime** | Al equipo que opera agentes | "¿Quién supervisa al robot?" → política previa, aprobación humana y procedencia |

### 3.2 Por qué ninguno es defendible en solitario

| Componente | Sustituto commodity |
|---|---|
| Core | [ArchUnit](glosario-ai-native-es.md#archunit--deptrac--dependency-cruiser--import-linter), Deptrac, Sonar, OPA |
| Tracker | Jira más un plugin de auditoría; plataformas de métricas de entrega |
| CLI | Cualquier verificador con integración en CI |
| [MCP](glosario-ai-native-es.md#mcp) | El MCP de solo lectura de cualquier catálogo |
| Agent Runtime | Cualquier framework de agentes |

**Esto no es un diagnóstico pesimista.** Es la definición de una suite: sus piezas son commodity y su valor está en la composición. El error sería intentar ganar pieza a pieza.

### 3.3 La cadena: lo único no-commodity

```
  decisión → regla → violación → responsable → evidencia → firma → serie temporal
                                       ▲
                        las mismas reglas para personas y agentes
```

Nadie más tiene la cadena entera:

- Los de **análisis de código** ven el código, pero no la autoridad ni la decisión que lo originó.
- Los **portales de desarrollador** ven el catálogo, pero no bloquean.
- Los de **métricas de entrega** ven el flujo, pero no la conformidad.
- Los **gateways de agentes** bloquean llamadas, pero no saben qué decisión de arquitectura se estaba violando.

### 3.4 La regla de decisión

> **Los componentes son la superficie comercial. La unidad es el foso.**
>
> Potencia un componente solo cuando ese trabajo **añade un eslabón a la cadena**. Si no añade eslabón, es trabajo commodity — y lo hará mejor y más barato otro.

Aplicada a decisiones concretas:

| Trabajo | ¿Añade eslabón? | Veredicto |
|---|---|---|
| Códigos de salida en la CLI | Sí — convierte consejo en control en todos los entornos a la vez | **Hacer** |
| Tipado de actor en Tracker | Sí — es el eslabón de procedencia, y caduca | **Hacer ya** |
| Tasa de error publicada por regla | Sí — es lo que hace creíble el veredicto | **Hacer** |
| Herramienta MCP número 51 | No, salvo que cierre un eslabón | **Justificar o no hacer** |
| Grafo de conocimiento semántico | No — resuelve un problema que no se tiene | **No hacer** |

---

# Parte II — El mercado

## 4. Contra qué compite de verdad

Como producto completo, Evolith no compite contra Sonar ni contra Port. Compite contra **tres alternativas enteras**.

### 4.1 Las tres alternativas

| | Qué es | Por qué gana hoy | Su punto débil |
|---|---|---|---|
| **A · No hacer nada** | Wiki, decisiones en la cabeza de tres personas, revisión manual | Cuesta cero y el dolor es invisible | El coste llega de golpe: una auditoría, un incidente, o el día en que los agentes multiplican el desorden |
| **B · Ensamblarlo uno mismo** | Catálogo + verificadores de reglas + motor de políticas + bloqueo en el repositorio + gestor de trabajo + panel propio | **Es el competidor real.** Todas las piezas son libres y maduras | Consume dos o tres personas de plataforma de forma permanente, y **nadie ensambla la parte de evidencia** |
| **C · Esperar a un grande** | Los adyacentes expandiéndose hacia este terreno | Tienen canal, capital y presencia instalada | Ninguno tiene autoridad de aprobación ni cadena de evidencia; tendrían que construirlas |

### 4.2 El competidor real es la opción B

Contra "ya me lo monto yo" **no se gana por funcionalidad**. Las piezas libres son buenas y son gratis.

Se gana por lo que ningún equipo interno construye nunca, porque no es interesante y no luce: **el registro atribuible, la firma y la serie temporal.** Un equipo de plataforma ensambla detección en un trimestre. No ensambla un expediente que aguante una auditoría dos años después.

### 4.3 El reloj

Los adyacentes ya se mueven hacia aquí:

- **Desde el análisis de código hacia arriba.** En marzo de 2026 Sonar puso en general disponibilidad la gestión de arquitectura: descubrimiento automático sin configuración, arquitectura intencional, violaciones en la puerta de calidad, cinco lenguajes — y vendido explícitamente contra el desorden que introduce la IA. *(Verificado contra el anuncio oficial.)*
- **Desde el catálogo hacia la gobernanza.** Los portales de desarrollador están añadiendo agentes sobre su grafo.
- **Desde el CI hacia lo agéntico.** Las plataformas de repositorio empiezan a ofrecer flujos con agentes y salidas validadas dentro del propio pipeline.

**La mitad detectora del producto ya es gratuita.** Lo que queda por defender es la otra mitad.

---

## 5. Comparativa a nivel de producto completo

| | **Ensamblarlo uno mismo** | **Un adyacente expandiéndose** | **Evolith** |
|---|---|---|---|
| **Tiempo hasta valor** | Meses, y nunca termina | Inmediato en su trozo | Días en detección, meses en evidencia |
| **Quién lo mantiene** | Dos o tres personas, permanentemente | El proveedor | El proveedor |
| **Cubre agentes de IA** | No, salvo que lo construyas | Solo lectura | Es su razón de ser |
| **Deja rastro auditable** | Casi nunca | No | **Es el producto** |
| **Trazabilidad decisión → código → responsable** | No | No | **Sí** |
| **Distingue autoría humana de agéntica** | No | No | **Sí (en diseño)** |
| **Neutralidad entre proveedores** | Total | Nula | Alta, por diseño |
| **Coste de sustitución una vez dentro** | N/A | Bajo | Alto y creciente con el expediente |
| **Madurez demostrada** | La de cada pieza | Alta | **Ninguna todavía** |

La última fila es la que decide hoy, y es la única en rojo.

---

## 6. El panorama por categorías

*Referencia para conversaciones técnicas. La comparativa que decide una compra es la de §5.*

| Categoría | Postura de Evolith |
|---|---|
| **Análisis de arquitectura** | No se puede ganar en detección: ya es gratis y automática. Se gana en el **[mapping](glosario-ai-native-es.md#mapping-correspondencia) gobernado** — descubrir estructura no requiere autoridad de aprobación ni de excepción; Evolith tiene ambas |
| **Portales de desarrollador** | Exponen su catálogo a agentes en modo lectura. Evolith reclama control — pero su superficie actual es la que el agente puede declinar |
| **[Policy-as-code](glosario-ai-native-es.md#policy-as-code)** | No es competencia: es el motor de Evolith. Gobierna infraestructura, no arquitectura de aplicación |
| **Métricas de entrega** | Categoría saturada y comoditizándose. **Integrar, nunca competir** |
| **Gateways de agentes** | Se van a quedar con la autorización por llamada. La jugada es **ser el plano de políticas al que ellos consultan**, no un servidor más en una lista |
| **CI agéntico** | El competidor más cercano al control dentro del pipeline |
| **Gestión del trabajo** | Alto solape en el relato amplio. **No pelear ahí** |
| **Observabilidad de IA** | Consumir como proveedor de evidencia tras un puerto. No reimplementar |

### El carril que nadie ocupa

Evidencia **atribuible, calibrada y temporal** de cómo evoluciona una arquitectura bajo autoría mixta de personas y agentes.

Ningún competidor puede afirmar hoy: *"esta violación la introdujo este agente, con este modelo, persistió N revisiones, bajo estas reglas vigentes entonces — y nuestra tasa de [falso bloqueo](glosario-ai-native-es.md#falso-positivo--falso-bloqueo) es esta."*

---

# Parte III — La decisión

## 7. Qué tiene que ser verdad para vender el todo

Un comprador que evalúe Evolith como producto completo hace tres preguntas en la primera reunión. Hoy las tres tienen la misma respuesta:

| La pregunta | Respuesta hoy | Qué la arregla |
|---|---|---|
| "¿Quién lo usa en producción?" | Nadie | Desplegar |
| "¿Qué tasa de error tienen vuestros bloqueos?" | No medida | Medir las reglas que ya existen |
| "Enséñame el expediente de un cliente" | No existe | Tipar el actor y acumular |

**Ninguna se arregla con más funcionalidad.** Y las tres son las mismas cuatro acciones que el [Career Path](evolith-ai-career-path-es.md) marca como prioritarias — lo que confirma que no son deuda técnica, sino **requisitos de venta**.

> Una de las tres **caduca**: la autoría de un cambio solo se puede registrar en el momento en que ocurre. Cada día de operación sin registrarla es expediente perdido para siempre.

---

## 8. Quién compra esto

| Comprador | Su dolor | Urgencia hoy | Presupuesto |
|---|---|---|---|
| **CTO / VP de Ingeniería** | "Estamos escalando agentes que escriben código y no sé qué le están haciendo a nuestra arquitectura" | **Alta y sin respuesta empaquetada** | Sí |
| **Responsable de Arquitectura** | "Mis decisiones no se cumplen" | Crónica, tolerada durante años | Escaso |
| **CISO / Cumplimiento** | "Tengo que demostrar conformidad" | Media — los plazos regulatorios se movieron a 2027 | Sí, y alto |

**La entrada natural en 2026 es el primero.** Es un dolor agudo, reciente, sin producto que lo resuelva, y quien lo sufre tiene presupuesto. El tercero es la expansión: mismo expediente, otra factura, ticket mayor.

El segundo es el usuario, no el comprador. Conviene no confundirlos.

---

## 9. Posicionamiento

### 9.1 La frase

> **Evolith es el expediente de tu arquitectura: qué se decidió, qué se construyó, quién lo hizo —persona o agente— y bajo qué reglas vigentes en ese momento. Con firma, y con una tasa de error publicada.**

### 9.2 Por qué funciona

- **No promete detectar mejor que nadie.** Esa promesa ya es gratuita y no se puede ganar.
- **Promete acumular algo que nadie más acumula.** Y lo acumulado no se copia: solo se empieza antes.
- **Habla el idioma del comprador de 2026**, no el de un catálogo de funcionalidades.

### 9.3 La advertencia

**Esa frase describe un producto que todavía no existe.** Es el objetivo, no el estado.

Usarla hoy en una demo expone directamente a la pregunta *"enséñamelo"*, y la respuesta sería la de §7. Sirve para **alinear el roadmap**, no para vender esta semana.

### 9.4 Qué se puede vender hoy

Honestamente, la mitad detectora — que es la comoditizada. La conclusión no es rebajar el mensaje, sino **acortar el plazo hasta poder sostenerlo**: desplegar, medir y empezar a acumular.

---

## 10. Relación con el Career Path

Los dos documentos dicen lo mismo desde lados opuestos de la mesa.

| | [Career Path](evolith-ai-career-path-es.md) | Este documento |
|---|---|---|
| **Responde** | Qué hay que aprender y en qué orden | Qué se construye y contra qué compite |
| **Lector** | Quien va a diseñar la siguiente generación | Quien decide en qué invertir |
| **Conclusión** | Instrumentar → medir → después generar | Desplegar → medir → acumular |

Que dos análisis independientes —uno de aprendizaje, otro de mercado— converjan en las mismas cuatro acciones es el hallazgo más sólido de ambos.

---

## 11. Metodología y verificación

- **Base de producto:** inspección directa del código de `evolith` y `evolith_tracker`, bajo la regla de que donde documentación y código discrepen, gana el código.
- **Verificación directa:** el movimiento de Sonar (disponibilidad general de gestión de arquitectura, 2 de marzo de 2026) se comprobó contra el anuncio oficial, por ser el dato que más condiciona la recomendación.
- **Caveat:** el resto del panorama competitivo procede de investigación multiagente. **Revalídalo contra fuente primaria antes de usarlo en una decisión de inversión.**
- **Naturaleza del documento:** es un análisis de posicionamiento, no una decisión aprobada. Cualquier conclusión que se convierta en compromiso arquitectónico necesita su propio registro de decisión.

---

*Este documento se revisa cuando cambie materialmente la capacidad de Evolith o el movimiento de cualquier plataforma evaluada.*
