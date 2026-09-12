"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import FlexSearch from "flexsearch";
import type { SearchDoc } from "@/lib/search";

type Result = {
  slug: string;
  title: string;
  snippet: string;
};

function buildSnippet(text: string, query: string, radius = 60): string {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text.slice(0, radius * 2) + "…";
  const start = Math.max(0, idx - radius);
  const end = Math.min(text.length, idx + query.length + radius);
  return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;
}

export default function SearchBar({ docs }: { docs: SearchDoc[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const index = useMemo(() => {
    const idx = new FlexSearch.Document<SearchDoc>({
      document: {
        id: "slug",
        index: ["title", "text"],
        store: true,
      },
      tokenize: "forward",
    });
    for (const doc of docs) idx.add(doc);
    return idx;
  }, [docs]);

  const results: Result[] = useMemo(() => {
    if (!query.trim()) return [];
    const found = index.search(query, 8, { enrich: true });
    const bySlug = new Map<string, Result>();
    for (const field of found) {
      for (const hit of field.result) {
        const doc = hit.doc as SearchDoc | undefined;
        if (!doc || bySlug.has(doc.slug)) continue;
        bySlug.set(doc.slug, {
          slug: doc.slug,
          title: doc.title,
          snippet: buildSnippet(doc.text, query),
        });
      }
    }
    return Array.from(bySlug.values());
  }, [index, query]);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Buscar en la documentación…"
        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
          {results.map((r) => (
            <li key={r.slug}>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
                onClick={() => {
                  router.push(`/docs/${r.slug}`);
                  setQuery("");
                  setOpen(false);
                }}
              >
                <div className="font-medium">{r.title}</div>
                <div className="truncate text-xs text-neutral-500">{r.snippet}</div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
