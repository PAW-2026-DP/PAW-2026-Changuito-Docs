---
title: "Alcance propuesto para la 3ra Entrega"
order: 5
---

# Alcance propuesto para la 3ra Entrega

La consigna establece que la tercera entrega consiste en la implementación y despliegue de *"un conjunto de funcionalidades mínimo (end-to-end) a convenir con los docentes en la segunda entrega"*. Este documento es esa propuesta, para acordarla ahora.

El criterio de selección fue elegir **un único recorrido completo que atraviese todas las capas** —interfaz, API, reglas de negocio y base de datos— en lugar de muchas pantallas resueltas a medias. La propuesta es deliberadamente conservadora: se compromete el mínimo que demuestra el sistema funcionando de punta a punta, y todo lo demás queda como ampliación.

---

## 1. Recorrido comprometido

El hilo que se implementa es el del **cliente**, desde que se registra hasta que su pedido queda confirmado y consultable:

| # | Funcionalidad | Qué demuestra |
| :---- | :---- | :---- |
| 1 | Registro, login y cierre de sesión de cliente | Persistencia de usuarios, contraseñas hasheadas, sesión y control de acceso por rol |
| 2 | Búsqueda de productos y ficha con precios por sucursal | Consulta del catálogo sobre `Producto` y `ProductoSucursal` |
| 3 | Armado de una lista de compras: agregar, quitar y ajustar cantidades | `ListaDeCompras` e `ItemLista` |
| 4 | Ejecución del optimizador sobre esa lista | El diferencial del proyecto: comparación entre sucursales y cálculo del costo logístico |
| 5 | Confirmación del pedido | Congelamiento de precios y escritura transaccional de `Pedido`, `OrdenComercio` e `ItemPedido` |
| 6 | Listado y detalle de "Mis pedidos" con su estado | Cierre del circuito: el cliente ve el resultado de lo que hizo |
| 7 | Despliegue público y funcionando | Requisito explícito de la entrega |

Con esos siete puntos, un pedido nace en el navegador, pasa por la API, se resuelve contra la base y vuelve a la pantalla. Es el mínimo que se puede llamar *end-to-end*.

## 2. Supuestos y simplificaciones de esta etapa

Para que el recorrido sea alcanzable en el tiempo disponible, en la tercera entrega:

- El catálogo de prueba se carga por script SQL. La carga por planilla y la integración con el ERP quedan para más adelante.
- El optimizador se limita a comparar **uno o dos comercios**, que ya es el alcance definido en la propuesta general. La fórmula de costo logístico es la ya especificada.
- Se implementa el rol **cliente**. Los usuarios de otros roles existen en la base pero sus paneles todavía no.
- El pago es contra entrega, como ya estaba decidido: no hay pasarela de pago.

## 3. Si el tiempo alcanza

Estas funcionalidades no se comprometen para el 19/10. Si el equipo llega, se suman; si no, pasan a la cuarta entrega:

- Bandeja de pedidos del supermercado, con cambio de estado de preparación.
- Guardado y reutilización de listas frecuentes.
- Alta de varias direcciones de entrega por cliente.

## 4. Previsto para la 4ta Entrega

- Panel de repartidor completo: tareas asignadas, registro de retiro y confirmación de entrega.
- Panel de administración: comercios, sucursales y zonas de cobertura.
- Panel de supermercado: ABM de catálogo, precios y stock.
- Carga de catálogo por planilla.

## 5. Fuera del alcance del Trabajo Práctico

Sin cambios respecto de lo ya definido en la [propuesta general](propuesta-general.md): programa de beneficios e incentivos, suscripción Premium como pago real, publicidad, reportes y analítica avanzada.

---

> **A convenir con la cátedra:** esta propuesta queda sujeta a la conformidad del equipo docente. Si se considera insuficiente o mal recortada, el equipo la ajusta antes de comenzar la implementación.
