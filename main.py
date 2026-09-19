from pathlib import Path
import html
import uuid

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse

app = FastAPI(title="Gold Coder Studio")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

TRAE_PATH = Path("/app/trae-agent")
PROJECTS = Path("/app/projects")
PROJECTS.mkdir(parents=True, exist_ok=True)


@app.get("/", response_class=HTMLResponse)
async def studio() -> str:
    return """
    <html>
      <head>
        <title>Gold Coder Studio</title>
        <style>
          body { background:#000; color:#00ff88; font-family:monospace; padding:20px }
          .card { border:1px solid #00ff88; padding:15px; margin:10px 0; border-radius:8px }
          a { color:#00ff88 }
        </style>
      </head>
      <body>
        <h1>█ GOLD CODER STUDIO</h1>
        <div class="card">
          <h2>✅ Browser-hosted live</h2>
          <p>POST <code>/api/build</code> with <code>{"prompt":"build a portfolio website"}</code></p>
          <p>GET <code>/api/projects</code> to list projects</p>
          <p>GET <code>/api/preview/{id}</code> for a live preview</p>
        </div>
        <div class="card">
          <h3>Agent status</h3>
          <pre id="status">Checking trae-agent...</pre>
        </div>
        <script>
          fetch('/api/status').then(r => r.json()).then(d => {
            document.getElementById('status').innerText = JSON.stringify(d, null, 2)
          })
        </script>
      </body>
    </html>
    """


@app.get("/api/status")
async def status() -> dict:
    opencode_up = False
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get("http://127.0.0.1:4096/info", timeout=2)
            opencode_up = response.is_success
    except httpx.HTTPError:
        pass

    return {
        "brand": "Gold Coder",
        "trae_agent_cloned": TRAE_PATH.exists(),
        "opencode_up": opencode_up,
        "clone_cmd": "git clone https://github.com/bytedance/trae-agent.git /app/trae-agent",
        "api": [
            "POST /api/build",
            "GET /api/projects",
            "GET /api/preview/{project_id}",
        ],
    }


@app.post("/api/build")
async def build_website(req: Request) -> dict:
    data = await req.json()
    prompt = str(data.get("prompt", "build a portfolio website")).strip()
    if not prompt:
        raise HTTPException(status_code=400, detail="prompt must not be empty")

    project_id = uuid.uuid4().hex[:8]
    project_dir = PROJECTS / project_id
    project_dir.mkdir()
    safe_prompt = html.escape(prompt)
    (project_dir / "index.html").write_text(
        f"<h1>Built by Gold Coder: {safe_prompt}</h1><p>Project {project_id}</p>",
        encoding="utf-8",
    )

    return {
        "project_id": project_id,
        "browser_preview_url": f"/api/preview/{project_id}",
        "prompt": prompt,
        "status": "built",
    }


@app.get("/api/projects")
async def list_projects() -> dict:
    return {"projects": sorted(p.name for p in PROJECTS.iterdir() if p.is_dir())}


@app.get("/api/preview/{project_id}", response_class=HTMLResponse)
async def preview(project_id: str) -> str:
    if Path(project_id).name != project_id:
        raise HTTPException(status_code=400, detail="invalid project id")
    file_path = PROJECTS / project_id / "index.html"
    if not file_path.is_file():
        raise HTTPException(status_code=404, detail="project not found")
    return file_path.read_text(encoding="utf-8")


@app.get("/openapi.json")
async def openapi_proxy():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("http://127.0.0.1:4096/openapi.json", timeout=5)
            response.raise_for_status()
            return JSONResponse(response.json())
        except (httpx.HTTPError, ValueError):
            return JSONResponse({"status": "opencode starting"})


@app.get("/api/info")
async def info_proxy():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("http://127.0.0.1:4096/api/info", timeout=5)
            response.raise_for_status()
            return JSONResponse(response.json())
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=503, detail="OpenCode is unavailable") from exc
