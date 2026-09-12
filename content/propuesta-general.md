---
title: "Propuesta General"
order: 1
---

# **Changuito — Propuesta General** {#changuito-—-propuesta-general}

**Trabajo Práctico Integrador — Programación en Ambiente Web** **Primera entrega — 31/08**

**Integrantes:** Rodriguez Juan Cruz, Ponti Mateo Daniel, Ortiz María Agustina

**Repositorios:**

* [TPI \- Frontend](https://github.com/PAW-2026-DP/PAW-2026-Changuito-fn)
* [TPI \- Backoffice \- Frontend](https://github.com/PAW-2026-DP/PAW-2026-Changuito-Backoffice-fn)
* [TPI \- Riders \- Frontend](https://github.com/PAW-2026-DP/PAW-2026-Changuito-Riders-fn)
* [TPI  \- Backend](https://github.com/jbrodi99/PAW-2026-TPI-bn)

**Tag de esta entrega:** v1.0.0

---

[Changuito — Propuesta General	1](#changuito-—-propuesta-general)

[1\. Descripción de la aplicación	3](#1.-descripción-de-la-aplicación)

[El problema	3](#el-problema)

[La solución propuesta	3](#la-solución-propuesta)

[2\. Actores del sistema	4](#2.-actores-del-sistema)

[3\. Integración de comercios	4](#3.-integración-de-comercios)

[4\. El motor de optimización	5](#4.-el-motor-de-optimización)

[5\. Modelo de negocio	6](#5.-modelo-de-negocio)

[6\. Alcance funcional	7](#6.-alcance-funcional)

[Módulos incluidos	7](#módulos-incluidos)

[Ciclo de vida del pedido	8](#ciclo-de-vida-del-pedido)

[Fuera de alcance	8](#fuera-de-alcance)

[7\. Beneficios e incentivos por actor	9](#7.-beneficios-e-incentivos-por-actor)

[8\. Scope del trabajo práctico	10](#8.-scope-del-trabajo-práctico)

[9\. Riesgos	11](#9.-riesgos)

[9.1 Riesgos técnicos	11](#91-riesgos-técnicos)

[9.2 Riesgos de negocio	11](#92-riesgos-de-negocio)

[10\. Sitemap	12](#10.-sitemap)

[11\. Stack tecnológico	12](#11.-stack-tecnológico)

[Justificación	13](#justificación)

[12\. Presupuesto y planificación	13](#12.-presupuesto-y-planificación)

## 

## 1\. Descripción de la aplicación {#1.-descripción-de-la-aplicación}

Changuito es una aplicación web que permite armar una lista de compras de supermercado, calcular automáticamente dónde conviene comprarla y realizar el pedido con envío a domicilio, incluso cuando la compra se reparte entre varios comercios distintos.

### El problema {#el-problema}

Los precios de un mismo producto varían de forma significativa entre cadenas de supermercados, y esa variación no es uniforme: una cadena puede ser más barata en lácteos y más cara en limpieza. El consumidor que quiere aprovechar esas diferencias tiene dos opciones, ambas malas: comparar producto por producto de forma manual en distintos sitios, o recorrer físicamente más de un comercio. En la práctica, la mayoría termina comprando todo en un solo lugar y resignando el ahorro.

El problema se agrava porque comprar en más de un comercio implica un costo de envío adicional por cada punto de origen, y no siempre es evidente si ese costo adicional se justifica frente al ahorro obtenido.

### La solución propuesta {#la-solución-propuesta}

Changuito centraliza el catálogo y los precios de múltiples supermercados, y ante una lista de compras resuelve tres cosas:

1. **Calcula** el costo total de esa lista en cada supermercado disponible.
2. **Evalúa** si dividir la compra entre distintos comercios genera un ahorro neto, considerando el costo logístico adicional.
3. **Ejecuta** la compra: genera el pedido, lo comunica a los comercios involucrados y coordina uno o más repartidores que retiran en cada punto de origen y entregan en el domicilio del cliente.

El sistema no impone una única forma de comprar: le da al usuario una recomendación accionable, pero es el usuario quien decide con qué comercios se queda y compra desde la misma pantalla.

---

## 2\. Actores del sistema {#2.-actores-del-sistema}

| Actor | Qué hace |
| :---- | :---- |
| **Cliente** | Busca productos, arma su lista, ejecuta el optimizador, confirma el pedido y sigue su estado. |
| **Supermercado** | Administra su catálogo, precios y stock. Recibe pedidos, los prepara y los marca listos para retiro. |
| **Repartidor** | Consulta sus tareas asignadas, registra el retiro en cada comercio y confirma la entrega. |
| **Administrador** | Gestiona usuarios, alta de comercios, sucursales y zonas de cobertura. |

---

## 3\. Integración de comercios {#3.-integración-de-comercios}

Los precios no se obtienen mediante scraping de sitios externos. Cada supermercado es un **rol dentro del sistema**, con un panel propio donde carga y mantiene su catálogo, sus precios y su stock.

No todos los supermercados que se asocian a la plataforma tienen la misma capacidad operativa o técnica. Por eso, en lugar de imponer un único mecanismo de carga, el sistema ofrece **tres modalidades de integración**, pensadas para que sumarse a la plataforma sea igual de accesible para un comercio sin equipo técnico propio que para uno con desarrollo propio. El supermercado elige (o se le asigna, según una evaluación inicial) la modalidad que mejor se adapte a sus recursos, y puede migrar de una a otra con el tiempo.

**Modalidad 1 — Carga por planilla estándar**

A quién está dirigida: supermercados pequeños o sin personal de sistemas propio, que llevan sus productos en una planilla de cálculo o en un sistema de gestión básico del cual pueden exportar datos.

Cómo funciona: la plataforma entrega al supermercado un formato de planilla predefinido, con las columnas que necesita el sistema. El supermercado completa esa planilla con su catálogo y la sube a través de su panel.

Reglas de negocio:

* El supermercado es responsable de que la información cargada (precios, stock, descripciones) sea correcta y esté vigente. La plataforma no valida veracidad, solo formato.
* Toda carga reemplaza o actualiza el catálogo existente; no hay versión "borrador" en esta modalidad, la actualización es de todo o nada por archivo subido.
* Se debe definir una frecuencia mínima de actualización esperada (por ejemplo, al menos una vez por semana), ya que precios desactualizados afectan directamente al motor de comparación y optimización de compra, y podrían perjudicar al cliente final.
* Si la planilla no respeta el formato exigido, la carga se rechaza en su totalidad y se le informa al supermercado qué corregir. No se aceptan cargas parciales con errores.
* Es responsabilidad del supermercado dar de baja del archivo aquellos productos que ya no comercializa; el sistema no elimina productos por su cuenta.

Restricciones: no apta para catálogos muy extensos o con alta rotación de precios, ya que depende de la carga manual de una persona; no permite automatización ni integración con sistemas internos del supermercado.

**Modalidad 2 — Carga con adaptación de formato propio (mapeo)**

A quién está dirigida: supermercados que ya cuentan con un sistema de gestión de stock o un ERP propio del cual pueden exportar información, pero cuya estructura de datos no coincide con la que exige la plataforma, y que no cuentan con un equipo de desarrollo para programar una integración a medida.

Cómo funciona: el supermercado exporta su catálogo tal cual lo tiene en su propio sistema, lo sube una primera vez, y la plataforma lo guía en un paso de configuración inicial donde indica qué columna de su archivo corresponde a qué dato del sistema (por ejemplo, "Precio Unit." equivale a "precio de venta"). Una vez hecha esa configuración, las cargas siguientes son automáticas: el supermercado sube el archivo con su formato habitual y el sistema lo interpreta solo.

Reglas de negocio:

* La configuración de mapeo queda asociada a la cuenta del supermercado y es reutilizable indefinidamente, salvo que el supermercado cambie la estructura de su propio archivo, en cuyo caso deberá rehacer el mapeo.
* El supermercado sigue siendo responsable del contenido (precio, stock, vigencia), la plataforma solo traduce la estructura.
* Se mantiene la misma exigencia de actualización periódica que en la Modalidad 1\.
* Ante un cambio en la estructura del archivo exportado que la plataforma no pueda interpretar automáticamente, la carga debe quedar en espera de revisión y notificarse al supermercado, en lugar de procesarse con datos incompletos o erróneos.

Restricciones: al igual que la Modalidad 1, depende de una acción manual de carga, por lo que no es apta para catálogos con actualizaciones muy frecuentes durante el día; requiere que el supermercado pueda exportar su información a un archivo (CSV/Excel), aunque sea con su propio formato.

**Modalidad 3 — Integración directa entre sistemas**

A quién está dirigida: supermercados con equipo de sistemas o desarrollo propio, con volumen de catálogo alto o alta frecuencia de cambios de precio y stock, para quienes la carga manual de archivos resulta operativamente inviable.

Cómo funciona: se distinguen dos momentos distintos, porque no es lo mismo la primera incorporación de todo el catálogo que el mantenimiento posterior:

* **Incorporación inicial:** cuando el supermercado se asocia por primera vez, debe transferir la totalidad de su catálogo a la plataforma. Por el volumen de datos que esto implica, este proceso se maneja como una operación de fondo: el supermercado envía la información, recibe una confirmación de que fue recibida, y el sistema la procesa en segundo plano, informando al supermercado el resultado sin que eso lo obligue a esperar en línea a que termine.
* **Mantenimiento continuo:** una vez que el catálogo inicial está incorporado y validado, el supermercado notifica a la plataforma únicamente los cambios puntuales a medida que ocurren. Esto permite que el catálogo se mantenga actualizado prácticamente en tiempo real, sin depender de cargas periódicas.

Reglas de negocio:

* La modalidad de mantenimiento continuo no puede habilitarse hasta que la incorporación inicial esté formalmente completada y validada; de lo contrario podrían coexistir datos parciales o inconsistentes.
* Cada supermercado que opera bajo esta modalidad debe ser autenticado de forma unívoca, de manera que no pueda modificar ni consultar información de catálogos ajenos.
* Es responsabilidad del supermercado notificar los cambios en tiempo oportuno; el sistema no sale a "buscar" cambios por su cuenta.
* Debe existir un mecanismo de auditoría: quedar registro de cada actualización recibida por esta vía (qué se cambió, cuándo, y si se aplicó correctamente).
* Ante fallas repetidas o inconsistencias sostenidas por parte de un supermercado en esta modalidad, la plataforma debe poder suspender preventivamente la integración automática y notificar al supermercado.

Restricciones: exige que el supermercado cuente con capacidad técnica propia para implementar la conexión de su lado; es la modalidad de mayor exigencia de coordinación inicial entre ambas partes, por lo que conviene contemplar un período de habilitación/certificación antes de que el supermercado quede operativo en modo automático.

**Regla transversal a las tres modalidades**

Independientemente de la modalidad elegida, la plataforma es la única fuente de verdad de cara al cliente final: los precios y el stock que ve el cliente al armar su lista de compra son siempre los últimos recibidos del supermercado, sin importar por qué vía llegaron. Ante una compra confirmada con datos que luego resultan desactualizados por demora del supermercado en informar un cambio, se respeta el precio mostrado al momento de la confirmación de compra.

El acuerdo de adhesión entre la plataforma y cada supermercado debe fijar de antemano términos y condiciones sobre qué ocurre cuando un precio o stock desactualizado del comercio provoca un problema en una compra ya confirmada (por ejemplo, un producto que se muestra disponible pero no lo está al momento del retiro): quién amortigua la diferencia de costo o el reclamo del cliente, y bajo qué condiciones. Esto evita que la disputa se resuelva caso por caso.

Para incentivar la adhesión temprana de comercios, se contemplan beneficios durante los primeros N meses desde la integración (por ejemplo, comisión reducida o exposición destacada sin costo), a definir junto con el resto de beneficios por actor (ver [7. Beneficios e incentivos por actor](#7.-beneficios-e-incentivos-por-actor)).

---

## 4\. El motor de optimización {#4.-el-motor-de-optimización}

Es el núcleo funcional de la aplicación. Dada la lista de compras del cliente y los supermercados con cobertura en su zona, el motor calcula el costo de resolver esa lista en cada comercio por separado y en distintas combinaciones entre comercios, y devuelve una **recomendación** de la opción más conveniente, junto con el ahorro estimado respecto de comprar todo en un solo lugar.

Puntos clave a nivel funcional:

* **No hay un límite fijo de comercios entre los que se puede dividir la compra.** El usuario puede comparar y comprar entre tantos comercios como quiera, más allá de que el ahorro sea o no el objetivo de la herramienta.
* **El sistema solo sugiere.** La recomendación es siempre a título informativo; la decisión final de qué comprar y en qué comercio(s) es exclusivamente del usuario.
* Si el usuario elige una combinación distinta a la recomendada y esa elección implica un costo logístico adicional respecto de la opción óptima, el sistema se lo informa antes de confirmar y le aplica el recargo correspondiente (ver [Modelo de negocio](#5.-modelo-de-negocio)).
* **Tratamiento de faltantes:** cuando un producto no está disponible en ninguno de los comercios considerados, el sistema aplica una de estas reglas, configurable por el usuario:
  * Excluir el producto y advertirlo en el resultado.
  * Sugerir un producto sustituto de la misma categoría.
  * Descartar la combinación si la cantidad de faltantes supera un umbral.
* **Radios de cobertura:** se definen un radio mínimo y máximo de usabilidad respecto de la dirección de entrega del cliente. Solo se consideran para el cálculo y la sugerencia los supermercados dentro de ese rango; fuera de él, un comercio no compite aunque tenga mejor precio. El mismo radio es el criterio que determina qué repartidores son elegibles para tomar un pedido (ver [Panel de repartidor](#módulos-incluidos)).
* **Costo logístico de dividir la compra:** cuando la compra se reparte entre *n* comercios, el costo de envío no crece de forma lineal con *n*, sino según la función `P(n) = P₀ + k·(n−1)^2.5`, donde `P₀` es el costo base de envío con un solo comercio y `k` un coeficiente de ajuste (fórmula y ejemplo numérico detallados en [Función precio envío](funcion-precio-envio.pdf)). El exponente 2.5 hace que 1 o 2 comercios tengan un costo razonable, 3 ya implique un salto notorio, y de 4 en adelante el costo crezca fuertemente, desincentivando dividir la compra en demasiados puntos de origen sin necesidad de reglas adicionales por distancia. Los valores de `P₀` y `k` se definen por tamaño de envío (ver más abajo) y se usan tanto para el fee de envío estándar como para el recargo por combinación menos eficiente (ver [Modelo de negocio](#5.-modelo-de-negocio)).
* **Tamaño de envío:** existen tres coeficientes de `P₀`/`k` distintos según el envío sea pequeño, mediano o grande, ya que cada tamaño requiere transporte y tiempos de entrega diferentes; el exponente 2.5 se mantiene igual entre los tres.

El detalle técnico de cómo se calcula la recomendación (algoritmo, estructuras de datos, complejidad) se define en la documentación técnica de arquitectura, no en este documento funcional.

---

## 5\. Modelo de negocio {#5.-modelo-de-negocio}

La plataforma no depende de una única fuente de ingresos. El uso básico es gratuito para el cliente final (financiado por publicidad), y se combina con tres fuentes adicionales: una suscripción premium del lado del cliente, una comisión u honorario asociado a cada compra concretada, y un recargo puntual cuando el propio cliente elige una forma de comprar más costosa de operar que la recomendada. Esta combinación busca que el negocio sea sostenible incluso con una base grande de usuarios que nunca paguen una suscripción.

**1\. Suscripción Premium (ingreso recurrente, lado cliente)**

El usuario que quiere una experiencia sin fricciones y con beneficios adicionales paga un abono periódico (mensual o anual, con descuento por anualidad).

Beneficios a definir para el plan Premium (a modo de propuesta, para validar): sin publicidad (pero sí ve promociones, ver más abajo); envío gratis hasta 2 locales por compra, condicionado al nivel de fidelidad del usuario (ver "Niveles de usuario" más abajo); prioridad en la asignación de repartidor en horarios pico; acceso anticipado o exclusivo a promociones de determinados supermercados.

Reglas de negocio: el beneficio de envío gratis hasta 2 locales aplica solo a partir de cierto nivel de fidelidad (por ejemplo, compras seguidas o volumen acumulado), no está disponible desde el primer mes de suscripción por igual para todos los usuarios Premium; la suscripción es a nivel de cuenta de cliente, no de compra puntual; debe poder cancelarse en cualquier momento, con el beneficio activo hasta el fin del período ya pagado.

**Niveles de usuario y de supermercado**

Tanto los clientes como los supermercados progresan por niveles según su comportamiento en la plataforma (para el cliente: compras seguidas, fidelidad, puntos acumulados; para el supermercado: cumplimiento de tiempos de preparación, actualización periódica de catálogo). El nivel es el mecanismo que habilita beneficios crecientes en ambos lados: en el cliente, determina hasta qué punto se bonifica el envío dentro del plan Premium y cuántos puntos otorga cada compra; en el supermercado, reemplaza y formaliza las "condiciones preferenciales por buen desempeño" mencionadas en la sección de beneficios (ver [7. Beneficios e incentivos por actor](#7.-beneficios-e-incentivos-por-actor)), como reducción de comisión o mejor posicionamiento por mérito en las búsquedas.

Restricción: el valor de la suscripción tiene que calibrarse contra el costo real del envío, porque si el beneficio de "envíos bonificados" es más generoso de lo que cubre el abono, la suscripción da pérdida por usuario activo.

**2\. Comisión por transacción/envío (ingreso variable, lado operación)**

Cada compra concretada a través de la plataforma genera un ingreso por comisión, independientemente de si el usuario es free o premium. Hay dos caminos posibles, no excluyentes:

* **Comisión al supermercado:** un fee sobre el total de la compra, deliberadamente bajo, similar a como cobran los marketplaces tradicionales a sus comercios adheridos. El modelo apuesta a maximizar la cantidad de ventas concretadas en la plataforma antes que a cobrar una comisión alta por venta. Es el modelo más común y el que menos fricción genera con el cliente final.
* **Fee de envío al cliente:** un costo fijo o variable por el servicio de logística/reparto, cobrado al cliente en el checkout, independiente del precio de los productos.

Reglas de negocio: si se opta por comisión al supermercado, debe quedar claramente pactada en el acuerdo de adhesión (porcentaje fijo, o escalonado según volumen de ventas); el fee de envío al cliente, si existe, debe mostrarse de forma transparente antes de confirmar la compra, nunca como costo oculto; los usuarios Premium podrían tener condiciones preferenciales sobre este fee, pero la comisión al supermercado se mantiene igual sin importar el tipo de cliente que compró.

Restricción: si se cobra comisión al supermercado, eso puede desincentivar la adhesión de comercios chicos con márgenes ajustados.

**3\. Recargo por elegir una combinación menos eficiente (ingreso variable, lado cliente)**

Como se detalla en el [motor de optimización](#4.-el-motor-de-optimización), el sistema siempre sugiere una combinación de comercios que considera óptima, pero el usuario puede comprar de la forma que prefiera. Cuando la elección del usuario implica un costo logístico real superior al de la opción recomendada, ese costo adicional se traslada al usuario en forma de recargo.

El recargo se calcula con la misma función de costo logístico definida en la sección anterior, `P(n) = P₀ + k·(n−1)^2.5` (con `P₀`/`k` según el tamaño de envío correspondiente): es la diferencia entre el `P(n)` de la combinación que el usuario eligió y el `P(n)` de la combinación recomendada por el optimizador.

Reglas de negocio: el recargo debe reflejar el costo real incremental de reparto según esa fórmula, no un cargo arbitrario, para que sea defendible ante el usuario como "esto sale más caro porque hay más logística involucrada", no como una penalización; el sistema debe mostrar el recargo antes de que el usuario confirme su elección, comparándolo contra la opción recomendada, para que la decisión sea informada; los usuarios Premium podrían tener este recargo bonificado o reducido.

Restricción: este ingreso depende de que el usuario elija activamente una opción subóptima, por lo que no puede proyectarse como una fuente de ingreso principal ni predecible; es más un mecanismo de balance de costos que una línea de negocio fuerte.

**4\. Publicidad en la versión gratuita (ingreso indirecto, lado anunciante)**

Los usuarios que no pagan suscripción ven espacios publicitarios dentro de la plataforma, financiados por anunciantes. No se acepta publicidad de terceros ajenos al rubro; los únicos anunciantes posibles son los propios supermercados adheridos, que pagan por destacar sus productos o su marca, y marcas de productos (proveedores) interesadas en visibilidad dentro del catálogo.

Se distingue explícitamente entre **publicidad** (espacio pago que promociona una marca o un comercio sin relación directa con lo que el usuario buscó) y **promociones** (descuentos u ofertas concretas de un supermercado sobre productos, visibles en el flujo de compra). Los usuarios Premium no ven publicidad, pero sí ven promociones, ya que estas aportan valor directo a la decisión de compra en lugar de ser solo un espacio comercial.

Un caso particular de espacio pago es el posicionamiento en los resultados de búsqueda: de una lista de sugerencias, la mitad de las posiciones se asigna por pago (permitiendo la competencia entre los grandes supermercados por aparecer destacados) y la otra mitad se asigna de forma "orgánica", dando prioridad a los comercios que actualizan su stock y precios en la plataforma de manera periódica (ver también "Niveles de usuario y de supermercado" más arriba y [7. Beneficios e incentivos por actor](#7.-beneficios-e-incentivos-por-actor)).

Reglas de negocio: la publicidad no puede alterar ni mezclarse con el resultado del motor de comparación de precios; si un supermercado pudiera "pagar para aparecer más barato" o para posicionarse por encima de una opción más conveniente sin distinción visual clara, se rompe la confianza del usuario en la herramienta. Todo contenido patrocinado (publicidad o posicionamiento pago en búsqueda) debe estar etiquetado como tal, de forma visible.

Restricción: este ingreso depende de una base de usuarios activa considerable para ser atractivo a anunciantes, por lo que en las primeras etapas del producto probablemente no sea una fuente relevante de ingresos, sino una que madura con la escala.

---

## 6\. Alcance funcional {#6.-alcance-funcional}

### Módulos incluidos {#módulos-incluidos}

**Cuentas y acceso:** Registro y autenticación de usuarios. Gestión de perfil, direcciones de entrega y control de acceso diferenciado por rol.

**Catálogo y búsqueda:** Búsqueda de productos por nombre y categoría. Ficha de producto con comparación de precios entre los supermercados disponibles.

**Lista de compras:** Armado y edición de la lista, ajuste de cantidades, guardado de listas frecuentes para reutilizar.

**Motor de optimización:** Cálculo de escenarios de compra en uno o varios comercios, presentación comparada de alternativas con el detalle de qué producto se compra en cada comercio y cuál es el ahorro.

**Pedidos:** Confirmación del pedido, generación de una orden de preparación por cada comercio involucrado según la elección del usuario, y seguimiento del estado en tiempo diferido.

**Panel de supermercado:** ABM de productos, actualización de precios, stock y bandeja de pedidos entrantes con cambio de estado de preparación.

**Panel de repartidor:** Listado de tareas asignadas, registro de retiro en cada comercio y confirmación de entrega. La asignación de un pedido a un repartidor usa el mismo radio de cobertura definido para sugerir comercios (ver [Motor de optimización](#4.-el-motor-de-optimización)): solo se consideran elegibles los repartidores dentro de ese rango respecto de los puntos de retiro y entrega.

**Administración:** Gestión de usuarios y roles, alta de comercios y sucursales, definición de zonas de cobertura y costos de envío.

### Ciclo de vida del pedido {#ciclo-de-vida-del-pedido}

PENDIENTE → CONFIRMADO → EN PREPARACIÓN → LISTO PARA RETIRO

          → ASIGNADO → RETIRADO → EN CAMINO → ENTREGADO

Cuando el pedido involucra a varios comercios, los estados de preparación y retiro se registran **por comercio**. El pedido no transiciona a EN CAMINO hasta que todos los retiros estén confirmados. El estado CANCELADO es alcanzable desde los estados previos a EN CAMINO.

### Fuera de alcance {#fuera-de-alcance}

Se excluyen explícitamente, por no aportar valor conceptual al proyecto o por exceder las tecnologías de la asignatura:

* **Geolocalización, mapas y optimización de rutas.** El repartidor registra estados manualmente; no hay seguimiento en tiempo real.
* **Obtención automática de precios desde sitios de terceros.**
* **Aplicación móvil nativa.** La interfaz es web responsiva.
* **Mensajería en tiempo real** entre actores.
* **Internacionalización** y múltiples monedas.

---

## 7\. Beneficios e incentivos por actor {#7.-beneficios-e-incentivos-por-actor}

Más allá de la funcionalidad base descripta en cada rol (sección [2](#2.-actores-del-sistema)), Changuito busca un diferencial concreto frente a comparadores o marketplaces existentes: cada actor tiene una razón activa para preferir la plataforma, no solo la posibilidad de usarla. Este apartado reúne un relevamiento amplio de propuestas de beneficios por actor, a modo de banco de ideas para luego decidir cuáles se adoptan como parte del producto (ver [8. Scope del trabajo práctico](#8.-scope-del-trabajo-práctico)).

**Cliente**

* Cupones o descuentos por uso recurrente de la app, más allá de una promoción puntual de un comercio.
* Programa de puntos por niveles: se acumulan puntos por compra y el nivel alcanzado habilita beneficios crecientes (envío bonificado, prioridad de repartidor, promociones exclusivas); no funciona como cashback canjeable por dinero o directamente contra el fee de envío.
* Reporte periódico de "cuánto ahorraste este mes usando Changuito", para reforzar el valor percibido de la herramienta.
* Beneficio por referidos: descuento tanto para quien invita como para quien se suma.
* Alertas de bajada de precio en productos de listas guardadas o frecuentes.
* Beneficios del plan Premium ya definidos en el [modelo de negocio](#5.-modelo-de-negocio) (sin publicidad pero con promociones, envío gratis hasta 2 locales según nivel de fidelidad, prioridad de repartidor, acceso anticipado a promociones).

**Supermercado**

* Visibilidad o posicionamiento destacado en resultados de búsqueda: la mitad de las posiciones en un listado de sugerencias es pago (compite entre los grandes supermercados), y la otra mitad es orgánica, priorizando a los comercios que mantienen su catálogo actualizado con mayor periodicidad (ver [Modelo de negocio](#5.-modelo-de-negocio)).
* Acceso a métricas de demanda agregada: qué productos se buscan y no encuentran en su catálogo, qué categorías generan más comparaciones en su zona.
* Canal de venta adicional sin necesidad de invertir en desarrollar un e-commerce propio, especialmente relevante para comercios que se integran por Modalidad 1 o 2\.
* Posibilidad de lanzar promociones o descuentos exclusivos dentro de la plataforma, visibles para todos los usuarios o solo para usuarios Premium.
* Condiciones preferenciales por nivel de desempeño sostenido (catálogo siempre actualizado, cumplimiento de tiempos de preparación): reducción de comisión y mejor posicionamiento orgánico en búsquedas (ver "Niveles de usuario y de supermercado" en el [modelo de negocio](#5.-modelo-de-negocio)).
* Beneficios por integración temprana: durante los primeros N meses desde la adhesión, publicidad o posicionamiento destacado sin costo y/o condiciones preferenciales de comisión, para aumentar el atractivo de sumarse a la plataforma frente a la competencia entre grandes cadenas.

**Repartidor**

* Bono por racha de entregas completadas dentro de un tiempo objetivo desde que el pedido queda listo para retiro.
* Priorización en la asignación de pedidos según historial de cumplimiento: mejor reputación implica más oportunidades de trabajo.
* Bono adicional por aceptar pedidos que involucran a varios comercios, al ser operativamente más exigentes que uno simple.
* Esquema de propinas digitales integradas al flujo de pago del cliente.
* Zonas u horarios preferenciales de asignación para los repartidores con mejor desempeño.

**Administrador / plataforma**

* Panel de métricas globales de adopción, ahorro generado a los usuarios y volumen por comercio, útil como argumento comercial para conseguir más comercios adheridos. Este beneficio es más una herramienta de gestión que un incentivo directo a un actor, pero se incluye porque sostiene la propuesta de valor frente a los demás.

Esta lista es intencionalmente amplia; queda pendiente una instancia de curación con el equipo para decidir qué beneficios se adoptan como parte del producto real y cuáles se descartan.

---

## 8\. Scope del trabajo práctico {#8.-scope-del-trabajo-práctico}

El tiempo de cursada no alcanza para implementar el producto completo descripto en este documento. Este apartado separa explícitamente qué se va a construir dentro del Trabajo Práctico Integrador de qué queda documentado a nivel producto, como base para un MVP a futuro fuera de la materia. El corte propuesto a continuación es una recomendación inicial del equipo, sujeta a ajuste y a lo que se acuerde con el equipo docente en cada entrega (tal como prevé el cronograma de la cátedra).

**Incluido en el TPI (mínimo funcional end-to-end):**

* Cuentas y acceso: registro, login y control de acceso diferenciado por rol.
* Catálogo y búsqueda de productos.
* Lista de compras: armado, edición y guardado de listas frecuentes.
* Motor de optimización: comparación funcional entre comercios y recomendación de la combinación más conveniente.
* Checkout y gestión de pedidos, con su ciclo de estados.
* Panel de supermercado: ABM básico de catálogo y bandeja de pedidos entrantes.
* Panel de repartidor: listado de tareas, registro de retiro y confirmación de entrega.
* Administración básica: alta de comercios, sucursales y zonas de cobertura.

**Documentado a nivel producto, fuera del alcance del TPI (backlog de MVP futuro):**

* Programa de beneficios e incentivos descripto en la sección anterior (cupones, puntos, bonos por racha, métricas para comercios, referidos, etc.).
* Suscripción Premium como flujo de pago real (puede quedar modelada conceptualmente, sin pasarela de pago real integrada).
* Publicidad real dentro de la plataforma: espacios pagos, segmentación de anunciantes.
* Reportes y analítica avanzada para comercios y administración.
* Soporte para dividir una compra entre más de dos comercios, si el tiempo de desarrollo no permite generalizar el optimizador más allá del caso básico.

---

## 9\. Riesgos {#9.-riesgos}

### 9.1 Riesgos técnicos {#91-riesgos-técnicos}

**Integración y vigencia de catálogos**

La confianza en la plataforma depende de que el precio mostrado sea el precio real, y la actualización queda en manos de cada comercio a través de alguna de las tres modalidades de integración. Una falla o inconsistencia en la carga (planilla mal cargada, un mapeo que deja de coincidir con el archivo exportado, un evento de integración directa que no llega o llega corrupto) genera un precio o stock desactualizado: esto produce una recomendación incorrecta del optimizador y, en un escenario de compra dividido, puede tirar abajo el pedido en un comercio y arrastrar al resto de los comercios y al repartidor involucrados.

**Mitigación:** fecha de última actualización visible por producto; alertas al comercio ante catálogos sin modificar por sobre la frecuencia mínima esperada; validación de formato estricta en la Modalidad 1 y de estructura en la Modalidad 2 antes de aceptar una carga; auditoría de eventos en la Modalidad 3 y suspensión preventiva de la integración automática ante fallas repetidas; política explícita de qué pasa si el precio o el stock cambian entre que se muestra al usuario y se confirma la compra (se respeta el precio mostrado al momento de la confirmación); acuerdo de adhesión que defina de antemano cómo se amortiguan los costos o reclamos cuando un precio o stock desactualizado del comercio afecta a una compra ya confirmada, en lugar de resolverlo caso por caso.

### 9.2 Riesgos de negocio {#92-riesgos-de-negocio}

**Adhesión de los comercios**

Al no hacer scraping, el sistema depende de que cada supermercado cargue y mantenga su catálogo. El problema no es la carga en sí sino el incentivo: la plataforma vuelve transparente una diferencia de precios que hoy no lo es, y el comercio que sale mal parado en la comparación tiene motivos para no participar. Con pocos comercios por zona, la baja de uno deja al optimizador sin nada que comparar.

**Mitigación:** propuesta de valor orientada al canal de venta digital y a la captación de clientes nuevos, no a la comparación; foco en comercios medianos sin e-commerce propio; mínimo de comercios activos para habilitar una zona.

**Ahorro neto insuficiente**

El motor de optimización vale si dividir la compra conviene de verdad. El costo logístico adicional de sumar comercios frecuentemente puede absorber el ahorro. Si eso pasa de forma sistemática, el sistema va a recomendar casi siempre la compra unificada y la funcionalidad diferencial queda sin uso.

**Mitigación:** medir el ahorro neto promedio como métrica principal desde el arranque; evaluar esquemas de envío con paradas múltiples a costo intermedio en lugar de un envío completo por cada comercio.

**Modelo de ingresos**

Las distintas fuentes de ingreso no son equivalentes entre sí: los espacios destacados pagos entran en conflicto directo con la neutralidad del optimizador, porque si un comercio puede pagar por mejorar su posición el resultado deja de ser confiable.

**Mitigación:** separar de forma explícita el resultado del optimizador de cualquier espacio comercial pago; validar el equilibrio entre las cuatro fuentes de ingreso descriptas en el [modelo de negocio](#5.-modelo-de-negocio) antes de cualquier puesta en producción.

**Complejidad de la operación logística**

Retirar en varios comercios y entregar en un único punto es más caro y más frágil que un envío simple. El ciclo de vida lo refleja: el pedido no avanza hasta que todos los retiros estén confirmados, así que la demora de un comercio bloquea la entrega completa, y un incidente puede involucrar a múltiples partes sin que quede claro quién responde.

**Mitigación:** radio de cobertura y franjas horarias acotadas al inicio; circuito de reclamos y responsabilidad de cada actor definidos en las condiciones de servicio.

---

## 10\. Sitemap {#10.-sitemap}

Se divide en tres sitemaps ya que se contará con tres páginas web, cada una orientada a los perfiles y roles del negocio. Se contará con una app de gestión, una de logística y la aplicación final de cara al cliente.

[aquí insertar referencia a diagrama de sitemap]

---

## 11\. Stack tecnológico {#11.-stack-tecnológico}

| Capa | Tecnología |
| :---- | :---- |
| Front-end | HTML5, CSS3, JavaScript (sin frameworks) |
| Back-end | PHP |
| Base de datos | MySQL / MariaDB |
| Control de versiones | Git, repositorio público |

### Justificación {#justificación}

**PHP** se elige por continuidad con el recorrido de la cursada. El equipo llega a la instancia de implementación con el lenguaje ya rodado a través de los trabajos prácticos, incluido el manejo de sesiones, en lugar de aprender una tecnología nueva en paralelo al desarrollo del proyecto.

A esto se suma que el despliegue de PHP es sencillo en cualquier hosting compartido, sin necesidad de administrar un runtime persistente.

**Base relacional** porque el modelo central —producto, comercio, sucursal, precio vigente— es relacional por naturaleza, y el optimizador se apoya en operaciones de agregación y comparación entre tablas que el motor resuelve de manera eficiente.

**JavaScript sin librerías de terceros** para las interacciones dinámicas: armado de la lista, actualización de totales y consulta del optimizador. Si en el transcurso del desarrollo se identificara la necesidad de alguna librería, se consultará previamente al equipo docente.

---

## 12\. Presupuesto y planificación {#12.-presupuesto-y-planificación}

Sobre once semanas de cursada restantes, el trabajo se distribuye entre los tres integrantes del equipo, con seguimiento de tareas y tiempos por entrega.

[aquí insertar referencia a tablero de gestión de tareas y tiempos]
</content>
