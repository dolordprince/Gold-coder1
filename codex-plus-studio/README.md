# Codex+ Luxe Studio

Codex+ is a Pollinations-powered luxury digital product generator. It turns a brief into a structured multi-page blueprint, a visual concept, a project dashboard, and generated Next.js page files.

## Run
```bash
cd codex-plus-studio
npm install
npm run dev
```

## Workflow
1. **Design** — Pollinations returns clean JSON: routes, palette, typography, components, data model, visual direction, and 3D motion.
2. **Code** — **Build pages** creates a complete starter file set for every planned route, plus layout, styles, package metadata, and README.
3. **Launch** — review the quality checklist and open Vercel for deployment.

## Pollinations-only
Text uses `https://text.pollinations.ai/{prompt}?model=openai&json=true` and visual art uses `https://image.pollinations.ai/prompt/{prompt}`. No API key, paid provider, demo fallback, or mock response is used.

Generated files are returned as an exportable JSON bundle so they can be copied into a project workspace or committed by a later deployment adapter.
