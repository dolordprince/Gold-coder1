# Gold Coder Studio

A small browser-hosted FastAPI wrapper around the open-source `trae-agent` project.

## Run locally

```bash
docker build -t gold-coder .
docker run --rm -p 7860:7860 gold-coder
```

Open <http://localhost:7860>.

## API

- `GET /api/status` — agent and service status
- `POST /api/build` — create a demo project from `{ "prompt": "..." }`
- `GET /api/projects` — list generated projects
- `GET /api/preview/{project_id}` — view a generated project

The current `/api/build` endpoint creates a safe placeholder preview. Connect the
agent execution flow in `build_website` before enabling arbitrary code generation
in a production deployment.
