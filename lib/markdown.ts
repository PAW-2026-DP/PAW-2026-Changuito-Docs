import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

/** Rewrites relative .md links (e.g. "./otro-doc.md#seccion") to app routes ("/docs/otro-doc#seccion"). */
function rehypeRewriteMdLinks() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "a" || !node.properties?.href) return;
      const href = String(node.properties.href);
      if (/^(https?:)?\/\//.test(href) || href.startsWith("mailto:")) return;

      const match = href.match(/^\.?\/?([^#]+)\.md(#.*)?$/);
      if (match) {
        const [, slug, hash = ""] = match;
        node.properties.href = `/docs/${slug}${hash}`;
      }
    });
  };
}

export async function renderMarkdown(source: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypeRewriteMdLinks)
    .use(rehypeStringify)
    .process(source);

  return String(file);
}
