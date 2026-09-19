#!/usr/bin/env bash
set -euo pipefail

WORKSPACE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$WORKSPACE"
echo "=== Gold Coder: starting deployment ==="

if ! command -v python3 >/dev/null 2>&1; then
  if command -v apt-get >/dev/null 2>&1; then sudo apt-get update && sudo apt-get install -y python3 python3-pip python3-venv; else echo "Python 3 is required" >&2; exit 1; fi
fi
if ! command -v node >/dev/null 2>&1; then
  if command -v apt-get >/dev/null 2>&1; then sudo apt-get update && sudo apt-get install -y nodejs npm; else echo "Node.js is required for the frontend" >&2; exit 1; fi
fi

rm -f "$WORKSPACE/gold_coder.sqlite3"
python3 -m venv .venv
. .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
mkdir -p frontend
cat > frontend/index.html <<'HTML'
<!doctype html><html><head><meta charset="utf-8"><title>Gold Coder</title></head><body><main><h1>Gold Coder Studio</h1><p>Backend: <a href="http://localhost:8000/docs">API docs</a></p><form id="f"><input id="p" value="Build a cinematic 3D portfolio"><button>Build</button></form><pre id="o"></pre></main><script>f.onsubmit=async(e)=>{e.preventDefault();o.textContent=JSON.stringify(await (await fetch('http://localhost:8000/api/build',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({prompt:p.value})})).json(),null,2)}</script></body></html>
HTML

python -m uvicorn main:app --host 127.0.0.1 --port 8000 > backend.log 2>&1 & BACKEND_PID=$!
cleanup(){ kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true; }
trap cleanup EXIT INT TERM
(cd frontend && npx --yes serve -l 3000 .) > frontend.log 2>&1 & FRONTEND_PID=$!
for attempt in {1..30}; do curl -fsS http://localhost:3000 >/dev/null && curl -fsS http://localhost:8000/api/status >/dev/null && break || sleep 1; done
curl -fsS http://localhost:3000 >/dev/null || { cat frontend.log backend.log; exit 1; }
echo "=== Application is running at http://localhost:3000 ==="
echo "Backend API: http://localhost:8000/docs"
wait
