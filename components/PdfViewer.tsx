export default function PdfViewer({ file, title }: { file: string; title: string }) {
  const src = `/content/${encodeURIComponent(file)}`;

  return (
    <div className="flex flex-col gap-3">
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start text-sm text-blue-600 underline hover:no-underline dark:text-blue-400"
      >
        Abrir en una pestaña nueva / descargar
      </a>
      <iframe
        src={src}
        title={title}
        className="h-[80vh] w-full rounded border border-neutral-200 dark:border-neutral-800"
      />
    </div>
  );
}
