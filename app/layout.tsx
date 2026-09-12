import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import { getAllDocsMeta } from "@/lib/docs";
import { getSearchDocs } from "@/lib/search";

export const metadata: Metadata = {
  title: "Changuito Docs",
  description: "Documentación centralizada del proyecto Changuito",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const docs = getAllDocsMeta();
  const searchDocs = getSearchDocs();

  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <header className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a href="/" className="text-lg font-semibold">
              Changuito Docs
            </a>
            <SearchBar docs={searchDocs} />
          </div>
        </header>
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-6 md:flex-row">
          <Sidebar docs={docs} />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
