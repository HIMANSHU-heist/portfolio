"use client";
import { useEffect, useState } from "react";

const T = (k: string, l: string, t = "text") => ({ k, l, t });
const SECTIONS: any = {
  settings: { label: "Basic Info", obj: true, fields: [
    T("name", "Name"), T("role", "Role / Tag"), T("title1", "Hero line 1"), T("title2", "Hero line 2 (gradient)"), T("title3", "Hero line 3"),
    T("bio", "Bio", "area"), T("heroImage", "Hero photo", "image"), T("email", "Email"), T("location", "Location"),
    T("aboutTitle", "About title"), T("aboutText", "About text", "area"), T("quote", "Quote", "area"), T("quoteAuthor", "Quote author"),
    T("seoTitle", "SEO title"), T("seoDescription", "SEO description", "area") ] },
  socials: { label: "Social Links", title: "platform", blank: { platform: "", url: "" },
    fields: [T("platform", "Platform (instagram, linkedin, youtube, x, facebook, github, or anything)"), T("url", "Link URL")] },
  journey: { label: "Journey / Experience", title: "title", blank: { label: "", title: "", text: "" },
    fields: [T("label", "Label (e.g. 2025, The Move)"), T("title", "Title"), T("text", "Description", "area")] },
  services: { label: "Services", title: "title", blank: { title: "", text: "" }, fields: [T("title", "Title"), T("text", "Description", "area")] },
  stats: { label: "Achievements", title: "label", blank: { value: "", label: "", sub: "" },
    fields: [T("value", "Number (e.g. 11,000+)"), T("label", "Label"), T("sub", "Sub text")] },
  creators: { label: "Creators", title: "name", blank: { name: "", role: "", image: "" }, fields: [T("name", "Name"), T("role", "Role"), T("image", "Photo", "image")] },
  brands: { label: "Brands / Logos", title: "name", blank: { name: "", image: "" }, fields: [T("name", "Name"), T("image", "Logo", "image")] },
  posts: { label: "Blog Posts", title: "title", blank: { title: "", category: "", date: "", excerpt: "", image: "", tags: "", url: "" },
    fields: [T("title", "Title"), T("category", "Category"), T("date", "Date"), T("excerpt", "Excerpt", "area"), T("image", "Cover", "image"), T("tags", "Tags (comma separated)"), T("url", "Link URL")] },
  featured: { label: "Featured On", title: "title", blank: { title: "", source: "", date: "", excerpt: "", image: "", url: "" },
    fields: [T("title", "Title"), T("source", "Show / Channel"), T("date", "Date"), T("excerpt", "Description", "area"), T("image", "Thumbnail", "image"), T("url", "Video / Link URL")] },
};

async function shrink(file: File): Promise<File> {
  if (file.type === "image/gif") return file;
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, 1200 / Math.max(bmp.width, bmp.height));
  const cv = document.createElement("canvas");
  cv.width = Math.round(bmp.width * k); cv.height = Math.round(bmp.height * k);
  cv.getContext("2d")!.drawImage(bmp, 0, 0, cv.width, cv.height);
  let q = 0.85; let blob: Blob | null = null;
  for (let i = 0; i < 5; i++) {
    blob = await new Promise<Blob | null>((r) => cv.toBlob(r, "image/webp", q));
    if (blob && blob.size < 600000) break;
    q -= 0.15;
  }
  return new File([blob as Blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
}
async function upload(file: File) {
  const small = await shrink(file);
  const fd = new FormData(); fd.append("file", small);
  const r = await fetch("/api/upload", { method: "POST", body: fd });
  const j = await r.json(); if (!r.ok) throw new Error(j.error); return j.url as string;
}
const cls = "w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-violet-500";

function Field({ f, v, on }: any) {
  const [busy, setBusy] = useState(false);
  if (f.t === "area") return <label className="block"><span className="text-xs font-semibold text-neutral-600">{f.l}</span><textarea rows={3} className={cls} value={v || ""} onChange={(e) => on(e.target.value)} /></label>;
  if (f.t === "image") return (
    <div><span className="text-xs font-semibold text-neutral-600">{f.l}</span>
      <div className="flex items-center gap-3 mt-1">
        {v ? <img src={v} className="w-14 h-14 rounded-lg object-cover border" /> : <div className="w-14 h-14 rounded-lg bg-neutral-200 grid place-items-center text-xs text-neutral-500">none</div>}
        <label className="px-3 py-2 bg-neutral-900 text-white text-sm rounded-lg cursor-pointer">{busy ? "Uploading..." : "Upload"}
          <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; setBusy(true); try { on(await upload(file)); } catch (er: any) { alert(er.message); } setBusy(false); }} /></label>
        <input className={cls} placeholder="or paste image URL" value={v || ""} onChange={(e) => on(e.target.value)} />
        {v && <button className="text-red-600 text-sm" onClick={() => on("")}>Remove</button>}
      </div>
    </div>);
  return <label className="block"><span className="text-xs font-semibold text-neutral-600">{f.l}</span><input className={cls} value={v || ""} onChange={(e) => on(e.target.value)} /></label>;
}

function ListEditor({ spec, items, onChange }: any) {
  const set = (i: number, k: string, v: any) => onChange(items.map((it: any, j: number) => (j === i ? { ...it, [k]: v } : it)));
  const move = (i: number, d: number) => { const a = [...items]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; onChange(a); };
  return (
    <div className="space-y-4">
      {items.map((it: any, i: number) => (
        <div key={i} className="bg-white rounded-xl border border-neutral-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <b className="text-sm">{i + 1}. {it[spec.title] || "(untitled)"}</b>
            <div className="flex gap-2 text-sm">
              <button onClick={() => move(i, -1)} className="px-2 py-1 bg-neutral-100 rounded">↑</button>
              <button onClick={() => move(i, 1)} className="px-2 py-1 bg-neutral-100 rounded">↓</button>
              <button onClick={() => confirm("Delete this item?") && onChange(items.filter((_: any, j: number) => j !== i))} className="px-2 py-1 bg-red-100 text-red-700 rounded">Delete</button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">{spec.fields.map((f: any) => <div key={f.k} className={f.t === "area" || f.t === "image" ? "md:col-span-2" : ""}><Field f={f} v={it[f.k]} on={(v: any) => set(i, f.k, v)} /></div>)}</div>
        </div>
      ))}
      <button onClick={() => onChange([...items, { ...spec.blank }])} className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold">+ Add new</button>
    </div>
  );
}

function Messages() {
  const [m, setM] = useState<any[]>([]);
  const load = () => fetch("/api/contact").then((r) => r.json()).then(setM);
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-3">
      {!m.length && <p className="text-neutral-500">No messages yet.</p>}
      {m.map((x) => (
        <div key={x.id} className="bg-white border rounded-xl p-4">
          <div className="flex justify-between"><b>{x.name} <a className="text-violet-600 font-normal text-sm" href={"mailto:" + x.email}>{x.email}</a></b>
            <button className="text-red-600 text-sm" onClick={async () => { await fetch("/api/contact?id=" + x.id, { method: "DELETE" }); load(); }}>Delete</button></div>
          <p className="text-xs text-neutral-500">{new Date(x.at).toLocaleString()} · {x.subject}</p>
          <p className="text-sm mt-2 whitespace-pre-wrap">{x.message}</p>
        </div>
      ))}
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");
  const [c, setC] = useState<any>(null);
  const [tab, setTab] = useState("settings");
  const [msg, setMsg] = useState("");
  useEffect(() => { fetch("/api/login").then((r) => r.json()).then((j) => setAuthed(j.ok)); }, []);
  useEffect(() => { if (authed) fetch("/api/content").then((r) => r.json()).then(setC); }, [authed]);

  const login = async () => { const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) }); if (r.ok) setAuthed(true); else alert("Wrong password"); };
  const save = async () => { setMsg("Saving..."); const r = await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c) }); setMsg(r.ok ? "Saved ✓ (site updated)" : "Save failed"); setTimeout(() => setMsg(""), 2500); };

  if (authed === null) return <div className="min-h-screen bg-neutral-100 text-neutral-900 p-10">Loading...</div>;
  if (!authed) return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 grid place-items-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-extrabold">Admin Login</h1>
        <input type="password" className={cls} placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} />
        <button onClick={login} className="w-full py-2.5 bg-neutral-900 text-white rounded-lg font-semibold">Login</button>
      </div>
    </div>);
  if (!c) return <div className="min-h-screen bg-neutral-100 text-neutral-900 p-10">Loading...</div>;

  const tabs = [...Object.keys(SECTIONS), "messages"];
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between gap-3">
        <b>Admin Panel</b>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-emerald-600">{msg}</span>
          <a href="/" target="_blank" className="underline">View site</a>
          <button onClick={save} className="px-5 py-2 bg-violet-600 text-white rounded-lg font-semibold">Save</button>
          <button onClick={async () => { await fetch("/api/login", { method: "DELETE" }); setAuthed(false); }} className="text-neutral-500">Logout</button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={"px-4 py-2 rounded-lg text-sm font-semibold " + (tab === t ? "bg-neutral-900 text-white" : "bg-white border")}>{t === "messages" ? "Messages" : SECTIONS[t].label}</button>)}
        </div>
        {tab === "messages" ? <Messages /> : SECTIONS[tab].obj ? (
          <div className="bg-white rounded-xl border p-5 grid md:grid-cols-2 gap-4">
            {SECTIONS[tab].fields.map((f: any) => <div key={f.k} className={f.t === "area" || f.t === "image" ? "md:col-span-2" : ""}><Field f={f} v={c[tab][f.k]} on={(v: any) => setC({ ...c, [tab]: { ...c[tab], [f.k]: v } })} /></div>)}
          </div>
        ) : <ListEditor spec={SECTIONS[tab]} items={c[tab] || []} onChange={(v: any) => setC({ ...c, [tab]: v })} />}
        <p className="text-xs text-neutral-500 mt-6">Edit kelya nantar upar "Save" daba.</p>
      </div>
    </div>
  );
}
