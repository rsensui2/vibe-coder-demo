#!/bin/bash
set -e
GEMINI_API_KEY=$(python3 - <<'PY'
import json
print(json.load(open('/home/rsensui/.openclaw/openclaw.json')).get('env',{}).get('vars',{}).get('GEMINI_API_KEY',''))
PY
)
python3 /home/rsensui/.openclaw/workspace/skills/nanobanana-slide-generator-v3-flash/scripts/generate_slides_parallel.py \
  --prompts-dir /tmp/vcd-fresh/demos/2026-04-10_photofolio_match/slides/slides_output/manual/prompts \
  --output-dir /tmp/vcd-fresh/demos/2026-04-10_photofolio_match/slides/slides_output/manual/images \
  --api-key "$GEMINI_API_KEY" \
  --max-parallel 5 \
  --max-retries 2 \
  --logo /home/rsensui/.openclaw/workspace/skills/nanobanana-slide-generator-v3-flash/assets/logo.png
python3 /home/rsensui/.openclaw/workspace/skills/nanobanana-slide-generator-v3-flash/scripts/export_to_pdf.py \
  --input-dir /tmp/vcd-fresh/demos/2026-04-10_photofolio_match/slides/slides_output/manual/images \
  --output /tmp/vcd-fresh/demos/2026-04-10_photofolio_match/slides/photofolio_match.pdf
