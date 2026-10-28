import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { seed } from "./seed";

function init() {
  if (!getApps().length) {
    const sa = JSON.parse(Buffer.from(process.env.FIREBASE_SA_B64 || "", "base64").toString("utf8"));
    initializeApp({ credential: cert(sa), projectId: process.env.FIREBASE_PROJECT_ID });
  }
  return getFirestore();
}
const db = () => init();

export async function getContent() {
  const ref = db().collection("site").doc("content");
  const snap = await ref.get();
  if (!snap.exists) { await ref.set(seed); return seed as any; }
  return { ...seed, ...(snap.data() as any) };
}
export const saveContent = (c: any) => db().collection("site").doc("content").set(c);

export async function listMessages() {
  const s = await db().collection("messages").orderBy("id", "desc").limit(300).get();
  return s.docs.map((d) => d.data());
}
export const addMessage = (m: any) => db().collection("messages").doc(String(m.id)).set(m);
export const deleteMessage = (id: number) => db().collection("messages").doc(String(id)).delete();

export const saveImage = (name: string, type: string, b64: string) => db().collection("images").doc(name).set({ type, b64 });
export async function getImage(name: string) {
  const s = await db().collection("images").doc(name).get();
  return s.exists ? (s.data() as { type: string; b64: string }) : null;
}
