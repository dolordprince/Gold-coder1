'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, Clock3, History, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react';

type Entry = { role: 'user' | 'assistant'; content: string };
type Session = { id: string; prompt: string; answer: string; createdAt: string };
const STORAGE_KEY = 'codex-plus-history-v2';

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<'ready' | 'thinking' | 'live' | 'error'>('ready');
  const [history, setHistory] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    try { const saved = window.localStorage.getItem(STORAGE_KEY); if (saved) setHistory(JSON.parse(saved)); } catch { setHistory([]); }
    navigator.serviceWorker?.register('/sw.js').catch(() => undefined);
  }, []);
  useEffect(() => { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history)); }, [history]);

  const context = useMemo<Entry[]>(() => {
    const active = history.find((item) => item.id === activeId);
    return active ? [{ role: 'user', content: active.prompt }, { role: 'assistant', content: active.answer }] : [];
  }, [activeId, history]);

  async function runCodex(event?: FormEvent) {
    event?.preventDefault();
    const value = prompt.trim();
    if (!value || status === 'thinking') return;
    setStatus('thinking'); setAnswer(''); setActiveId(null);
    try {
      const response = await fetch('/api/codex', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: value, history: context }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Codex request failed');
      const session = { id: crypto.randomUUID(), prompt: value, answer: data.content, createdAt: new Date().toISOString() };
      setHistory((items) => [session, ...items].slice(0, 50)); setActiveId(session.id); setAnswer(data.content); setStatus('live');
    } catch (error) { setAnswer(error instanceof Error ? error.message : 'Pollinations is unavailable.'); setStatus('error'); }
  }

  function openSession(session: Session) { setPrompt(session.prompt); setAnswer(session.answer); setActiveId(session.id); setStatus('live'); }
  function newBuild() { setPrompt(''); setAnswer(''); setActiveId(null); setStatus('ready'); }
  function clearHistory() { setHistory([]); newBuild(); }

  return (
    <main className="min-h-screen bg-obsidian text-white"><div className="absolute inset-0 bg-mesh opacity-90" /><div className="relative mx-auto grid min-h-screen max-w-[1500px] gap-6 px-4 py-4 lg:grid-cols-[290px_1fr] lg:px-6">
      <aside className="hidden flex-col rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl lg:flex">
        <div className="mb-8 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 font-black">C+</div><div><p className="text-xs uppercase tracking-[.25em] text-violet-200">Codex+</p><p className="font-semibold">Unified Studio</p></div></div>
        <button onClick={newBuild} className="mb-7 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900"><Plus size={16} /> New build</button>
        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[.2em] text-slate-400"><span>History</span><button onClick={clearHistory} aria-label="Clear history" title="Clear history"><Trash2 size={14} /></button></div>
        <div className="space-y-2 overflow-y-auto">{history.length === 0 && <p className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-slate-500">Your Codex sessions will appear here.</p>}{history.map((session) => <button key={session.id} onClick={() => openSession(session)} className={`w-full rounded-xl p-3 text-left transition ${activeId === session.id ? 'bg-violet-500/20 ring-1 ring-violet-300/30' : 'hover:bg-white/5'}`}><p className="line-clamp-2 text-sm text-slate-200">{session.prompt}</p><p className="mt-2 text-[11px] text-slate-500">{formatDate(session.createdAt)}</p></button>)}</div>
        <div className="mt-auto rounded-2xl border border-cyan-300/20 bg-cyan-400/5 p-4 text-xs leading-5 text-cyan-100"><BrainCircuit size={18} className="mb-2" />Pollinations powers Codex reasoning and visuals through its free public endpoints.</div>
      </aside>
      <section className="flex min-w-0 flex-col rounded-[2rem] border border-white/10 bg-slate-950/45 p-5 shadow-soft backdrop-blur-xl sm:p-8">
        <header className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.28em] text-cyan-300">Codex command center</p><h1 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">Turn intent into shipped product.</h1></div><div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 sm:flex"><span className={`h-2 w-2 rounded-full ${status === 'thinking' ? 'animate-pulse bg-amber-300' : status === 'live' ? 'bg-emerald-300' : status === 'error' ? 'bg-red-300' : 'bg-violet-300'}`} />{status === 'thinking' ? 'Thinking' : status === 'live' ? 'Pollinations live' : status === 'error' ? 'Connection error' : 'Ready'}</div></header>
        <div className="mt-8 grid gap-5 xl:grid-cols-[1fr_360px]"><div className="space-y-5"><form onSubmit={runCodex} className="rounded-[1.75rem] border border-violet-300/20 bg-gradient-to-br from-violet-500/15 to-cyan-400/5 p-4 shadow-glass sm:p-5"><div className="mb-4 flex items-center gap-2 text-sm text-violet-100"><Sparkles size={16} /> Describe what you want Codex to build</div><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Describe a product, feature, redesign, or architecture..." rows={5} className="w-full resize-none bg-transparent text-lg leading-8 text-white outline-none placeholder:text-slate-500" /><div className="mt-4 flex justify-end"><button type="submit" disabled={!prompt.trim() || status === 'thinking'} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">{status === 'thinking' ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />} Run Codex</button></div></form><AnimatePresence mode="wait">{answer ? <motion.article key={activeId || answer} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="min-h-[360px] rounded-[1.75rem] border border-white/10 bg-black/20 p-5 sm:p-7"><div className="mb-5 flex items-center gap-2 text-sm font-semibold text-cyan-200"><BrainCircuit size={18} /> Pollinations Codex response</div><pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-200">{answer}</pre></motion.article> : <div className="flex min-h-[360px] items-center justify-center rounded-[1.75rem] border border-dashed border-white/10 p-8 text-center text-slate-500"><div><History className="mx-auto mb-3" size={28} /><p>Your blueprint, visual direction, and deployment plan will land here.</p></div></div>}</AnimatePresence></div><div className="space-y-4"><div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 p-2"><img src="https://image.pollinations.ai/prompt/3d_render_hyper_realistic_cinematic_codex_command_center_glassmorphism?width=900&height=1100&nologo=true" alt="Pollinations-generated Codex command center" className="h-[370px] w-full rounded-2xl object-cover" /></div><div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"><div className="mb-4 flex items-center gap-2 text-sm font-semibold"><Clock3 size={16} className="text-cyan-300" /> Build loop</div>{['Blueprint', 'Visual sculpting', 'Code generation', 'PWA wrapping', 'Vercel handshake'].map((item, index) => <div key={item} className="flex items-center gap-3 border-t border-white/10 py-3 text-sm text-slate-300"><span className="text-xs text-violet-300">0{index + 1}</span>{item}</div>)}</div></div></div>
      </section>
    </div></main>
  );
}
