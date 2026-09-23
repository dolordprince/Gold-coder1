'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Layers3, Rocket, Sparkles } from 'lucide-react';

const cards = [
  {
    title: 'Architectural Blueprint',
    description: 'Routes, component graph, data model, and edge-case planning in a single execution map.',
    accent: 'from-violet-500/30 to-cyan-500/20',
    icon: Layers3,
    meta: 'Phase 1'
  },
  {
    title: 'Visual Sculpting',
    description: 'Pollinations-powered hero imagery, glass layers, and premium 3D treatment for the interface.',
    accent: 'from-fuchsia-500/30 to-pink-500/20',
    icon: Sparkles,
    meta: 'Phase 2'
  },
  {
    title: 'Deploy to Sandbox',
    description: 'Production-ready build and instant Vercel preview flow for testing and iteration.',
    accent: 'from-emerald-500/30 to-teal-500/20',
    icon: Rocket,
    meta: 'Phase 5'
  }
];

const actions = [
  'TanStack Query-ready state flows',
  'Framer Motion 60fps micro-interactions',
  'PWA installability and offline support',
  'Pollinations AI generative art pipeline'
];

export default function HomePage() {
  const pollinateUI = () => {
    const query = '3d_render_hyper_realistic_glassmorphism_bento_dashboard_ui';
    const url = `https://image.pollinations.ai/prompt/${query}?width=1400&height=900&nologo=true`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen bg-obsidian text-white">
      <div className="absolute inset-0 bg-mesh opacity-90" />
      <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <header className="mb-10 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-sm font-bold text-white shadow-soft">
              C+
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-violet-200">Codex+</p>
              <p className="text-sm font-semibold text-white">Unified Studio</p>
            </div>
          </div>
          <button
            onClick={pollinateUI}
            className="inline-flex items-center gap-2 rounded-full border border-violet-300/40 bg-violet-500/15 px-4 py-2 text-sm font-medium text-violet-100 transition hover:bg-violet-500/25"
          >
            Pollinate the UI
            <ArrowRight size={16} />
          </button>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-7"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-cyan-200">
              Recursive build loop
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white md:text-6xl">
                Design, generate, ship, and iterate in one studio loop.
              </h1>
              <p className="max-w-xl text-lg text-slate-300">
                A premium, app-like workspace for generating high-end web products with Pollinations visual intelligence and a Vercel sandbox handoff.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://vercel.com/new"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:scale-[1.02]"
              >
                Activate Vercel Preview
              </a>
              <button
                onClick={pollinateUI}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Generate visual concept
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {actions.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-soft backdrop-blur-2xl">
              <img
                src="https://image.pollinations.ai/prompt/3d_render_hyper_realistic_glassmorphism_bento_dashboard_ui?width=1200&height=1400&nologo=true"
                alt="Premium glassmorphism UI concept"
                className="h-[560px] w-full rounded-[1.5rem] object-cover"
              />
            </div>
          </motion.div>
        </section>

        <section className="mt-14 grid gap-5 md:grid-cols-3">
          {cards.map(({ title, description, accent, icon: Icon, meta }) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${accent} p-[1px]`}
            >
              <div className="flex h-full flex-col rounded-[1.7rem] bg-slate-950/80 p-5 backdrop-blur-xl">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-violet-100">
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-slate-400">{meta}</span>
                </div>
                <h2 className="mb-2 text-xl font-semibold text-white">{title}</h2>
                <p className="text-sm leading-6 text-slate-300">{description}</p>
              </div>
            </motion.article>
          ))}
        </section>
      </div>
    </main>
  );
}
