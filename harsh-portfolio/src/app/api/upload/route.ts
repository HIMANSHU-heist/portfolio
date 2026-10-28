import { NextResponse } from "next/server";
import path from "path";
import { isAdmin } from "@/lib/auth";
import { saveImage } from "@/lib/db";
export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const file = (await req.formData()).get("file") as File | null;
  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 });
  if (!/\.(png|jpe?g|webp|gif|avif)$/i.test(file.name)) return NextResponse.json({ error: "Only images" }, { status: 400 });
  if (file.size > 900000) return NextResponse.json({ error: "Image too big even after compression. Use a smaller image." }, { status: 400 });
  const name = Date.now() + "-" + path.basename(file.name).replace(/[^a-zA-Z0-9.]/g, "_");
  await saveImage(name, file.type || "image/webp", Buffer.from(await file.arrayBuffer()).toString("base64"));
  return NextResponse.json({ url: "/api/file/" + name });
}
