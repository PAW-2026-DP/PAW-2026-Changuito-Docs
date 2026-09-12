import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { CONTENT_DIR } from "@/lib/docs";

const CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
};

/** Serves pdf/html files from content/ directly, so doc pages can embed them. */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const relPath = segments.join("/");
  const ext = path.extname(relPath).toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) {
    return new NextResponse("Not found", { status: 404 });
  }

  const resolved = path.normalize(path.join(CONTENT_DIR, relPath));
  if (!resolved.startsWith(CONTENT_DIR) || !fs.existsSync(resolved)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const data = fs.readFileSync(resolved);
  return new NextResponse(data, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
