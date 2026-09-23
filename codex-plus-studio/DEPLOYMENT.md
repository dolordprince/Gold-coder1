# Production deployment checklist

1. In Vercel, set **Root Directory** to `codex-plus-studio`.
2. Framework preset: **Next.js**.
3. Build command: `npm run build`.
4. Install command: `npm install`.
5. Confirm the production Node runtime is 20.x or newer.
6. Redeploy after the Next.js security upgrade.

## Local verification

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

The application uses Pollinations public endpoints and does not require an API secret. If additional integrations are added later, configure them in Vercel Environment Variables rather than committing credentials.
