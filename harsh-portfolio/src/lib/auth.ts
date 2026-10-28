import crypto from "crypto";
import { cookies } from "next/headers";
const sign = (v: string) => crypto.createHmac("sha256", process.env.AUTH_SECRET || "dev").update(v).digest("hex");
export const makeToken = () => { const exp = String(Date.now() + 7 * 864e5); return exp + "." + sign(exp); };
export async function isAdmin() {
  const t = (await cookies()).get("admin")?.value;
  if (!t) return false;
  const [exp, sig] = t.split(".");
  return !!sig && sig === sign(exp) && Number(exp) > Date.now();
}
