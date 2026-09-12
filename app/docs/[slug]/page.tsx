import { notFound } from "next/navigation";
import { getAllSlugs, getDocBySlug } from "@/lib/docs";
import { renderMarkdown } from "@/lib/markdown";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import PdfViewer from "@/components/PdfViewer";
import HtmlViewer from "@/components/HtmlViewer";

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

  if (doc.type === "pdf") {
    return (
      <>
        <h1 className="mb-4 text-2xl font-semibold">{doc.title}</h1>
        <PdfViewer file={doc.file} title={doc.title} />
      </>
    );
  }

  if (doc.type === "html") {
    return (
      <>
        <h1 className="mb-4 text-2xl font-semibold">{doc.title}</h1>
        <HtmlViewer file={doc.file} title={doc.title} />
      </>
    );
  }

  const html = await renderMarkdown(doc.content);

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">{doc.title}</h1>
      <MarkdownRenderer html={html} />
    </>
  );
}
