#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=./common.sh
source "${SCRIPT_DIR}/common.sh" "$@"

require_bin bash jq

TIMEOUT_SECONDS="${TIMEOUT_SECONDS:-2400}"
POLL_SECONDS="${POLL_SECONDS:-30}"
MAX_RETRIES="${MAX_RETRIES:-2}"
START_TS=$(date +%s)
SUPERVISOR_LOG="${LOG_DIR}/supervisor.log"

mkdir -p "${STATUS_DIR}" "${LOG_DIR}"
: > "${SUPERVISOR_LOG}"

log_supervisor() {
  log INFO "$*" | tee -a "${SUPERVISOR_LOG}"
}

worker_script() {
  case "$1" in
    slides_ig_worker) echo "${SCRIPT_DIR}/slides-ig-worker.sh" ;;
    lp_suite_worker) echo "${SCRIPT_DIR}/lp-suite-worker.sh" ;;
    mock_docs_worker) echo "${SCRIPT_DIR}/mock-docs-worker.sh" ;;
    media_worker) echo "${SCRIPT_DIR}/media-worker.sh" ;;
    *) return 1 ;;
  esac
}

worker_outputs_ready() {
  case "$1" in
    slides_ig_worker)
      exists_all_relative "slides/${PROJECT_NAME}.pdf" "slides/slide_01.png" && [[ "$(find "${PROJECT_DIR}/sns/instagram" -maxdepth 1 -name 'ig_*.png' | wc -l | tr -d ' ')" -ge 10 ]]
      ;;
    lp_suite_worker)
      exists_all_relative "lp/pattern1_modern.html" "lp/pattern2_premium.html" "lp/pattern3_casual.html"
      ;;
    mock_docs_worker)
      exists_all_relative "mock/app_mock.html" "docs/01_executive_summary.md" "docs/05_market_research.md"
      ;;
    media_worker)
      exists_all_relative "audio/intro.mp3" "video/promo.mp4"
      ;;
    *) return 1 ;;
  esac
}

read_attempts() {
  local worker="$1"
  local meta="${STATUS_DIR}/${worker}.run.json"
  if [[ -f "${meta}" ]]; then
    jq -r '.attempts // 0' "${meta}"
  else
    echo 0
  fi
}

read_pid() {
  local worker="$1"
  local meta="${STATUS_DIR}/${worker}.run.json"
  if [[ -f "${meta}" ]]; then
    jq -r '.pid // empty' "${meta}"
  fi
}

write_run_meta() {
  local worker="$1"
  local pid="$2"
  local attempts="$3"
  jq -n \
    --arg worker "$worker" \
    --arg pid "$pid" \
    --argjson attempts "$attempts" \
    --arg startedAt "$(date -Iseconds)" \
    '{worker:$worker,pid:$pid,attempts:$attempts,startedAt:$startedAt}' > "${STATUS_DIR}/${worker}.run.json"
}

start_worker_bg() {
  local worker="$1"
  local script
  script="$(worker_script "$worker")"
  local attempts
  attempts=$(read_attempts "$worker")
  attempts=$((attempts + 1))
  local worker_log="${LOG_DIR}/${worker}.log"
  rm -f "${STATUS_DIR}/${worker}.error.json"
  log_supervisor "start ${worker} attempt=${attempts}"
  (
    bash "$script" "$PROJECT_DIR" "$PROJECT_NAME"
  ) >> "${worker_log}" 2>&1 &
  local pid=$!
  write_run_meta "$worker" "$pid" "$attempts"
}

ensure_worker_running() {
  local worker="$1"
  if worker_outputs_ready "$worker"; then
    [[ -f "${STATUS_DIR}/${worker}.done.json" ]] || mark_done "$worker"
    return 0
  fi

  local pid
  pid="$(read_pid "$worker")"
  local attempts
  attempts="$(read_attempts "$worker")"

  if [[ -n "${pid}" ]] && kill -0 "${pid}" 2>/dev/null; then
    return 0
  fi

  if [[ -f "${STATUS_DIR}/${worker}.error.json" ]]; then
    if [[ "${attempts}" -lt "${MAX_RETRIES}" ]]; then
      start_worker_bg "$worker"
      return 0
    fi
    return 1
  fi

  if [[ -n "${pid}" ]] && ! kill -0 "${pid}" 2>/dev/null; then
    if [[ "${attempts}" -lt "${MAX_RETRIES}" ]]; then
      mark_error "$worker" "worker exited before outputs were ready"
      start_worker_bg "$worker"
      return 0
    fi
    mark_error "$worker" "worker exited and retries exhausted"
    return 1
  fi

  if [[ "${attempts}" -eq 0 ]]; then
    start_worker_bg "$worker"
  fi
}

all_required_ready() {
  worker_outputs_ready slides_ig_worker && \
  worker_outputs_ready lp_suite_worker && \
  worker_outputs_ready mock_docs_worker && \
  worker_outputs_ready media_worker
}

write_state "launch_workers" "starting workers"
for worker in slides_ig_worker lp_suite_worker mock_docs_worker media_worker; do
  start_worker_bg "$worker"
done

write_state "supervise" "waiting for required artifacts"
while true; do
  elapsed=$(( $(date +%s) - START_TS ))
  failed=0
  for worker in slides_ig_worker lp_suite_worker mock_docs_worker media_worker; do
    ensure_worker_running "$worker" || failed=$((failed + 1))
  done

  if all_required_ready; then
    write_state "deploy" "all required artifacts ready"
    log_supervisor "all required artifacts ready, running deploy"
    bash "${SCRIPT_DIR}/deploy-demo-v2.sh" "$PROJECT_DIR" "$PROJECT_NAME"
    write_state "completed" "deploy finished"
    exit 0
  fi

  if [[ "$elapsed" -ge "$TIMEOUT_SECONDS" ]]; then
    write_state "partial_deploy" "timeout reached, deploying partial artifacts"
    log_supervisor "timeout reached, running partial deploy"
    bash "${SCRIPT_DIR}/deploy-demo-v2.sh" --partial "$PROJECT_DIR" "$PROJECT_NAME"
    write_state "completed_partial" "partial deploy finished"
    exit 0
  fi

  if [[ "$failed" -ge 4 ]]; then
    write_state "failed" "all workers exhausted retries"
    log_supervisor "all workers exhausted retries"
    exit 1
  fi

  sleep "$POLL_SECONDS"
done
