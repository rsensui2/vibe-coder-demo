#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${1:?usage: <script> <project_dir> <project_name>}"
PROJECT_NAME="${2:?usage: <script> <project_dir> <project_name>}"
ORCH_DIR="${PROJECT_DIR}/orchestrator"
STATUS_DIR="${ORCH_DIR}/status"
LOG_DIR="${ORCH_DIR}/logs"
MANIFEST_FILE="${ORCH_DIR}/manifest.json"
STATE_FILE="${ORCH_DIR}/state.json"

mkdir -p "${STATUS_DIR}" "${LOG_DIR}"

# manifest.json に projectName があれば CLI 引数より優先（一貫性保証）
if [[ -f "${MANIFEST_FILE}" ]]; then
  _manifest_project_name="$(jq -r '.projectName // empty' "${MANIFEST_FILE}" 2>/dev/null)"
  if [[ -n "${_manifest_project_name}" ]]; then
    PROJECT_NAME="${_manifest_project_name}"
  fi
fi

json_escape() {
  jq -Rsa . <<<"${1}"
}

manifest_get() {
  local key="$1"
  local default_value="${2:-}"
  if [[ -f "${MANIFEST_FILE}" ]]; then
    jq -r --arg key "$key" --arg def "$default_value" '.[$key] // $def' "${MANIFEST_FILE}"
  else
    printf '%s\n' "$default_value"
  fi
}

manifest_get_array_json() {
  local key="$1"
  local default_json="$2"
  if [[ -f "${MANIFEST_FILE}" ]]; then
    jq -c --arg key "$key" --argjson def "$default_json" '.[$key] // $def' "${MANIFEST_FILE}"
  else
    printf '%s\n' "$default_json"
  fi
}

project_title() {
  manifest_get "projectTitle" "${PROJECT_NAME}"
}

tagline() {
  manifest_get "tagline" "${PROJECT_NAME}"
}

project_brief() {
  manifest_get "brief" "${PROJECT_NAME} のデモを作る"
}

log() {
  local level="$1"
  shift
  printf '[%s] [%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$level" "$*"
}

require_bin() {
  local missing=0
  for bin in "$@"; do
    if ! command -v "$bin" >/dev/null 2>&1; then
      log ERROR "missing required binary: $bin" >&2
      missing=1
    fi
  done
  [[ "$missing" -eq 0 ]]
}

write_state() {
  local phase="$1"
  local detail="${2:-}"
  jq -n \
    --arg phase "$phase" \
    --arg detail "$detail" \
    --arg updatedAt "$(date -Iseconds)" \
    '{phase:$phase, detail:$detail, updatedAt:$updatedAt}' > "${STATE_FILE}"
}

mark_done() {
  local worker="$1"
  shift
  jq -n \
    --arg worker "$worker" \
    --arg finishedAt "$(date -Iseconds)" \
    --argjson outputs "$(printf '%s\n' "$@" | jq -R . | jq -s .)" \
    '{worker:$worker,status:"done",finishedAt:$finishedAt,outputs:$outputs}' > "${STATUS_DIR}/${worker}.done.json"
  rm -f "${STATUS_DIR}/${worker}.error.json"
}

mark_error() {
  local worker="$1"
  local reason="$2"
  jq -n \
    --arg worker "$worker" \
    --arg finishedAt "$(date -Iseconds)" \
    --arg reason "$reason" \
    '{worker:$worker,status:"error",finishedAt:$finishedAt,reason:$reason}' > "${STATUS_DIR}/${worker}.error.json"
}

exists_all_relative() {
  local missing=0
  for rel in "$@"; do
    [[ -e "${PROJECT_DIR}/${rel}" ]] || missing=1
  done
  return "$missing"
}

repo_root() {
  git -C "${PROJECT_DIR}" rev-parse --show-toplevel 2>/dev/null || dirname "$(dirname "${PROJECT_DIR}")"
}

latest_slide_session_dir() {
  find "${PROJECT_DIR}/slides/slides_output" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | sort | tail -n 1
}

safe_slug() {
  printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9_-]/_/g'
}
