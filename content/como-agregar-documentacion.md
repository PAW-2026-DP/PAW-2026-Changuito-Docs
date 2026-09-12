---
title: "Cómo agregar documentación"
order: 0
---

Esta guía explica cómo sumar nuevos documentos al sitio y qué formato conviene usar para que queden bien integrados (navegación, búsqueda y links cruzados).

## 1. Dónde va cada documento

Todos los documentos viven como archivos sueltos dentro de la carpeta `content/` del repo. No se soportan subcarpetas por ahora: cada archivo de primer nivel en `content/` se convierte automáticamente en una página, en la ruta `/docs/<nombre-de-archivo>`. Se soportan tres formatos: **Markdown** (`.md`), **PDF** (`.pdf`) y **HTML** (`.html`/`.htm`) — ver la sección 5.

```
content/
├── como-agregar-documentacion.md   ← este archivo
├── propuesta-general.md
├── trabajo-practico-integrador.md
├── funcion-precio-envio.pdf
└── modelo-de-negocio-slides.html
```

**Nombre del archivo:** usá minúsculas, sin espacios ni acentos, separando palabras con guiones (`kebab-case`). Ese nombre es el que va a aparecer en la URL, así que conviene que sea corto y descriptivo (ej. `plan-de-envios.md`, no `Plan de Envíos (v2 final).md`).

**Importante:** todo lo que pongas en `content/` es público para cualquiera con acceso al sitio. Apuntes crudos, borradores o material que solo sirve como insumo interno (por ejemplo, para generar documentación con una IA) van en `private-context/`, no en `content/` — ver la sección 9.

## 2. Front-matter (metadata del documento)

Al principio del archivo podés agregar un bloque de *front-matter* entre `---` para controlar cómo se muestra en el índice:

```md
---
title: "Nombre legible del documento"
order: 5
---

# Acá arranca el contenido...
```

- **`title`**: texto que se muestra en el sidebar y como encabezado de la página. Si no lo definís, se usa el primer `# Título` del archivo, y si tampoco hay uno, el nombre del archivo.
- **`order`**: número que define la posición en el índice (menor = más arriba). Los documentos sin `order` van al final, ordenados alfabéticamente por título.

El front-matter es opcional, pero se recomienda siempre poner `title` para que el nombre en el sidebar no dependa de que el `.md` tenga o no un `# Heading` prolijo.

## 3. Formato del contenido

El contenido es Markdown estándar con soporte GFM (GitHub Flavored Markdown), así que podés usar:

- Encabezados (`#`, `##`, `###`, ...) — cada uno genera automáticamente un ancla para poder linkearlo directamente.
- Listas, listas numeradas y listas de tareas (`- [ ] pendiente`, `- [x] hecho`).
- **Negrita**, *cursiva*, ~~tachado~~.
- Tablas (formato Markdown estándar con `|`).
- Bloques de código con tres backticks.
- Citas (`> texto`).

Usá un único `# Título` al inicio a modo de encabezado principal (o dejá que lo resuelva el `title` del front-matter) y organizá el resto con `##`/`###` — así la navegación por anclas queda prolija.

## 4. Links entre documentos

Para linkear a otro documento del sitio, usá una ruta relativa al archivo `.md`, tal como lo verías en el repo:

```md
Ver la propuesta completa en [Propuesta General](propuesta-general.md).

También podés apuntar a una sección puntual:
[Modelo de fees](propuesta-general.md#modelo-de-fees).
```

La app reescribe automáticamente esos links `.md` a la ruta interna correcta (`/docs/propuesta-general`), así que **no** hace falta escribir `/docs/...` a mano. Los links externos (`https://...`) y `mailto:` se dejan tal cual.

El ancla de una sección (`#modelo-de-fees`) se genera a partir del texto del heading, en minúsculas y con guiones en vez de espacios — igual que en GitHub.

## 5. Documentos en PDF o HTML

Además de Markdown, podés dejar directamente un `.pdf` o un `.html`/`.htm` en `content/` y la app le crea página propia (`/docs/<nombre-de-archivo>`), lo suma al índice y lo embebe en un visor:

- **PDF**: se muestra en un visor embebido (`<iframe>`) a pantalla completa, con un link para abrirlo en una pestaña nueva o descargarlo. El título en el índice sale del nombre de archivo (ej. `funcion-precio-envio.pdf` → "Funcion Precio Envio"), así que convine usar un nombre descriptivo.
- **HTML**: se sirve dentro de un `<iframe>` aislado (`sandbox`), para que sus propios estilos/scripts no choquen con los del sitio. El título se toma del `<title>` del documento si lo tiene; si no, del nombre de archivo.

En ambos casos podés linkear a ellos desde un doc Markdown igual que a otro `.md`:

```md
Ver el detalle en [Función de precio de envío](funcion-precio-envio.pdf).
```

**Limitación de búsqueda:** el buscador indexa el texto completo de los Markdown y HTML, pero de los PDF solo indexa el **título** (no hay extracción de texto del PDF todavía). Si necesitás que el contenido de un PDF sea buscable palabra por palabra, la alternativa es pasar ese contenido a un `.md`.

## 6. Búsqueda

No hace falta ninguna configuración extra: el buscador indexa automáticamente el título y el texto de todos los documentos en `content/` en el momento del build (con la salvedad de los PDF explicada arriba). Con solo agregar el archivo y buildear/deployar de nuevo, el contenido nuevo ya aparece en los resultados de búsqueda.

## 7. Modo oscuro / claro

El botón de tema (arriba a la derecha, junto al buscador) alterna entre modo claro y oscuro y guarda la preferencia del usuario en el navegador (`localStorage`). Si el visitante nunca lo tocó, la app respeta el tema del sistema operativo. No requiere ninguna acción al agregar documentos: todos los estilos (`prose`, sidebar, buscador) ya soportan ambos modos.

## 9. Referencias privadas (`private-context/`)

No todo lo que se escribe es documentación terminada. Notas sueltas, apuntes de una reunión, borradores o material que le damos de contexto a una IA para redactar o actualizar un documento van en la carpeta `private-context/`, en la raíz del repo (al lado de `content/`, no adentro).

- La app **nunca** lee `private-context/`: no genera páginas, no aparece en el sidebar, no se indexa en la búsqueda. Es simple almacenamiento en el repo, no documentación publicada.
- No tiene convenciones de formato ni front-matter — es una carpeta de trabajo, no algo que se renderiza.
- Un ejemplo real: `private-context/mejoras.md` son los apuntes crudos que se usaron para escribir la sección de modelo de negocio de `content/propuesta-general.md`.
- Si un apunte de ahí termina consolidado en un doc público, podés dejarlo igual como registro de la fuente.

## 10. Resumen rápido

1. ¿Es documentación terminada para cualquiera con acceso al sitio? Va en `content/mi-documento.<md|pdf|html>`, con nombre en `kebab-case`. ¿Es un apunte crudo o contexto interno? Va en `private-context/`.
2. Si es Markdown en `content/`, agregá front-matter con `title` (y `order` si querés fijar su posición).
3. Escribí el contenido en Markdown/GFM, con un `#`/`##` por sección — o dejá el PDF/HTML tal cual.
4. Para linkear otro doc, usá `[texto](otro-doc.md)`, `[texto](otro-doc.pdf)` o `[texto](otro-doc.html)`.
5. Corré `npm run dev` para revisar cómo queda antes de commitear.
