import { NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json(await getContent()); }
export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body || typeof body !== "object") return NextResponse.json({ error: "bad" }, { status: 400 });
  await saveContent(body);
  return NextResponse.json({ ok: true });
}
