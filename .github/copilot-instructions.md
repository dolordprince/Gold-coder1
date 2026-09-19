# Gold Coder Studio repository instructions

## Product goal
Gold Coder generates complete, polished, responsive multi-page visual websites from natural-language briefs. Favor a strong finished experience over a thin demo or a single hero section.

## Engineering expectations

- Preserve the FastAPI API and SQLite behavior unless the task explicitly requires a migration.
- Keep generated projects isolated and sanitize all prompt-derived content.
- Use semantic accessible HTML and keyboard-operable controls.
- Treat Three.js as progressive enhancement and support reduced motion, no WebGL, and slow networks.
- Use Google Fonts with fallbacks, and use only licensed or clearly marked placeholder assets.
- Represent 8K readiness honestly with responsive asset metadata and lazy loading; do not imply that placeholder images are 8K originals.
- Prefer shared templates/design tokens over copied page-specific markup.
- Add or update tests and documentation whenever behavior changes.

## Verification checklist

Before finishing a change, verify:

1. `python -m compileall .` succeeds for Python sources.
2. Available tests pass.
3. `POST /api/build` returns a project and its preview/files/manifest routes work.
4. The generated project includes Home, About, Work/Gallery, Services, and Contact views.
5. Desktop, mobile, keyboard navigation, reduced motion, missing assets, and no-WebGL fallback are considered.
6. No user prompt is inserted into HTML or file paths without escaping/validation.
