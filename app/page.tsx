import Link from "next/link";
import { getAllDocsMeta } from "@/lib/docs";

export default function HomePage() {
  const docs = getAllDocsMeta();

  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert">
      <h1>Documentación de Changuito</h1>
      <p>
        Este sitio centraliza la documentación del proyecto: propuestas, decisiones de
        producto y el enunciado del Trabajo Práctico Integrador. Usá el índice de la
        izquierda o el buscador de arriba para navegar.
      </p>
      <ul>
        {docs.map((doc) => (
          <li key={doc.slug}>
            <Link href={`/docs/${doc.slug}`}>{doc.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
