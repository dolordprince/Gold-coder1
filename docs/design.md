# Gold Coder Studio — Design Document

## Architecture
A FastAPI API generates isolated project directories. A lightweight static frontend runs on port 3000 and calls the API on port 8000. SQLite stores project metadata and feedback. The optional `trae-agent` checkout is detected but never executes untrusted generated code automatically.

## Stack
- Python 3.11, FastAPI, Uvicorn, Pydantic
- Node.js static frontend server
- SQLite
- Three.js loaded by generated previews for progressive-enhancement 3D effects

## Data model
`projects(id, prompt, created_at)` and `feedback(id, project_id, rating, comment, created_at)`.

## API reference
- `GET /api/status`, `GET /api/tools`
- `POST /api/build` with `{prompt, style, include_backend}`
- `GET /api/projects`, `GET /api/projects/{id}/files`
- `GET /api/preview/{id}`, `GET /api/projects/{id}/asset-manifest`
- `POST /api/projects/{id}/feedback` with `{rating, comment}`

## Deployment
Run `bash start.sh` from the repository root. It resets the local SQLite database, creates a virtualenv, installs dependencies, starts the API, serves the frontend at `http://localhost:3000`, and verifies both endpoints. Set `CORS_ORIGINS` to a comma-separated allowlist in production.

## Safety and limitations
“8K-ready” means the manifest and responsive asset contract target 7680×4320; it does not generate or host copyrighted imagery. Feedback improves persisted product data, not source code at runtime. Add authentication, quotas, a sandbox, and a job queue before exposing arbitrary code generation publicly.
