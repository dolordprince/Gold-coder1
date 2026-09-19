#!/usr/bin/env bash
set -euo pipefail

# Start the Gold Coder API. A separate OpenCode process can be added here when
# the hosting image provides it; the API remains healthy if it is unavailable.
exec uvicorn main:app --host 0.0.0.0 --port "${PORT:-7860}"
