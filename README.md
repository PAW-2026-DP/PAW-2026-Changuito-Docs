# Changuito Docs

Aplicación web (Next.js) que centraliza la documentación del proyecto **Changuito**: permite leer documentos Markdown, PDF y HTML desde el navegador, navegar entre ellos y buscar referencias. Soporta modo oscuro/claro.

## Correr en local

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Agregar un nuevo documento

1. Poné el archivo (`.md`, `.pdf` o `.html`/`.htm`) en `content/`.
2. Para Markdown, opcionalmente agregale front-matter para controlar el título y el orden en el índice:

   ```md
   ---
   title: "Mi Documento"
   order: 4
   ---

   # Contenido...
   ```

   Si no hay `title`, se usa el primer `# Heading` del archivo (o el `<title>` para HTML), y si tampoco hay, el nombre del archivo.
3. Los links relativos entre documentos (`[texto](otro-doc.md)`, `.pdf` o `.html`) se resuelven automáticamente a `/docs/otro-doc`.

Ver `content/como-agregar-documentacion.md` (disponible también en el sitio) para la guía completa.

## Referencias privadas (`private-context/`)

Apuntes crudos, borradores o material que se usa como insumo para redactar documentación (por ejemplo, contexto para que una IA genere o actualice un doc) van en `private-context/`, en la raíz del repo — **no** en `content/`. La app nunca lee esa carpeta: no genera páginas, no aparece en el sidebar ni en la búsqueda. Es solo almacenamiento versionado en el repo (que ya es privado), separado de lo que se publica en el sitio.

## Cómo funciona

- `lib/docs.ts`: lee `content/*.{md,pdf,html}`, arma metadata (título, orden, tipo) y expone el índice de navegación.
- `lib/markdown.ts`: pipeline remark/rehype que convierte Markdown a HTML, agrega anchors a los headings (`rehype-slug`) y reescribe links `.md`/`.pdf`/`.html` a rutas internas.
- `app/content/[...path]/route.ts`: sirve los archivos `.pdf`/`.html` de `content/` con el `Content-Type` correcto, para embeberlos en un `<iframe>`.
- `components/PdfViewer.tsx` / `components/HtmlViewer.tsx`: visores embebidos para PDF y HTML (el HTML se sandboxea para aislar sus estilos/scripts).
- `lib/search.ts` + `components/SearchBar.tsx`: extraen texto plano de cada doc en build-time (Markdown y HTML; solo el título en el caso de PDF) y arman un índice [FlexSearch](https://github.com/nextapps-de/flexsearch) en el cliente para búsqueda instantánea.
- `components/Sidebar.tsx`: navegación lateral (colapsable en mobile) con todos los documentos.
- `components/ThemeToggle.tsx`: toggle de modo oscuro/claro persistido en `localStorage`, con detección de la preferencia del sistema y sin flash de tema incorrecto al cargar.
- `app/docs/[slug]/page.tsx`: renderiza cada documento según su tipo (Markdown, PDF o HTML).

## Deploy

Proyecto estándar de Next.js (App Router), listo para desplegar en [Vercel](https://vercel.com/new) u otro hosting compatible (`npm run build && npm start`).
