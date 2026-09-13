---
title: "Modelo de Objetos"
order: 3
---

# Modelo de Objetos

Diagrama Entidad-Relación consolidado de Changuito (in scope del TPI y backlog de producto).

```mermaid
erDiagram
    Usuario {
        bigint id PK
        varchar email UK
        varchar password_hash
        varchar nombre
        datetime fecha_alta
        boolean activo
    }
    Cliente {
        bigint usuario_id "PK, FK"
        enum preferencia_faltantes_default
    }
    Repartidor {
        bigint usuario_id "PK, FK"
    }
    Administrador {
        bigint usuario_id "PK, FK"
    }
    Supermercado {
        bigint usuario_id "PK, FK"
        varchar razon_social
        varchar cuit
    }
    Direccion {
        bigint id PK
        bigint cliente_id FK
        varchar calle
        varchar numero
        varchar ciudad
        varchar cp
        decimal latitud
        decimal longitud
        boolean es_default
    }
    Sucursal {
        bigint id PK
        bigint supermercado_id FK
        varchar nombre
        varchar direccion
        decimal latitud
        decimal longitud
        boolean activa
    }
    ZonaCobertura {
        bigint sucursal_id "PK, FK"
        decimal radio_min
        decimal radio_max
    }
    ConfiguracionIntegracion {
        bigint sucursal_id "PK, FK"
        enum modalidad
        json mapeo_columnas
        enum estado_habilitacion
        datetime fecha_actualizacion
    }
    LogAuditoriaCarga {
        bigint id PK
        bigint configuracion_id FK
        datetime fecha
        text detalle_cambio
        enum resultado
    }
    Categoria {
        bigint id PK
        varchar nombre
    }
    Producto {
        bigint id PK
        varchar nombre
        text descripcion
        bigint categoria_id FK
        enum tamanio_envio
    }
    ProductoSucursal {
        bigint producto_id "PK, FK"
        bigint sucursal_id "PK, FK"
        decimal precio
        int stock
        datetime fecha_ultima_actualizacion
    }
    ParametroLogistico {
        enum tamanio_envio PK
        decimal p0
        decimal k
    }
    CoeficienteDistancia {
        bigint id PK
        enum tamanio_envio
        decimal distancia_min
        decimal distancia_max
        decimal coeficiente
    }
    ListaDeCompras {
        bigint id PK
        bigint cliente_id FK
        varchar nombre
        datetime fecha_creacion
    }
    ItemLista {
        bigint lista_id "PK, FK"
        bigint producto_id "PK, FK"
        int cantidad
    }
    Carrito {
        bigint id PK
        bigint cliente_id FK
        enum preferencia_faltantes
    }
    ItemCarrito {
        bigint carrito_id "PK, FK"
        bigint producto_id "PK, FK"
        bigint sucursal_id FK
        int cantidad
        decimal precio_unitario
    }
    Pedido {
        bigint id PK
        bigint cliente_id FK
        bigint direccion_entrega_id FK
        bigint repartidor_id FK
        enum estado
        decimal costo_logistico_recomendado
        decimal costo_logistico_elegido
        datetime fecha_confirmacion
    }
    OrdenComercio {
        bigint id PK
        bigint pedido_id FK
        bigint sucursal_id FK
        enum estado
    }
    ItemPedido {
        bigint orden_comercio_id "PK, FK"
        bigint producto_id "PK, FK"
        int cantidad
        decimal precio_unitario
    }

    Usuario ||--|| Cliente : es-un
    Usuario ||--|| Repartidor : es-un
    Usuario ||--|| Administrador : es-un
    Usuario ||--|| Supermercado : es-un
    Cliente ||--o{ Direccion : guarda
    Supermercado ||--o{ Sucursal : opera
    Sucursal ||--|| ZonaCobertura : define
    Sucursal ||--|| ConfiguracionIntegracion : configura
    ConfiguracionIntegracion ||--o{ LogAuditoriaCarga : registra
    Categoria ||--o{ Producto : clasifica
    Producto ||--o{ ProductoSucursal : se-vende-como
    Sucursal ||--o{ ProductoSucursal : publica
    Cliente ||--o{ ListaDeCompras : guarda
    ListaDeCompras ||--o{ ItemLista : contiene
    ItemLista }o--|| Producto : referencia
    Cliente ||--o| Carrito : tiene-activo
    Carrito ||--o{ ItemCarrito : contiene
    ItemCarrito }o--|| Producto : referencia
    ItemCarrito }o--|| Sucursal : resuelto-en
    Cliente ||--o{ Pedido : realiza
    Pedido }o--|| Direccion : entrega-en
    Pedido }o--o| Repartidor : asigna
    Pedido ||--o{ OrdenComercio : se-divide-en
    OrdenComercio }o--|| Sucursal : corresponde-a
    OrdenComercio ||--o{ ItemPedido : contiene
    ItemPedido }o--|| Producto : referencia

    %% Backlog de producto — fuera de scope de implementación del TPI
    SuscripcionPremium }o--|| Cliente : suscribe
    NivelFidelidad }o--|| Cliente : nivela
    NivelFidelidad }o--|| Supermercado : nivela
    Promocion }o--|| Sucursal : ofrece
    Promocion }o--o{ Producto : aplica-a
    Publicidad }o--|| Supermercado : promociona
    CuponReferido }o--|| Cliente : invitador
    CuponReferido }o--|| Cliente : invitado
    PropinaDigital }o--|| Pedido : asociada-a
    PropinaDigital }o--|| Repartidor : destinada-a
    BonoRepartidor }o--|| Repartidor : premia
```

## Diagrama C4

El diagrama C4 completo de Changuito (contexto, contenedores, componentes, objetos y secuencia de checkout) está disponible en el siguiente enlace:

[Diagrama C4 — Changuito](https://drive.google.com/file/d/1O-L8HVnFP8NCRYejGcBwjPALR3OmM801/view?usp=sharing)
