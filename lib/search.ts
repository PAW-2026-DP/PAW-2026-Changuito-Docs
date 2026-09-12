import { getAllDocs } from "./docs";

export type SearchDoc = {
  slug: string;
  title: string;
  text: string;
};

/** Plain-text snapshot of every doc for building a client-side search index. */
export function getSearchDocs(): SearchDoc[] {
  return getAllDocs().map((doc) => ({
    slug: doc.slug,
    title: doc.title,
    text: doc.content
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/[#>*_`~-]/g, " ")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\s+/g, " ")
      .trim(),
  }));
}
