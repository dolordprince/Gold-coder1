# Codex+ Luxe Studio

A Pollinations-powered premium website and app architect. Describe a product and receive a clean JSON blueprint containing multi-page routes, information architecture, luxury color and font direction, image art direction, 3D effects, components, data models, build steps, and quality checks.

## Run
```bash
cd codex-plus-studio
npm install
npm run dev
```

## Pollinations-only architecture
The Codex route uses the public free text endpoint:
`https://text.pollinations.ai/{encoded-prompt}?model=openai&json=true`

The visual canvas uses the public free image endpoint:
`https://image.pollinations.ai/prompt/{encoded-prompt}?width=1400&height=900&nologo=true`

No API key, paid provider, demo fallback, or mock response is used. Public endpoint availability and rate limits are controlled by Pollinations.

## Capabilities
- Clean machine-readable JSON blueprints
- Multiple-page route planning and section architecture
- Generated luxury palette with hex values and font pairing
- Pollinations visual concept generation
- 3D scene, objects, lighting, and motion direction
- Component, data model, build sequence, and quality checks
- Up to 50 local history sessions
- PWA offline shell and Vercel deployment configuration
