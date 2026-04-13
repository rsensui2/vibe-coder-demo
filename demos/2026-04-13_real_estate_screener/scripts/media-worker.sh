#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=./common.sh
source "${SCRIPT_DIR}/common.sh" "$@"

WORKER="media_worker"
require_bin ffmpeg ffprobe jq

TITLE="$(project_title)"
TAGLINE="$(tagline)"
BRIEF="$(project_brief)"
AUDIO_PATH="${PROJECT_DIR}/audio/intro.mp3"
VIDEO_PATH="${PROJECT_DIR}/video/promo.mp4"
mkdir -p "${PROJECT_DIR}/audio" "${PROJECT_DIR}/video"

log INFO "${WORKER}: generate audio"
if [[ ! -f "${AUDIO_PATH}" ]]; then
  FISH_API_KEY="${FISH_API_KEY:-$(jq -r '.api_key // empty' ~/.openclaw/secrets/fish-audio.json 2>/dev/null)}"
  SCRIPT="${TITLE}。${TAGLINE}。${BRIEF}。物件探しにかかる時間を、AIが劇的に短縮します。SUUMO・アットホーム・ホームズを毎日手動でチェックする必要は、もうありません。条件を設定したら、あとはHomeScan AIが全部見てきます。"
  if [[ -n "${FISH_API_KEY}" ]]; then
    curl -sS -X POST https://api.fish.audio/v1/tts \
      -H "Authorization: Bearer ${FISH_API_KEY}" \
      -H 'Content-Type: application/json' \
      -d "$(jq -cn --arg text "$SCRIPT" '{text:$text,format:"mp3",mp3_bitrate:128}')" \
      --output "${AUDIO_PATH}" || true
  fi
fi

if [[ ! -f "${AUDIO_PATH}" ]]; then
  ffmpeg -y -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -t 12 -q:a 9 -acodec libmp3lame "${AUDIO_PATH}" >/dev/null 2>&1
fi

log INFO "${WORKER}: wait for slide images"
WAIT_LIMIT="${MEDIA_WAIT_SECONDS:-1200}"
WAITED=0
while [[ "${WAITED}" -lt "${WAIT_LIMIT}" ]]; do
  count=$(find "${PROJECT_DIR}/slides" -maxdepth 1 -name 'slide_*.png' 2>/dev/null | wc -l | tr -d ' ')
  if [[ "${count}" -ge 6 ]]; then
    break
  fi
  sleep 15
  WAITED=$((WAITED + 15))
done

if [[ "$(find "${PROJECT_DIR}/slides" -maxdepth 1 -name 'slide_*.png' 2>/dev/null | wc -l | tr -d ' ')" -lt 1 ]]; then
  mark_error "${WORKER}" "no slide images found for video build"
  exit 1
fi

LIST_FILE="${PROJECT_DIR}/video/slides.txt"
find "${PROJECT_DIR}/slides" -maxdepth 1 -name 'slide_*.png' | sort > /tmp/seminar_demo_v2_media_slides.txt
: > "${LIST_FILE}"
last=''
while IFS= read -r img; do
  printf "file '%s'\n" "$img" >> "${LIST_FILE}"
  printf "duration 5\n" >> "${LIST_FILE}"
  last="$img"
done < /tmp/seminar_demo_v2_media_slides.txt
if [[ -n "$last" ]]; then
  printf "file '%s'\n" "$last" >> "${LIST_FILE}"
fi
rm -f /tmp/seminar_demo_v2_media_slides.txt

log INFO "${WORKER}: build promo video"
ffmpeg -y \
  -f concat -safe 0 -i "${LIST_FILE}" \
  -i "${AUDIO_PATH}" \
  -filter_complex "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black,format=yuv420p[v];[1:a]apad[a]" \
  -map "[v]" -map "[a]" \
  -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -t 30 \
  "${VIDEO_PATH}" >/dev/null 2>&1

if ! exists_all_relative "audio/intro.mp3" "video/promo.mp4"; then
  mark_error "${WORKER}" "audio or video missing"
  exit 1
fi

mark_done "${WORKER}" "audio/intro.mp3" "video/promo.mp4"
log INFO "${WORKER}: done"
