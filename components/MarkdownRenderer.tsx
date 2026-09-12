export default function MarkdownRenderer({ html }: { html: string }) {
  return (
    <article
      className="prose prose-neutral max-w-none dark:prose-invert prose-a:text-blue-600 dark:prose-a:text-blue-400"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
