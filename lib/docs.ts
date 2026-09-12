import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const CONTENT_DIR = path.join(process.cwd(), "content");

export type DocType = "markdown" | "pdf" | "html";

const EXT_TO_TYPE: Record<string, DocType> = {
  ".md": "markdown",
  ".pdf": "pdf",
  ".html": "html",
  ".htm": "html",
};

export type DocMeta = {
  slug: string;
  title: string;
  order: number;
  type: DocType;
};

export type Doc = DocMeta & {
  /** Markdown source for "markdown" docs, raw HTML for "html" docs, empty for "pdf" docs. */
  content: string;
  /** Filename inside content/, used to build the /content/<file> asset URL for pdf/html docs. */
  file: string;
};

type FileEntry = {
  slug: string;
  file: string;
  type: DocType;
};

function listContentFiles(): FileEntry[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .map((file) => {
      const ext = path.extname(file).toLowerCase();
      const type = EXT_TO_TYPE[ext];
      if (!type) return null;
      return { slug: file.slice(0, -ext.length), file, type };
    })
    .filter((f): f is FileEntry => f !== null);
}

function titleFromContent(raw: string, fallback: string): string {
  const match = raw.match(/^#\s+(.+)$/m);
  if (match) return match[1].replace(/\*/g, "").trim();
  return fallback;
}

function titleFromHtml(raw: string, fallback: string): string {
  const match = raw.match(/<title>([^<]*)<\/title>/i);
  return match ? match[1].trim() : fallback;
}

function titleFromFilename(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getAllSlugs(): string[] {
  return listContentFiles().map((f) => f.slug);
}

export function getDocBySlug(slug: string): Doc {
  const entry = listContentFiles().find((f) => f.slug === slug);
  if (!entry) throw new Error(`Doc not found: ${slug}`);

  const filePath = path.join(CONTENT_DIR, entry.file);
  const fallbackTitle = titleFromFilename(slug);

  if (entry.type === "markdown") {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    return {
      slug,
      file: entry.file,
      type: "markdown",
      title: data.title ?? titleFromContent(content, fallbackTitle),
      order: typeof data.order === "number" ? data.order : 999,
      content,
    };
  }

  if (entry.type === "html") {
    const raw = fs.readFileSync(filePath, "utf-8");
    return {
      slug,
      file: entry.file,
      type: "html",
      title: titleFromHtml(raw, fallbackTitle),
      order: 999,
      content: raw,
    };
  }

  return {
    slug,
    file: entry.file,
    type: "pdf",
    title: fallbackTitle,
    order: 999,
    content: "",
  };
}

export function getAllDocs(): Doc[] {
  return getAllSlugs()
    .map(getDocBySlug)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getAllDocsMeta(): DocMeta[] {
  return getAllDocs().map(({ slug, title, order, type }) => ({ slug, title, order, type }));
}
