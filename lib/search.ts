import { getAllDocs } from "./docs";

export type SearchDoc = {
  slug: string;
  title: string;
  text: string;
};

function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`~-]/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Plain-text snapshot of every doc for building a client-side search index. */
export function getSearchDocs(): SearchDoc[] {
  return getAllDocs().map((doc) => {
    let text: string;
    switch (doc.type) {
      case "markdown":
        text = markdownToPlainText(doc.content);
        break;
      case "html":
        text = htmlToPlainText(doc.content);
        break;
      case "pdf":
        // No text extraction for PDFs yet; only the title is searchable.
        text = "";
        break;
    }
    return { slug: doc.slug, title: doc.title, text };
  });
}
