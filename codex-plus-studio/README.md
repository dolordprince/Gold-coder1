# Codex+ Unified Studio

Codex+ is the Gold Coder command center. It uses Pollinations public free endpoints as the reasoning and visual brain and stores build sessions in browser history.

## Run locally
```bash
cd codex-plus-studio
npm install
npm run dev
```

Open http://localhost:3000.

## Pollinations free endpoints
No API key or paid account is used by this integration:
- Text: `https://text.pollinations.ai/{prompt}`
- Images: `https://image.pollinations.ai/prompt/{prompt}?width=...&height=...&nologo=true`

The server route `POST /api/codex` forwards requests to the free text endpoint. Availability and rate limits are controlled by Pollinations.

## Included
- Persistent browser build history with up to 50 sessions
- Pollinations-powered Codex orchestration
- Pollinations-generated visual command center
- PWA manifest and offline service worker
- Vercel-ready configuration
