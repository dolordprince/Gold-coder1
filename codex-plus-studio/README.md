# DOLOR3V Studio

Lovable-style AI coding workspace for generating, editing, previewing, and deploying premium projects.

## Vercel configuration
Set the project root directory to `codex-plus-studio`. For the deploy button, add `VERCEL_TOKEN` as a Vercel Environment Variable. The token must have deployment permission; it is only read server-side.

## Workspace flow
1. Attach optional file paths and describe a change.
2. Pollinations streams code through the `/api/codex/stream` SSE route into the Monaco editor.
3. Edit files directly in Code.
4. Deploy current files to a Vercel preview.
5. Preview opens automatically when deployment returns a URL.

Pollinations image generation remains keyless through `image.pollinations.ai`.
