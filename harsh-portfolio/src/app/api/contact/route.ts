import { NextResponse } from "next/server";
import { listMessages, addMessage, deleteMessage } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
export const dynamic = "force-dynamic";
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await listMessages());
}
export async function POST(req: Request) {
  const b = await req.json();
  const clean = (s: any, n: number) => String(s || "").slice(0, n);
  if (!b.name || !b.email || !b.message) return NextResponse.json({ error: "missing" }, { status: 400 });
  await addMessage({ id: Date.now(), name: clean(b.name, 100), email: clean(b.email, 150), subject: clean(b.subject, 200), message: clean(b.message, 3000), at: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await deleteMessage(Number(new URL(req.url).searchParams.get("id")));
  return NextResponse.json({ ok: true });
}
