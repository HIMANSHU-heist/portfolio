"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Instagram, Linkedin, Youtube, Twitter, Facebook, Github, Globe, Menu, X, ArrowUpRight, Send, Mail, MapPin } from "lucide-react";

const ICONS: any = { instagram: Instagram, linkedin: Linkedin, youtube: Youtube, twitter: Twitter, x: Twitter, facebook: Facebook, github: Github };
const SocialIcon = ({ p }: { p: string }) => { const I = ICONS[(p || "").toLowerCase()] || Globe; return <I size={18} />; };

function Reveal({ children, className = "", delay = 0, x = 0, y = 30 }: any) {
  return (
    <motion.div className={className} initial={{ opacity: 0, x, y }} whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
function Head({ tag, title, text }: any) {
  return (
    <Reveal className="text-center mb-16">
      <span className="text-xs font-semibold tracking-[0.25em] uppercase text-violet-400">{tag}</span>
      <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-3 mb-4">{title}</h2>
      {text && <p className="text-white/50 max-w-2xl mx-auto leading-relaxed">{text}</p>}
    </Reveal>
  );
}
function Spot({ children, className = "" }: any) {
  return (
    <div onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--x", e.clientX - r.left + "px"); e.currentTarget.style.setProperty("--y", e.clientY - r.top + "px"); }}
      className={"spot relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] " + className}>
      {children}
    </div>
  );
}
function Avatar({ src, name, cls }: any) {
  if (src) return <img src={src} alt={name} className={cls + " object-cover"} />;
  return <div className={cls + " grid place-items-center bg-gradient-to-br from-violet-500 to-fuchsia-500 font-bold"}>{(name || "?").split(" ").map((w: string) => w[0]).slice(0, 2).join("")}</div>;
}
function Counter({ value }: { value: string }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: true });
  const m = String(value).match(/^([\d,.]+)(.*)$/);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inV || !m) return;
    const c = animate(0, parseFloat(m[1].replace(/,/g, "")), { duration: 2, ease: "easeOut", onUpdate: setN });
    return () => c.stop();
  }, [inV]);
  if (!m) return <span ref={ref}>{value}</span>;
  const d = m[1].includes(".") ? 1 : 0;
  return <span ref={ref}>{n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })}{m[2]}</span>;
}
function Marquee({ items, rev }: any) {
  if (!items.length) return null;
  const list = [...items, ...items];
  return (
    <div className="overflow-hidden" style={{ maskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)" }}>
      <div className={"marq " + (rev ? "rev" : "")}>{list.map((it: any, i: number) => <div key={i} className="px-5">{it}</div>)}</div>
    </div>
  );
}

const NAV = ["About", "Services", "Achievements", "Clients", "Blog", "Featured", "Contact"];

export default function Site({ c }: { c: any }) {
  const s = c.settings;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  useEffect(() => { const f = () => setScrolled(window.scrollY > 30); f(); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);
  const go = (id: string) => { setOpen(false); document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <main className="relative">
      <motion.div style={{ scaleX: bar }} className="fixed top-0 left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400 z-[60]" />

      <header className={"fixed top-0 inset-x-0 z-50 transition-all " + (scrolled ? "bg-black/60 backdrop-blur-xl border-b border-white/10" : "")}>
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="text-xl font-extrabold tracking-tight">{s.name}</a>
          <div className="hidden md:flex items-center gap-1">
            {NAV.map((n) => <button key={n} onClick={() => go(n)} className="px-3 py-2 text-sm text-white/60 hover:text-white transition">{n}</button>)}
            <button onClick={() => go("Contact")} className="ml-3 px-5 py-2 text-sm font-semibold bg-white text-black rounded-full hover:scale-105 transition">Let's Talk</button>
          </div>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </nav>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden bg-black/90 backdrop-blur-xl">
              {NAV.map((n) => <button key={n} onClick={() => go(n)} className="block w-full text-left px-6 py-3 text-white/80 border-t border-white/5">{n}</button>)}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <motion.div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-violet-600/30 blur-[120px]" animate={{ x: [0, 80, 0], y: [0, 60, 0] }} transition={{ duration: 14, repeat: Infinity }} />
        <motion.div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-fuchsia-600/20 blur-[120px]" animate={{ x: [0, -80, 0], y: [0, -50, 0] }} transition={{ duration: 16, repeat: Infinity }} />
        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20 grid md:grid-cols-2 gap-14 items-center">
          <div className="order-2 md:order-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-white/10 bg-white/5 text-sm text-white/70">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />{s.role}
            </motion.div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6">
              {[s.title1, s.title2, s.title3].map((t: string, i: number) => (
                <motion.span key={i} className={"block " + (i === 1 ? "grad" : "")} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>{t}</motion.span>
              ))}
            </h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-lg text-white/55 leading-relaxed mb-8 max-w-lg">{s.bio}</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="flex flex-wrap gap-4 mb-10">
              <button onClick={() => go("Contact")} className="px-7 py-3.5 bg-white text-black font-semibold rounded-full hover:scale-105 transition">Let's Grow Together</button>
              <button onClick={() => go("About")} className="px-7 py-3.5 border border-white/20 font-semibold rounded-full hover:bg-white/10 transition">My Journey</button>
            </motion.div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/40">Follow me</span>
              {c.socials.map((x: any, i: number) => (
                <motion.a key={i} whileHover={{ y: -4, scale: 1.1 }} href={x.url} target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-white/10 hover:bg-white hover:text-black transition"><SocialIcon p={x.platform} /></motion.a>
              ))}
            </div>
          </div>
          <motion.div className="order-1 md:order-2 flex justify-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
            <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="relative w-72 h-80 sm:w-80 sm:h-[26rem]">
              <motion.div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-orange-400 blur-xl opacity-60" animate={{ rotate: [0, 4, 0, -4, 0] }} transition={{ duration: 8, repeat: Infinity }} />
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/20">
                <Avatar src={s.heroImage} name={s.name} cls="w-full h-full text-6xl" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <Head tag="About Me" title={s.aboutTitle} text={s.aboutText} />
          <div className="relative">
            <motion.div className="absolute left-3 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500 to-transparent origin-top" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} />
            {c.journey.map((j: any, i: number) => (
              <Reveal key={i} x={i % 2 ? 50 : -50} y={0} className={"relative pl-10 md:pl-0 mb-10 md:w-1/2 " + (i % 2 ? "md:ml-auto md:pl-12" : "md:pr-12")}>
                <span className={"absolute top-7 left-[7px] h-3 w-3 rounded-full bg-violet-500 ring-4 ring-[#07070a] " + (i % 2 ? "md:left-[-6px]" : "md:left-auto md:right-[-6px]")} />
                <Spot className="p-6 hover:border-violet-500/40 transition">
                  <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">{j.label}</span>
                  <h3 className="text-lg font-bold mt-2 mb-2">{j.title}</h3>
                  <p className="text-sm text-white/55 leading-relaxed">{j.text}</p>
                </Spot>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-16 text-center">
            <p className="text-2xl md:text-3xl italic text-white/40 max-w-2xl mx-auto leading-relaxed">"{s.quote}"</p>
            <p className="text-sm text-white/30 mt-4">- {s.quoteAuthor}</p>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 md:py-32 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6">
          <Head tag="Services" title="How I Help Brands & Creators Grow" text="I help founders, creators, startups, and businesses build content systems that increase visibility, authority, and long-term growth." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {c.services.map((x: any, i: number) => (
              <Reveal key={i} delay={(i % 3) * 0.1} className="h-full">
                <motion.div whileHover={{ y: -6 }} className="h-full">
                  <Spot className="p-7 h-full hover:border-violet-500/40 transition">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center font-bold mb-5">{String(i + 1).padStart(2, "0")}</div>
                    <h3 className="text-lg font-bold mb-3">{x.title}</h3>
                    <p className="text-sm text-white/55 leading-relaxed">{x.text}</p>
                  </Spot>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="achievements" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <Head tag="Achievements" title="Numbers That Speak" text="A track record of delivering real, measurable results for brands and creators." />
          <div className="grid md:grid-cols-3 gap-6">
            {c.stats.map((x: any, i: number) => (
              <Reveal key={i} delay={i * 0.12}>
                <Spot className="p-10 text-center">
                  <div className="text-5xl lg:text-6xl font-extrabold grad mb-3"><Counter value={x.value} /></div>
                  <p className="font-semibold mb-1">{x.label}</p>
                  <p className="text-sm text-white/45">{x.sub}</p>
                </Spot>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section id="clients" className="py-24 md:py-32 bg-white/[0.02] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6"><Head tag="Clients & Collaborators" title="People I've Worked With" text="From top creators and entrepreneurs to leading brands, trusted by some of the biggest names in India and the UAE." /></div>
        <p className="max-w-6xl mx-auto px-6 mb-6 text-xs tracking-[0.25em] uppercase text-white/40">Creators & Personalities</p>
        <Marquee items={c.creators.map((x: any, i: number) => (
          <div key={i} className="w-40 text-center group">
            <Avatar src={x.image} name={x.name} cls="w-28 h-28 rounded-full mx-auto mb-3 border-2 border-white/10 group-hover:border-violet-400 group-hover:scale-110 transition duration-300" />
            <p className="font-bold text-sm">{x.name}</p><p className="text-xs text-white/40 mt-1">{x.role}</p>
          </div>
        ))} />
        <p className="max-w-6xl mx-auto px-6 mt-14 mb-6 text-xs tracking-[0.25em] uppercase text-white/40">Brands & Institutions</p>
        <Marquee rev items={c.brands.map((x: any, i: number) => (
          <div key={i} className="flex flex-col items-center gap-3 group">
            <div className="w-24 h-24 rounded-xl bg-white overflow-hidden grid place-items-center p-2 group-hover:scale-110 transition duration-300">
              {x.image ? <img src={x.image} alt={x.name} className="w-full h-full object-contain" /> : <span className="text-black text-xs font-bold text-center">{x.name}</span>}
            </div>
            <span className="text-xs text-white/50">{x.name}</span>
          </div>
        ))} />
        <p className="text-center text-sm text-white/40 mt-12">...and many more celebs, brands & creators from India and the UAE</p>
      </section>

      {/* BLOG */}
      <section id="blog" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <Head tag="Latest Insights" title="Ideas, Strategies & Lessons" text="Thoughts, strategies and lessons from working across social media, content and personal branding." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {c.posts.map((p: any, i: number) => (
              <Reveal key={i} delay={(i % 3) * 0.1}>
                <a href={p.url || "#"} target={p.url ? "_blank" : undefined} rel="noreferrer" className="group block">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-violet-900/50 to-fuchsia-900/30 mb-4">
                    {p.image && <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />}
                  </div>
                  <div className="flex gap-3 text-xs text-white/45 mb-2"><span className="text-violet-400">{p.category}</span><span>{p.date}</span></div>
                  <h3 className="font-bold text-lg leading-snug mb-2 group-hover:text-violet-300 transition">{p.title}</h3>
                  {p.excerpt && <p className="text-sm text-white/50 leading-relaxed mb-3">{p.excerpt}</p>}
                  <div className="flex flex-wrap gap-2 mb-3">{String(p.tags || "").split(",").filter((t: string) => t.trim()).map((t: string) => <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-white/5 text-white/50">{t.trim()}</span>)}</div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold">Read More <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition" /></span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section id="featured" className="py-24 md:py-32 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6">
          <Head tag="Featured On" title="Podcasts & Shows" text="Conversations where I've shared my journey, experiences and ideas." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {c.featured.map((p: any, i: number) => (
              <Reveal key={i} delay={(i % 3) * 0.1} className="h-full">
                <motion.a whileHover={{ y: -6 }} href={p.url || "#"} target={p.url ? "_blank" : undefined} rel="noreferrer" className="block h-full">
                  <Spot className="h-full">
                    <div className="aspect-video bg-gradient-to-br from-fuchsia-900/50 to-orange-900/30 overflow-hidden">{p.image && <img src={p.image} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition duration-700" />}</div>
                    <div className="p-5">
                      <div className="flex gap-3 text-xs text-white/45 mb-2"><span className="text-fuchsia-400">{p.source}</span><span>{p.date}</span></div>
                      <h3 className="font-bold leading-snug mb-2">{p.title}</h3>
                      <p className="text-sm text-white/50 mb-4">{p.excerpt}</p>
                      <span className="text-sm font-semibold inline-flex items-center gap-1">Watch Episode <ArrowUpRight size={16} /></span>
                    </div>
                  </Spot>
                </motion.a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Contact c={c} />

      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div><p className="font-extrabold text-lg">{s.name}</p><p className="text-xs text-white/40">{s.role}</p></div>
          <div className="flex gap-3">{c.socials.map((x: any, i: number) => <a key={i} href={x.url} target="_blank" rel="noreferrer" className="p-2.5 text-white/50 hover:text-white transition"><SocialIcon p={x.platform} /></a>)}</div>
        </div>
        <p className="text-center text-xs text-white/30 pb-8">© {new Date().getFullYear()} {s.name}. All rights reserved.</p>
      </footer>
    </main>
  );
}

function Contact({ c }: any) {
  const s = c.settings;
  const [f, setF] = useState({ name: "", email: "", subject: "", message: "" });
  const [st, setSt] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const submit = async (e: any) => {
    e.preventDefault(); setSt("sending");
    const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    if (r.ok) { setSt("ok"); setF({ name: "", email: "", subject: "", message: "" }); } else setSt("err");
  };
  const inp = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition";
  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <Head tag="Get In Touch" title="Let's Work Together" text="Have a project in mind? Want to elevate your brand's social media presence? I'd love to hear from you." />
        <div className="grid md:grid-cols-5 gap-10">
          <Reveal x={-30} y={0} className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold">Connect With Me</h3>
            <p className="text-sm text-white/50">Based in {s.location}, working with brands and creators worldwide.</p>
            <a href={"mailto:" + s.email} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-400/50 transition"><Mail size={18} /><span className="text-sm">{s.email}</span></a>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"><MapPin size={18} /><span className="text-sm">{s.location}</span></div>
            <div className="flex gap-3 pt-2">{c.socials.map((x: any, i: number) => <motion.a whileHover={{ y: -4 }} key={i} href={x.url} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white hover:text-black transition"><SocialIcon p={x.platform} /></motion.a>)}</div>
          </Reveal>
          <Reveal x={30} y={0} className="md:col-span-3">
            <form onSubmit={submit} className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input required placeholder="Your Name" className={inp} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
                <input required type="email" placeholder="Your Email" className={inp} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
              </div>
              <input placeholder="Subject" className={inp} value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} />
              <textarea required rows={5} placeholder="Your Message" className={inp + " resize-none"} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
              <button disabled={st === "sending"} className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-black font-semibold rounded-xl hover:scale-[1.02] transition disabled:opacity-50"><Send size={16} />{st === "sending" ? "Sending..." : "Send Message"}</button>
              {st === "ok" && <p className="text-emerald-400 text-sm text-center">Message sent. I'll get back to you soon!</p>}
              {st === "err" && <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
