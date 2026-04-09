#!/bin/bash
set -e
GEMINI_API_KEY=$(python3 - <<'PY'
import json
print(json.load(open('/home/rsensui/.openclaw/openclaw.json')).get('env',{}).get('vars',{}).get('GEMINI_API_KEY',''))
PY
)
python3 /home/rsensui/.openclaw/workspace/skills/nanobanana-slide-generator-v3-flash/scripts/generate_prompts_from_json.py \
  --session-dir /tmp/vcd-fresh/demos/2026-04-10_photofolio_match/sns/instagram/session \
  --json-file /tmp/vcd-fresh/demos/2026-04-10_photofolio_match/sns/instagram/session/json/ig_plan.json \
  --output-dir prompts \
  --design-guidelines /tmp/vcd-fresh/demos/2026-04-10_photofolio_match/design_guidelines.md \
  --template-path /home/rsensui/.openclaw/workspace/skills/nanobanana-slide-generator-v3-flash/templates/ig_prompt_template.j2 \
  --image-size 1K
python3 /home/rsensui/.openclaw/workspace/skills/nanobanana-slide-generator-v3-flash/scripts/generate_slides_parallel.py \
  --prompts-dir /tmp/vcd-fresh/demos/2026-04-10_photofolio_match/sns/instagram/session/prompts \
  --output-dir /tmp/vcd-fresh/demos/2026-04-10_photofolio_match/sns/instagram/session/images \
  --api-key "$GEMINI_API_KEY" \
  --max-parallel 5 \
  --max-retries 2 \
  --image-size 1K
python3 - <<'PY'
import json, glob, shutil, os
project_dir='/tmp/vcd-fresh/demos/2026-04-10_photofolio_match'
ig_session_dir=project_dir + '/sns/instagram/session'
plan = json.load(open(f'{ig_session_dir}/json/ig_plan.json'))
imgs = sorted(glob.glob(f'{ig_session_dir}/images/*.png'))
for item, img in zip(plan['slides'], imgs):
    dst = f"{project_dir}/sns/instagram/{item['id']}.png"
    shutil.copy(img, dst)
    print(f'{os.path.basename(img)} -> {os.path.basename(dst)}')
PY
