import { notFound } from "next/navigation";
import { getAllSlugs, getDocBySlug } from "@/lib/docs";
import { renderMarkdown } from "@/lib/markdown";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let doc;
  try {
    doc = getDocBySlug(slug);
  } catch {
    notFound();
  }

  const html = await renderMarkdown(doc.content);

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">{doc.title}</h1>
      <MarkdownRenderer html={html} />
    </>
  );
}
