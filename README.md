# Changuito Docs

Aplicación web (Next.js) que centraliza la documentación del proyecto **Changuito**: permite leer los documentos Markdown desde el navegador, navegar entre ellos y buscar referencias.

## Correr en local

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Agregar un nuevo documento

1. Poné el archivo `.md` en `content/`.
2. (Opcional) agregale front-matter para controlar el título y el orden en el índice:

   ```md
   ---
   title: "Mi Documento"
   order: 4
   ---

   # Contenido...
   ```

   Si no hay `title`, se usa el primer `# Heading` del archivo o el nombre del archivo.
3. Los links relativos entre documentos (`[texto](otro-doc.md)`) se resuelven automáticamente a `/docs/otro-doc`.

## Cómo funciona

- `lib/docs.ts`: lee `content/*.md`, arma metadata (título, orden) y expone el índice de navegación.
- `lib/markdown.ts`: pipeline remark/rehype que convierte Markdown a HTML, agrega anchors a los headings (`rehype-slug`) y reescribe links `.md` a rutas internas.
- `lib/search.ts` + `components/SearchBar.tsx`: extraen texto plano de cada doc en build-time y arman un índice [FlexSearch](https://github.com/nextapps-de/flexsearch) en el cliente para búsqueda instantánea.
- `components/Sidebar.tsx`: navegación lateral (colapsable en mobile) con todos los documentos.
- `app/docs/[slug]/page.tsx`: renderiza cada documento como página estática.

## Deploy

Proyecto estándar de Next.js (App Router), listo para desplegar en [Vercel](https://vercel.com/new) u otro hosting compatible (`npm run build && npm start`).
