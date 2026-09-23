# Codex+ Unified Studio

A premium Next.js + Tailwind launchpad for the system prompt you provided.

## Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Framer Motion
- Pollinations AI visual generation
- Vercel deployment manifest
- PWA manifest + service worker

## Local development
```bash
cd codex-plus-studio
npm install
npm run dev
```

Open http://localhost:3000

## Pollinations UI workflow
Use this concept in a notebook or app UI:
```html
<img src="https://image.pollinations.ai/prompt/3d_render_hyper_realistic_glassmorphism_bento_dashboard_ui?width=1400&height=900&nologo=true" />
```

## Vercel preview activation
Create a project in Vercel and use the API with a token:
```bash
export VERCEL_TOKEN="your_token_here"
export VERCEL_PROJECT_ID="your_project_id_here"

curl -X POST "https://api.vercel.com/v1/deployments" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "codex-plus-studio",
    "project": "$VERCEL_PROJECT_ID",
    "target": "preview"
  }'
```

## Files included
- `vercel.json` — Vercel deployment config
- `app/manifest.ts` — generated PWA manifest
- `public/sw.js` — service worker for offline-first behavior
- `app/page.tsx` — premium UI landing page
