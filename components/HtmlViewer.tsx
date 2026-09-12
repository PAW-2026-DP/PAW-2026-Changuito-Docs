export default function HtmlViewer({ file, title }: { file: string; title: string }) {
  const src = `/content/${encodeURIComponent(file)}`;

  return (
    <div className="flex flex-col gap-3">
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start text-sm text-blue-600 underline hover:no-underline dark:text-blue-400"
      >
        Abrir en una pestaña nueva
      </a>
      {/*
        Sandboxed but scripts allowed: docs like slide decks rely on JS to
        show/hide content. Content in content/ is authored by the project
        team, not arbitrary user input, so allow-scripts is an acceptable
        trade-off here — it still isolates the doc's own styles/globals
        from the rest of the app.
      */}
      <iframe
        src={src}
        title={title}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        className="h-[80vh] w-full rounded border border-neutral-200 bg-white dark:border-neutral-800"
      />
    </div>
  );
}
