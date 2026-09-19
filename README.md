# Gold Coder Studio

## Overview
Gold Coder turns a natural-language prompt into an isolated full-stack website scaffold with a responsive preview, Three.js visual effects, an API starter, and an 8K-ready asset manifest.

## Quick start
```bash
bash start.sh
```
Then visit **http://localhost:3000**. API documentation is at http://localhost:8000/docs.

## Technology stack
- Frontend: static HTML/JavaScript, optional Three.js in generated previews
- Backend: FastAPI + Uvicorn + Pydantic
- Database: SQLite
- Deployment: `start.sh`, Python virtual environment, Node static server

## Project structure
- `main.py` — API, generator, SQLite initialization
- `start.sh` — clean, self-contained local deployment
- `requirements.txt` — Python dependencies
- `docs/design.md` — architecture and API design
- `projects/` — generated project sandboxes (created at runtime)

## API
`POST /api/build`, `GET /api/status`, `GET /api/tools`, `GET /api/projects`, `GET /api/preview/{id}`, `GET /api/projects/{id}/files`, `GET /api/projects/{id}/asset-manifest`, and `POST /api/projects/{id}/feedback`.

## Database
The deployment script deletes and recreates `gold_coder.sqlite3`; tables are initialized automatically on startup. Feedback is stored for future product/template improvements.

## Production notes
Use a real task queue and sandbox before running generated server code. Configure `CORS_ORIGINS` with explicit trusted origins, add authentication/rate limits, and provide licensed image assets. The generator does not silently self-modify its source code.
