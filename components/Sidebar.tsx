"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { DocMeta } from "@/lib/docs";

export default function Sidebar({ docs }: { docs: DocMeta[] }) {
  const pathname = usePathname();
  const [openMobile, setOpenMobile] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1">
      <Link
        href="/"
        className={`rounded px-2 py-1.5 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
          pathname === "/" ? "bg-neutral-100 dark:bg-neutral-800" : ""
        }`}
      >
        Inicio
      </Link>
      {docs.map((doc) => {
        const href = `/docs/${doc.slug}`;
        const active = pathname === href;
        return (
          <Link
            key={doc.slug}
            href={href}
            className={`flex items-center justify-between gap-2 rounded px-2 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
              active ? "bg-neutral-100 font-medium dark:bg-neutral-800" : ""
            }`}
          >
            <span className="truncate">{doc.title}</span>
            {doc.type !== "markdown" && (
              <span className="shrink-0 rounded bg-neutral-200 px-1.5 py-0.5 text-[10px] font-medium uppercase text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
                {doc.type}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenMobile((v) => !v)}
        className="mb-2 rounded border border-neutral-300 px-2 py-1 text-sm md:hidden dark:border-neutral-700"
      >
        {openMobile ? "Cerrar índice" : "Ver índice"}
      </button>
      <aside
        className={`${
          openMobile ? "block" : "hidden"
        } w-full shrink-0 border-neutral-200 pb-4 md:block md:w-56 md:border-r md:pr-4 md:pb-0 dark:border-neutral-800`}
      >
        {nav}
      </aside>
    </>
  );
}
