import { NextResponse } from "next/server";
import { isAdmin, makeToken } from "@/lib/auth";
export async function GET() { return NextResponse.json({ ok: await isAdmin() }); }
export async function POST(req: Request) {
  const { password } = await req.json();
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD)
    return NextResponse.json({ ok: false }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin", makeToken(), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 7 * 86400 });
  return res;
}
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin", "", { path: "/", maxAge: 0 });
  return res;
}
