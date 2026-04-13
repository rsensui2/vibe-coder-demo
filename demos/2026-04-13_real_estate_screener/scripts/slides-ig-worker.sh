#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=./common.sh
source "${SCRIPT_DIR}/common.sh" "$@"

WORKER="slides_ig_worker"
require_bin python3 jq cp find ls

SKILL_DIR="${NANOBANANA_SKILL_DIR:-${HOME}/.openclaw/workspace/skills/nanobanana-slide-generator-v3-flash}"
PYTHON_BIN="${SKILL_DIR}/venv/bin/python"
# Skill venv に PIL がなければ ~/.venv にフォールバック
if ! "${PYTHON_BIN}" -c "import PIL" 2>/dev/null; then
  PYTHON_BIN="${HOME}/.venv/bin/python3"
fi
PROMPT_SCRIPT="${SKILL_DIR}/scripts/generate_prompts_from_json.py"
PARALLEL_SCRIPT="${SKILL_DIR}/scripts/generate_slides_parallel.py"
EXPORT_SCRIPT="${SKILL_DIR}/scripts/export_to_pdf.py"
LOGO_PATH="${SKILL_DIR}/assets/logo.png"
SLIDES_PLAN="${PROJECT_DIR}/slides/slides_plan.json"
IG_PLAN="${PROJECT_DIR}/sns/instagram/session/json/ig_plan.json"
DESIGN_GUIDELINES="${PROJECT_DIR}/design_guidelines.md"
GEMINI_API_KEY="${GEMINI_API_KEY:-$(jq -r '.env.vars.GEMINI_API_KEY // empty' ~/.openclaw/openclaw.json 2>/dev/null)}"

if [[ -z "${GEMINI_API_KEY}" ]]; then
  mark_error "${WORKER}" "GEMINI_API_KEY missing"
  exit 1
fi

if [[ ! -x "${PYTHON_BIN}" ]]; then
  mark_error "${WORKER}" "python not found (tried skill venv and ~/.venv)"
  exit 1
fi

mkdir -p "${PROJECT_DIR}/slides" "${PROJECT_DIR}/sns/instagram" "${PROJECT_DIR}/sns/instagram/session/json"

SLIDE_SESSION_DIR="${PROJECT_DIR}/slides/slides_output/$(date +%Y%m%d_%H%M%S)"
IG_SESSION_DIR="${PROJECT_DIR}/sns/instagram/session"
mkdir -p "${SLIDE_SESSION_DIR}/json" "${SLIDE_SESSION_DIR}/prompts" "${SLIDE_SESSION_DIR}/images"
mkdir -p "${IG_SESSION_DIR}/json" "${IG_SESSION_DIR}/prompts" "${IG_SESSION_DIR}/images"

log INFO "${WORKER}: generate slides"
cp "${SLIDES_PLAN}" "${SLIDE_SESSION_DIR}/json/"
"${PYTHON_BIN}" "${PROMPT_SCRIPT}" \
  --session-dir "${SLIDE_SESSION_DIR}" \
  --json-file json/slides_plan.json \
  --output-dir prompts \
  --design-guidelines "${DESIGN_GUIDELINES}"

"${PYTHON_BIN}" "${PARALLEL_SCRIPT}" \
  --prompts-dir "${SLIDE_SESSION_DIR}/prompts" \
  --output-dir "${SLIDE_SESSION_DIR}/images" \
  --api-key "${GEMINI_API_KEY}" \
  --max-parallel 12 \
  --max-retries 3 \
  --logo "${LOGO_PATH}"

"${PYTHON_BIN}" "${EXPORT_SCRIPT}" \
  --input-dir "${SLIDE_SESSION_DIR}/images" \
  --output "${PROJECT_DIR}/slides/${PROJECT_NAME}.pdf"

slide_idx=1
for img in $(find "${SLIDE_SESSION_DIR}/images" -maxdepth 1 -name 'slide_*.png' | sort); do
  cp "$img" "${PROJECT_DIR}/slides/slide_$(printf '%02d' "${slide_idx}").png"
  slide_idx=$((slide_idx + 1))
done

log INFO "${WORKER}: generate instagram images"
# IG_PLAN may already be inside IG_SESSION_DIR/json/ (parent agent creates it there).
# Avoid same-file cp error under set -euo pipefail.
_ig_plan_real="$(realpath "${IG_PLAN}" 2>/dev/null || true)"
_ig_dst_real="$(realpath "${IG_SESSION_DIR}/json/ig_plan.json" 2>/dev/null || true)"
if [[ "${_ig_plan_real}" != "${_ig_dst_real}" ]]; then
  cp "${IG_PLAN}" "${IG_SESSION_DIR}/json/"
fi
IG_TEMPLATE="${SKILL_DIR}/templates/ig_prompt_template.j2"
if [[ -f "${IG_TEMPLATE}" ]]; then
  "${PYTHON_BIN}" "${PROMPT_SCRIPT}" \
    --session-dir "${IG_SESSION_DIR}" \
    --json-file json/ig_plan.json \
    --output-dir prompts \
    --design-guidelines "${DESIGN_GUIDELINES}" \
    --template-path "${IG_TEMPLATE}" \
    --image-size 1K
else
  "${PYTHON_BIN}" "${PROMPT_SCRIPT}" \
    --session-dir "${IG_SESSION_DIR}" \
    --json-file json/ig_plan.json \
    --output-dir prompts \
    --design-guidelines "${DESIGN_GUIDELINES}" \
    --image-size 1K
fi

"${PYTHON_BIN}" "${PARALLEL_SCRIPT}" \
  --prompts-dir "${IG_SESSION_DIR}/prompts" \
  --output-dir "${IG_SESSION_DIR}/images" \
  --api-key "${GEMINI_API_KEY}" \
  --max-parallel 10 \
  --max-retries 3 \
  --image-size 1K

python3 - <<PY
import json, glob, shutil, os
project_dir = $(json_escape "$PROJECT_DIR")
session_dir = os.path.join(project_dir, 'sns/instagram/session')
out_dir = os.path.join(project_dir, 'sns/instagram')
plan = json.load(open(os.path.join(session_dir, 'json/ig_plan.json')))
imgs = sorted(glob.glob(os.path.join(session_dir, 'images', '*.png')))
if len(imgs) < len(plan['slides']):
    raise SystemExit(f'IG images missing: {len(imgs)}/{len(plan["slides"])}')
for item, img in zip(plan['slides'], imgs):
    dst = os.path.join(out_dir, item['id'] + '.png')
    shutil.copy(img, dst)
    print(f'{os.path.basename(img)} -> {os.path.basename(dst)}')
PY

if ! exists_all_relative "slides/${PROJECT_NAME}.pdf"; then
  mark_error "${WORKER}" "slide PDF missing"
  exit 1
fi

ig_count=$(find "${PROJECT_DIR}/sns/instagram" -maxdepth 1 -name 'ig_*.png' | wc -l | tr -d ' ')
if [[ "${ig_count}" -lt 10 ]]; then
  mark_error "${WORKER}" "IG images missing after generation"
  exit 1
fi

mark_done "${WORKER}" \
  "slides/${PROJECT_NAME}.pdf" \
  "slides/slide_01.png" \
  "sns/instagram/ig_01_problem.png"
log INFO "${WORKER}: done"
