import path from "path";
import { getImage } from "@/lib/db";
export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  const img = await getImage(path.basename((await params).name));
  if (!img) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(Buffer.from(img.b64, "base64")), {
    headers: { "Content-Type": img.type, "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
