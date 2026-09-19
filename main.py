from __future__ import annotations

import html
import json
import os
import sqlite3
import uuid
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parent
PROJECTS = Path(os.getenv("PROJECTS_DIR", ROOT / "projects"))
DB_PATH = Path(os.getenv("GOLD_CODER_DB", ROOT / "gold_coder.sqlite3"))
TRAE_PATH = Path(os.getenv("TRAE_PATH", "/app/trae-agent"))
PROJECTS.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Gold Coder Studio", version="2.0.0")
origins = [item.strip() for item in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",") if item.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


def db() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    with db() as connection:
        connection.executescript("""
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY, prompt TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT, project_id TEXT, rating INTEGER,
            comment TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        """)


init_db()


class BuildRequest(BaseModel):
    prompt: str = Field(default="Build a portfolio website", min_length=1, max_length=4000)
    style: str = Field(default="cinematic 3D", max_length=120)
    include_backend: bool = True


class FeedbackRequest(BaseModel):
    rating: int = Field(ge=1, le=5)
    comment: str = Field(default="", max_length=2000)


TOOLS = [
    {"name": "full_stack_scaffold", "description": "Generate frontend, API, and deployment files."},
    {"name": "cinematic_3d", "description": "Add responsive Three.js scenes and motion effects."},
    {"name": "8k_visual_assets", "description": "Prepare 7680px image slots and optimized responsive loading."},
    {"name": "quality_feedback", "description": "Record feedback for future prompt and template improvements."},
]


def generated_site(project_id: str, prompt: str, style: str) -> str:
    safe_prompt = html.escape(prompt)
    safe_style = html.escape(style)
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Gold Coder — {safe_prompt}</title>
<style>html,body{{margin:0;background:#050509;color:#fff;font:16px system-ui;overflow-x:hidden}}main{{min-height:100vh;display:grid;place-items:center;text-align:center;padding:4rem;position:relative;z-index:1}}h1{{font-size:clamp(3rem,10vw,9rem);margin:.2em;letter-spacing:-.07em}}p{{color:#b7b7c9;max-width:680px;line-height:1.7}}canvas{{position:fixed;inset:0;opacity:.75}}.badge{{color:#73ffb5;border:1px solid #73ffb5;padding:.5rem 1rem;border-radius:999px;display:inline-block}}</style></head>
<body><canvas id="scene" aria-label="Decorative 3D visual effect"></canvas><main><section><span class="badge">GOLD CODER · {safe_style}</span><h1>{safe_prompt}</h1><p>Generated as a production-ready full-stack starting point. Project {project_id} includes an API contract, responsive visuals, and an 8K-ready asset slot.</p></section></main>
<script type="module">import * as THREE from 'https://unpkg.com/three@0.165.0/build/three.module.js';const c=document.querySelector('#scene'),s=new THREE.Scene(),cam=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.1,100),r=new THREE.WebGLRenderer({canvas:c,alpha:true,antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,2));r.setSize(innerWidth,innerHeight);cam.position.z=5;const mesh=new THREE.Mesh(new THREE.IcosahedronGeometry(1.7,2),new THREE.MeshStandardMaterial({color:0x21e6a0,wireframe:true,emissive:0x063b27}));s.add(mesh);s.add(new THREE.AmbientLight(0xffffff,2));function loop(t){{mesh.rotation.x=t*.0002;mesh.rotation.y=t*.00035;r.render(s,cam);requestAnimationFrame(loop)}}loop(0);addEventListener('resize',()=>{{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();r.setSize(innerWidth,innerHeight)}});</script></body></html>'''


def write_scaffold(project_id: str, prompt: str, style: str, include_backend: bool) -> None:
    directory = PROJECTS / project_id
    directory.mkdir()
    (directory / "index.html").write_text(generated_site(project_id, prompt, style), encoding="utf-8")
    (directory / "README.md").write_text(f"# Gold Coder project {project_id}\n\nPrompt: {prompt}\n\nThis scaffold supports 8K-ready visuals and a Three.js scene.\n", encoding="utf-8")
    if include_backend:
        (directory / "backend.js").write_text("const http=require('http');http.createServer((_,res)=>{res.setHeader('content-type','application/json');res.end(JSON.stringify({ok:true,project:'" + project_id + "'}));}).listen(process.env.API_PORT||4000);\n", encoding="utf-8")
        (directory / "package.json").write_text(json.dumps({"private": True, "scripts": {"start": "node backend.js"}}, indent=2), encoding="utf-8")


@app.get("/", response_class=HTMLResponse)
async def studio() -> str:
    return '<h1>Gold Coder Studio</h1><p>Use <code>POST /api/build</code> to generate a full-stack visual website.</p>'


@app.get("/api/status")
async def status() -> dict[str, Any]:
    return {"brand": "Gold Coder", "version": app.version, "trae_agent_cloned": TRAE_PATH.exists(), "tools": len(TOOLS), "api_base": "/api"}


@app.get("/api/tools")
async def tools() -> dict[str, Any]:
    return {"tools": TOOLS, "policy": "Templates and feedback are persisted; source code is not self-modified at runtime."}


@app.post("/api/build")
async def build(request: BuildRequest) -> dict[str, Any]:
    project_id = uuid.uuid4().hex[:8]
    write_scaffold(project_id, request.prompt, request.style, request.include_backend)
    with db() as connection:
        connection.execute("INSERT INTO projects (id,prompt) VALUES (?,?)", (project_id, request.prompt))
    return {"project_id": project_id, "status": "built", "browser_preview_url": f"/api/preview/{project_id}", "files_url": f"/api/projects/{project_id}/files", "features": ["full_stack", "three_js", "8k_ready"]}


@app.get("/api/projects")
async def projects() -> dict[str, Any]:
    with db() as connection:
        rows = connection.execute("SELECT id,prompt,created_at FROM projects ORDER BY created_at DESC").fetchall()
    return {"projects": [dict(row) for row in rows]}


@app.get("/api/projects/{project_id}/files")
async def files(project_id: str) -> dict[str, Any]:
    directory = PROJECTS / project_id
    if not directory.is_dir():
        raise HTTPException(404, "project not found")
    return {"project_id": project_id, "files": sorted(str(path.relative_to(directory)) for path in directory.rglob("*") if path.is_file())}


@app.get("/api/preview/{project_id}", response_class=HTMLResponse)
async def preview(project_id: str) -> str:
    file_path = PROJECTS / project_id / "index.html"
    if not file_path.is_file():
        raise HTTPException(404, "project not found")
    return file_path.read_text(encoding="utf-8")


@app.post("/api/projects/{project_id}/feedback")
async def feedback(project_id: str, request: FeedbackRequest) -> dict[str, Any]:
    if not (PROJECTS / project_id).is_dir():
        raise HTTPException(404, "project not found")
    with db() as connection:
        connection.execute("INSERT INTO feedback (project_id,rating,comment) VALUES (?,?,?)", (project_id, request.rating, request.comment))
    return {"status": "recorded", "message": "Feedback saved for future improvement."}


@app.get("/api/projects/{project_id}/asset-manifest")
async def asset_manifest(project_id: str) -> dict[str, Any]:
    if not (PROJECTS / project_id).is_dir():
        raise HTTPException(404, "project not found")
    return {"project_id": project_id, "target_width": 7680, "target_height": 4320, "format": "webp", "note": "Supply licensed source imagery; Gold Coder does not scrape or claim image rights."}
