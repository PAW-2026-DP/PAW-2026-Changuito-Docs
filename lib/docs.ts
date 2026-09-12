import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const CONTENT_DIR = path.join(process.cwd(), "content");

export type DocMeta = {
  slug: string;
  title: string;
  order: number;
};

export type Doc = DocMeta & {
  content: string;
};

function titleFromContent(raw: string, fallback: string): string {
  const match = raw.match(/^#\s+(.+)$/m);
  if (match) return match[1].replace(/\*/g, "").trim();
  return fallback;
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getDocBySlug(slug: string): Doc {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? titleFromContent(content, slug),
    order: typeof data.order === "number" ? data.order : 999,
    content,
  };
}

export function getAllDocs(): Doc[] {
  return getAllSlugs()
    .map(getDocBySlug)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getAllDocsMeta(): DocMeta[] {
  return getAllDocs().map(({ slug, title, order }) => ({ slug, title, order }));
}
