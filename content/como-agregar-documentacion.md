---
title: "Cómo agregar documentación"
order: 0
---

Esta guía explica cómo sumar nuevos documentos al sitio y qué formato conviene usar para que queden bien integrados (navegación, búsqueda y links cruzados).

## 1. Dónde va cada documento

Todos los documentos viven como archivos `.md` sueltos dentro de la carpeta `content/` del repo. No se soportan subcarpetas por ahora: cada archivo de primer nivel en `content/` se convierte automáticamente en una página, en la ruta `/docs/<nombre-de-archivo>`.

```
content/
├── como-agregar-documentacion.md   ← este archivo
├── propuesta-general.md
├── trabajo-practico-integrador.md
└── mejoras.md
```

**Nombre del archivo:** usá minúsculas, sin espacios ni acentos, separando palabras con guiones (`kebab-case`). Ese nombre es el que va a aparecer en la URL, así que conviene que sea corto y descriptivo (ej. `plan-de-envios.md`, no `Plan de Envíos (v2 final).md`).

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

## 5. Imágenes y archivos adjuntos

Hoy la app solo procesa texto Markdown; no hay un pipeline para PDFs u otros binarios dentro de `content/`. Si necesitás referenciar una imagen:

1. Colocala en `public/` (por ejemplo `public/images/diagrama.png`).
2. Referenciala en el Markdown con una ruta absoluta: `![Diagrama](/images/diagrama.png)`.

Para un PDF u otro archivo que no sea Markdown, lo más simple es convertir su contenido relevante a un `.md` nuevo (así queda buscable e integrado a la navegación) en vez de subirlo como adjunto suelto.

## 6. Búsqueda

No hace falta ninguna configuración extra: el buscador indexa automáticamente el título y el texto de **todos** los documentos en `content/` en el momento del build. Con solo agregar el archivo y buildear/deployar de nuevo, el contenido nuevo ya aparece en los resultados de búsqueda.

## 7. Resumen rápido

1. Creá `content/mi-documento.md` con nombre en `kebab-case`.
2. Agregá front-matter con `title` (y `order` si querés fijar su posición).
3. Escribí el contenido en Markdown/GFM, con un `#`/`##` por sección.
4. Para linkear otro doc, usá `[texto](otro-doc.md)` o `[texto](otro-doc.md#seccion)`.
5. Corré `npm run dev` para revisar cómo queda antes de commitear.
