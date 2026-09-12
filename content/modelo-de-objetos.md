---
title: "Modelo de Objetos"
order: 3
---

# Modelo de Objetos

Este documento define las entidades del back-end de Changuito, sus atributos y sus relaciones, como base para el diseño de la base de datos (PHP + MySQL/MariaDB, ver [Stack tecnológico](propuesta-general.md#11-stack-tecnológico)). Complementa la [Propuesta General](propuesta-general.md) bajando cada regla de negocio a una estructura concreta de datos. Las secciones 2 a 6 explican el razonamiento detrás de cada grupo de entidades; la [sección 8](#8-diagrama-entidad-relación) consolida todo en un único diagrama Entidad-Relación.

Los tipos de dato son orientativos, pensando en un motor relacional (MySQL/MariaDB).

## 1. Alcance

Modela el **producto completo** descripto en la propuesta, no solo lo que entra en el Trabajo Práctico Integrador. Las entidades que quedan fuera de la implementación del TPI (ver [Scope del trabajo práctico](propuesta-general.md#8-scope-del-trabajo-práctico)) están bosquejadas en la [sección 6](#6-backlog-fuera-de-scope-de-implementación-del-tpi), con su nombre y relación principal, sin atributos, y marcadas explícitamente como no implementadas.

## 2. Identidad y roles

Un `Usuario` concentra los datos comunes de autenticación/perfil. Cada [actor del sistema](propuesta-general.md#2-actores-del-sistema) tiene además una tabla propia en relación 1:1, porque sus datos son demasiado distintos entre sí para vivir en una sola tabla: un `Supermercado` no tiene "nombre y apellido", tiene razón social y CUIT.

```
Usuario
├── id                  BIGINT PK
├── email               VARCHAR(255) UNIQUE
├── password_hash       VARCHAR(255)
├── nombre              VARCHAR(255)
├── fecha_alta          DATETIME
└── activo              BOOLEAN

Cliente (1:1 Usuario)
├── usuario_id          FK → Usuario.id
└── preferencia_faltantes_default   ENUM('EXCLUIR','SUSTITUIR','DESCARTAR_UMBRAL')

Repartidor (1:1 Usuario)
└── usuario_id          FK → Usuario.id

Administrador (1:1 Usuario)
└── usuario_id          FK → Usuario.id

Supermercado (1:1 Usuario)
├── usuario_id          FK → Usuario.id
├── razon_social        VARCHAR(255)
└── cuit                VARCHAR(20)

Direccion (N:1 Cliente)
├── id                  BIGINT PK
├── cliente_id          FK → Cliente.usuario_id
├── calle, numero, ciudad, cp, ...
├── latitud, longitud
└── es_default          BOOLEAN
```

`Cliente` puede tener varias `Direccion` guardadas, en línea con la gestión de perfil descripta en [Cuentas y acceso](propuesta-general.md#módulos-incluidos).

## 3. Comercios y cobertura

`Supermercado` es la cadena/marca; `Sucursal` es cada punto físico de operación, con su propio stock, precios, zona de cobertura e integración — esto respeta que Administración da de alta "comercios, sucursales y zonas de cobertura" como conceptos separados.

```
Sucursal (N:1 Supermercado)
├── id                  BIGINT PK
├── supermercado_id     FK → Supermercado.usuario_id
├── nombre              VARCHAR(255)
├── direccion, latitud, longitud
└── activa              BOOLEAN

ZonaCobertura (1:1 Sucursal)
├── sucursal_id         FK → Sucursal.id
├── radio_min           DECIMAL
└── radio_max           DECIMAL
```

El mismo radio (`ZonaCobertura`) es el criterio tanto para qué sucursales compiten en el [motor de optimización](propuesta-general.md#4-el-motor-de-optimización) como para qué repartidores son elegibles para un pedido.

### Integración de catálogo

Cada `Sucursal` administra su propio catálogo, y por eso la configuración de integración es **por sucursal**, no por cadena: dentro del mismo `Supermercado`, una sucursal puede estar en [Modalidad 1](propuesta-general.md#3-integración-de-comercios) (planilla) y otra en Modalidad 3 (integración directa).

```
ConfiguracionIntegracion (1:1 Sucursal)
├── sucursal_id         FK → Sucursal.id
├── modalidad           ENUM('PLANILLA','MAPEO','DIRECTA')
├── mapeo_columnas      JSON            -- solo Modalidad 2: columna origen → campo del sistema
├── estado_habilitacion ENUM('EN_CERTIFICACION','HABILITADA','SUSPENDIDA')  -- relevante en Modalidad 3
└── fecha_actualizacion DATETIME

LogAuditoriaCarga (N:1 ConfiguracionIntegracion)
├── id                       BIGINT PK
├── configuracion_id         FK → ConfiguracionIntegracion.sucursal_id
├── fecha                    DATETIME
├── detalle_cambio           TEXT       -- qué se cargó/cambió
└── resultado                ENUM('APLICADO','RECHAZADO','EN_REVISION')
```

`LogAuditoriaCarga` cubre la exigencia de auditoría de la Modalidad 3 ("qué se cambió, cuándo, y si se aplicó correctamente"), y sirve también para trazar rechazos de formato en Modalidad 1 y revisiones pendientes en Modalidad 2.

## 4. Catálogo y precio

Existe un `Producto` **canónico**, compartido entre supermercados, para que el motor de optimización pueda comparar "el mismo producto" entre comercios. El precio y el stock viven en `ProductoSucursal`, que vincula ese producto canónico con cada sucursal.

```
Categoria
├── id      BIGINT PK
└── nombre  VARCHAR(255)

Producto
├── id              BIGINT PK
├── nombre          VARCHAR(255)
├── descripcion     TEXT
├── categoria_id    FK → Categoria.id
└── tamanio_envio   ENUM('CHICO','MEDIANO','GRANDE')

ProductoSucursal (N:M Producto ↔ Sucursal)
├── producto_id                 FK → Producto.id
├── sucursal_id                 FK → Sucursal.id
├── precio                      DECIMAL(10,2)
├── stock                       INT
└── fecha_ultima_actualizacion  DATETIME
```

`fecha_ultima_actualizacion` implementa la mitigación de riesgo de "fecha de última actualización visible por producto" (ver [Riesgos técnicos](propuesta-general.md#91-riesgos-técnicos)).

### Parámetros del motor de optimización

```
ParametroLogistico
├── tamanio_envio   ENUM('CHICO','MEDIANO','GRANDE')  PK
├── p0              DECIMAL     -- costo base de envío
└── k                DECIMAL    -- coeficiente de ajuste

CoeficienteDistancia
├── id              BIGINT PK
├── tamanio_envio   ENUM('CHICO','MEDIANO','GRANDE')
├── distancia_min   DECIMAL
├── distancia_max   DECIMAL
└── coeficiente     DECIMAL
```

Estas dos tablas alimentan dos mecanismos **distintos y complementarios** del [motor de optimización](propuesta-general.md#4-el-motor-de-optimización):

- **`CoeficienteDistancia`**: pondera `precio × coeficiente_por_distancia` producto por producto, según la distancia entre el destino del pedido y cada sucursal candidata, para decidir en qué sucursal conviene comprar cada producto.
- **`ParametroLogistico`** (`p0`, `k`): se aplica **una sola vez**, sobre el costo total de envío, mediante `P(n) = p0 + k·(n-1)^2.5`, donde `n` es la cantidad de comercios elegidos en la combinación final. Determina tanto el fee de envío estándar como el recargo por [combinación subóptima](propuesta-general.md#5-modelo-de-negocio).

Cuando una `OrdenComercio` mezcla productos de distinto `tamanio_envio`, se toma el tamaño **máximo** presente para determinar qué fila de `ParametroLogistico`/`CoeficienteDistancia` aplica a ese tramo.

**El resultado del optimizador no se persiste como entidad.** El cálculo se resuelve con dos stored procedures:

1. Dada una lista de productos y las sucursales candidatas (con la distancia del pedido a cada una como parámetro), arma la unión de precios ponderados por `CoeficienteDistancia` y obtiene el mínimo por producto×sucursal.
2. A partir de esa lista optimizada, calcula el costo logístico total con `P(n)` y arma la combinación recomendada.

Solo se persisten, dentro del `Pedido` ya confirmado, `costo_logistico_recomendado` y `costo_logistico_elegido` — lo mínimo necesario para justificar el recargo ante el usuario.

## 5. Compra

Tres entidades separadas, cada una con un propósito distinto: `ListaDeCompras` es reutilizable y editable; `Carrito` es la selección activa con sucursales ya resueltas; `Pedido` es el snapshot inmutable de la compra confirmada.

```
ListaDeCompras (N:1 Cliente)
├── id            BIGINT PK
├── cliente_id    FK → Cliente.usuario_id
├── nombre        VARCHAR(255)
└── fecha_creacion DATETIME

ItemLista (N:1 ListaDeCompras)
├── lista_id      FK → ListaDeCompras.id
├── producto_id   FK → Producto.id
└── cantidad      INT
```

### Carrito

El `Carrito` se arma combinando ítems de una o varias `ListaDeCompras`. Por defecto, cada ítem trae la sucursal que resultó del optimizador; el usuario puede después cambiar manualmente la sucursal de cualquier ítem antes de confirmar, lo que recalcula el precio de ese ítem y el total del carrito.

```
Carrito (1:1 Cliente activo)
├── id                        BIGINT PK
├── cliente_id                FK → Cliente.usuario_id
└── preferencia_faltantes     ENUM('EXCLUIR','SUSTITUIR','DESCARTAR_UMBRAL')
                              -- override puntual; default heredado de Cliente.preferencia_faltantes_default

ItemCarrito (N:1 Carrito)
├── carrito_id        FK → Carrito.id
├── producto_id       FK → Producto.id
├── sucursal_id       FK → Sucursal.id      -- sucursal resuelta (por optimizador o elegida a mano)
├── cantidad          INT
└── precio_unitario   DECIMAL(10,2)         -- snapshot del precio al momento de resolver
```

### Pedido

Al confirmar, el `Carrito` se "congela" en un `Pedido` inmutable — respeta la regla de que se respeta el precio mostrado al momento de la confirmación de compra. El pedido se descompone en una `OrdenComercio` por cada sucursal involucrada, porque los estados de preparación y retiro se registran por comercio (ver [Ciclo de vida del pedido](propuesta-general.md#ciclo-de-vida-del-pedido)).

```
Pedido (N:1 Cliente)
├── id                            BIGINT PK
├── cliente_id                    FK → Cliente.usuario_id
├── direccion_entrega_id          FK → Direccion.id
├── repartidor_id                 FK → Repartidor.usuario_id (nullable hasta ASIGNADO)
├── estado                        ENUM('PENDIENTE','CONFIRMADO','ASIGNADO','EN_CAMINO','ENTREGADO','CANCELADO')
├── costo_logistico_recomendado   DECIMAL(10,2)
├── costo_logistico_elegido       DECIMAL(10,2)
└── fecha_confirmacion            DATETIME

OrdenComercio (N:1 Pedido)
├── id            BIGINT PK
├── pedido_id     FK → Pedido.id
├── sucursal_id   FK → Sucursal.id
└── estado        ENUM('CONFIRMADO','EN_PREPARACION','LISTO_PARA_RETIRO','RETIRADO')

ItemPedido (N:1 OrdenComercio)
├── orden_comercio_id   FK → OrdenComercio.id
├── producto_id         FK → Producto.id
├── cantidad            INT
└── precio_unitario     DECIMAL(10,2)   -- snapshot inmutable
```

### Ciclo de vida — reparto de estados

```
OrdenComercio (por comercio):
  CONFIRMADO → EN_PREPARACION → LISTO_PARA_RETIRO → RETIRADO

Pedido (global):
  PENDIENTE → CONFIRMADO → ASIGNADO → EN_CAMINO → ENTREGADO
  CANCELADO alcanzable desde cualquier estado anterior a EN_CAMINO
```

Reglas de sincronización:

- `Pedido.ASIGNADO` refleja que ya hay un `Repartidor` asociado, aunque todavía no haya retirado en ningún comercio.
- Un único `Repartidor` por `Pedido` hace todas las paradas de retiro (una por `OrdenComercio`) y la entrega final — no se modela reparto paralelo con múltiples repartidores por pedido.
- `Pedido.EN_CAMINO` solo se alcanza cuando **todas** las `OrdenComercio` de ese pedido llegaron a `RETIRADO`.
- `CANCELADO` se propaga a las `OrdenComercio` que aún no llegaron a `RETIRADO`.

## 6. Backlog / fuera de scope de implementación del TPI

Entidades que existen a nivel de producto (ver [Beneficios e incentivos](propuesta-general.md#7-beneficios-e-incentivos-por-actor) y [Modelo de negocio](propuesta-general.md#5-modelo-de-negocio)) pero que el [Scope del trabajo práctico](propuesta-general.md#8-scope-del-trabajo-práctico) deja explícitamente fuera de la implementación. Se listan con su relación principal, sin atributos, para que el modelo sirva de mapa completo del producto:

- **`SuscripcionPremium`** (N:1 `Cliente`) — plan de abono, sin pasarela de pago real integrada en el TPI.
- **`NivelFidelidad`** (N:1 `Cliente` y N:1 `Supermercado`) — nivel por comportamiento (compras, puntos acumulados / cumplimiento operativo).
- **`Promocion`** (N:1 `Sucursal`, N:M `Producto`) — descuentos u ofertas visibles en el flujo de compra.
- **`Publicidad`** (N:1 `Supermercado` o marca/proveedor) — espacio pago, distinto de `Promocion`.
- **`CuponReferido`** (N:1 `Cliente` invitador, N:1 `Cliente` invitado) — beneficio por referidos.
- **`PropinaDigital`** (N:1 `Pedido`, N:1 `Repartidor`) — propina integrada al pago.
- **`BonoRepartidor`** (N:1 `Repartidor`) — bono por racha de entregas o por pedidos multi-comercio.

## 7. Relaciones — resumen

```
Usuario 1—1 {Cliente | Repartidor | Administrador | Supermercado}
Cliente 1—N Direccion
Supermercado 1—N Sucursal
Sucursal 1—1 ZonaCobertura
Sucursal 1—1 ConfiguracionIntegracion
ConfiguracionIntegracion 1—N LogAuditoriaCarga
Categoria 1—N Producto
Producto N—M Sucursal (vía ProductoSucursal)
Cliente 1—N ListaDeCompras
ListaDeCompras 1—N ItemLista
Cliente 1—1 Carrito (activo)
Carrito 1—N ItemCarrito
Cliente 1—N Pedido
Pedido 1—N OrdenComercio
Pedido N—1 Repartidor (nullable)
Pedido N—1 Direccion
OrdenComercio N—1 Sucursal
OrdenComercio 1—N ItemPedido
```

## 8. Diagrama Entidad-Relación

Vista consolidada de todas las entidades (atributos con `PK`/`FK` marcados) y sus relaciones con cardinalidad, en notación crow's foot (`||` = uno, `o{` = cero-o-muchos, `o|` = cero-o-uno). Las entidades de backlog (fuera de scope de implementación del TPI, ver [sección 6](#6-backlog-fuera-de-scope-de-implementación-del-tpi)) aparecen al final, marcadas aparte.

```
### Entidades — in scope del TPI ###

Usuario {
  id                 PK  bigint
  email                  varchar unique
  password_hash          varchar
  nombre                 varchar
  fecha_alta             datetime
  activo                 boolean
}
Cliente {
  usuario_id         PK,FK  bigint  -> Usuario.id
  preferencia_faltantes_default  enum(EXCLUIR,SUSTITUIR,DESCARTAR_UMBRAL)
}
Repartidor {
  usuario_id         PK,FK  bigint  -> Usuario.id
}
Administrador {
  usuario_id         PK,FK  bigint  -> Usuario.id
}
Supermercado {
  usuario_id         PK,FK  bigint  -> Usuario.id
  razon_social           varchar
  cuit                   varchar
}
Direccion {
  id                 PK  bigint
  cliente_id         FK  bigint  -> Cliente.usuario_id
  calle, numero, ciudad, cp   varchar
  latitud, longitud      decimal
  es_default             boolean
}
Sucursal {
  id                 PK  bigint
  supermercado_id    FK  bigint  -> Supermercado.usuario_id
  nombre                 varchar
  direccion, latitud, longitud
  activa                 boolean
}
ZonaCobertura {
  sucursal_id        PK,FK  bigint  -> Sucursal.id
  radio_min, radio_max   decimal
}
ConfiguracionIntegracion {
  sucursal_id        PK,FK  bigint  -> Sucursal.id
  modalidad              enum(PLANILLA,MAPEO,DIRECTA)
  mapeo_columnas         json
  estado_habilitacion    enum(EN_CERTIFICACION,HABILITADA,SUSPENDIDA)
  fecha_actualizacion    datetime
}
LogAuditoriaCarga {
  id                 PK  bigint
  configuracion_id   FK  bigint  -> ConfiguracionIntegracion.sucursal_id
  fecha                  datetime
  detalle_cambio         text
  resultado              enum(APLICADO,RECHAZADO,EN_REVISION)
}
Categoria {
  id                 PK  bigint
  nombre                 varchar
}
Producto {
  id                 PK  bigint
  nombre                 varchar
  descripcion            text
  categoria_id       FK  bigint  -> Categoria.id
  tamanio_envio          enum(CHICO,MEDIANO,GRANDE)
}
ProductoSucursal {
  producto_id        PK,FK  bigint  -> Producto.id
  sucursal_id        PK,FK  bigint  -> Sucursal.id
  precio                 decimal(10,2)
  stock                  int
  fecha_ultima_actualizacion  datetime
}
ParametroLogistico {
  tamanio_envio      PK  enum(CHICO,MEDIANO,GRANDE)
  p0, k                  decimal
}
CoeficienteDistancia {
  id                 PK  bigint
  tamanio_envio          enum(CHICO,MEDIANO,GRANDE)
  distancia_min, distancia_max  decimal
  coeficiente            decimal
}
ListaDeCompras {
  id                 PK  bigint
  cliente_id         FK  bigint  -> Cliente.usuario_id
  nombre                 varchar
  fecha_creacion         datetime
}
ItemLista {
  lista_id           PK,FK  bigint  -> ListaDeCompras.id
  producto_id        PK,FK  bigint  -> Producto.id
  cantidad               int
}
Carrito {
  id                 PK  bigint
  cliente_id         FK  bigint  -> Cliente.usuario_id
  preferencia_faltantes  enum(EXCLUIR,SUSTITUIR,DESCARTAR_UMBRAL)
}
ItemCarrito {
  carrito_id         PK,FK  bigint  -> Carrito.id
  producto_id        PK,FK  bigint  -> Producto.id
  sucursal_id        FK  bigint  -> Sucursal.id
  cantidad               int
  precio_unitario        decimal(10,2)
}
Pedido {
  id                 PK  bigint
  cliente_id         FK  bigint  -> Cliente.usuario_id
  direccion_entrega_id FK bigint -> Direccion.id
  repartidor_id      FK  bigint  -> Repartidor.usuario_id  (nullable)
  estado                 enum(PENDIENTE,CONFIRMADO,ASIGNADO,EN_CAMINO,ENTREGADO,CANCELADO)
  costo_logistico_recomendado  decimal(10,2)
  costo_logistico_elegido      decimal(10,2)
  fecha_confirmacion     datetime
}
OrdenComercio {
  id                 PK  bigint
  pedido_id          FK  bigint  -> Pedido.id
  sucursal_id        FK  bigint  -> Sucursal.id
  estado                 enum(CONFIRMADO,EN_PREPARACION,LISTO_PARA_RETIRO,RETIRADO)
}
ItemPedido {
  orden_comercio_id  PK,FK  bigint  -> OrdenComercio.id
  producto_id        PK,FK  bigint  -> Producto.id
  cantidad               int
  precio_unitario        decimal(10,2)
}

### Relaciones — in scope del TPI ###

Usuario           ||--||  Cliente                    : "es-un"
Usuario           ||--||  Repartidor                  : "es-un"
Usuario           ||--||  Administrador               : "es-un"
Usuario           ||--||  Supermercado                : "es-un"
Cliente           ||--o{  Direccion                   : "guarda"
Supermercado      ||--o{  Sucursal                    : "opera"
Sucursal          ||--||  ZonaCobertura                : "define"
Sucursal          ||--||  ConfiguracionIntegracion      : "configura"
ConfiguracionIntegracion ||--o{ LogAuditoriaCarga      : "registra"
Categoria         ||--o{  Producto                    : "clasifica"
Producto          ||--o{  ProductoSucursal             : "se-vende-como"
Sucursal          ||--o{  ProductoSucursal             : "publica"
Cliente           ||--o{  ListaDeCompras               : "guarda"
ListaDeCompras    ||--o{  ItemLista                    : "contiene"
ItemLista         }o--||  Producto                    : "referencia"
Cliente           ||--o|  Carrito                     : "tiene-activo"
Carrito           ||--o{  ItemCarrito                  : "contiene"
ItemCarrito       }o--||  Producto                    : "referencia"
ItemCarrito       }o--||  Sucursal                    : "resuelto-en"
Cliente           ||--o{  Pedido                      : "realiza"
Pedido            }o--||  Direccion                   : "entrega-en"
Pedido            }o--o|  Repartidor                  : "asigna"
Pedido            ||--o{  OrdenComercio                : "se-divide-en"
OrdenComercio     }o--||  Sucursal                    : "corresponde-a"
OrdenComercio     ||--o{  ItemPedido                   : "contiene"
ItemPedido        }o--||  Producto                    : "referencia"

### Entidades de backlog — fuera de scope de implementación del TPI ###
### (solo nombre y relación principal, sin atributos) ###

SuscripcionPremium   }o--||  Cliente        : "suscribe"
NivelFidelidad       }o--||  Cliente        : "nivela"
NivelFidelidad       }o--||  Supermercado   : "nivela"
Promocion            }o--||  Sucursal       : "ofrece"
Promocion            }o--o{  Producto       : "aplica-a"
Publicidad           }o--||  Supermercado   : "promociona"
CuponReferido        }o--||  Cliente        : "invitador"
CuponReferido        }o--||  Cliente        : "invitado"
PropinaDigital       }o--||  Pedido         : "asociada-a"
PropinaDigital       }o--||  Repartidor     : "destinada-a"
BonoRepartidor       }o--||  Repartidor     : "premia"
```
