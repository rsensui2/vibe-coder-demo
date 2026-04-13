#!/usr/bin/env bash
set -euo pipefail

PARTIAL=0
if [[ "${1:-}" == "--partial" ]]; then
  PARTIAL=1
  shift
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=./common.sh
source "${SCRIPT_DIR}/common.sh" "$@"

require_bin jq git python3

PROJECT_ID="$(basename "${PROJECT_DIR}")"
PROJECT_TITLE="$(project_title)"
TAGLINE="$(tagline)"
BRIEF="$(project_brief)"
REPO_ROOT="$(repo_root)"
PAGES_BASE="$(manifest_get "githubPagesBase" "https://vibe-coder-demo.pages.dev/demos")"
SLACK_CHANNEL="$(manifest_get "slackChannel" "C0AEPA518HF")"
TOP_INDEX="${REPO_ROOT}/index.html"
PORTFOLIO_HTML="${PROJECT_DIR}/index.html"
STATUS_NOTE="complete"
[[ "${PARTIAL}" -eq 1 ]] && STATUS_NOTE="partial"

capture_screenshots() {
  local ok=0
  if command -v node >/dev/null 2>&1 && [[ -d /home/rsensui/.npm-global/lib/node_modules/playwright ]]; then
    eval "$(/home/rsensui/.local/share/fnm/fnm env)"
    export NODE_PATH="$(npm root -g)"
    node <<'NODE' || return 1
const pw = require('/home/rsensui/.npm-global/lib/node_modules/playwright');
const path = require('path');
const projectDir = process.env.PROJECT_DIR;
(async () => {
  const browser = await pw.chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const pairs = [
    ['lp/pattern1_modern.html', 'screenshots/lp_pattern1.png'],
    ['lp/pattern2_premium.html', 'screenshots/lp_pattern2.png'],
    ['lp/pattern3_casual.html', 'screenshots/lp_pattern3.png'],
    ['mock/app_mock.html', 'screenshots/mock_app.png'],
  ];
  for (const [src, dst] of pairs) {
    const full = 'file://' + path.join(projectDir, src);
    try {
      await page.goto(full, { waitUntil: 'networkidle', timeout: 15000 });
      await page.screenshot({ path: path.join(projectDir, dst), fullPage: true });
    } catch (err) {
      console.error(`screenshot failed for ${src}: ${err.message}`);
    }
  }
  await browser.close();
})().catch((err) => { console.error(err); process.exit(1); });
NODE
      ok=1
  fi
  return $((1-ok))
}

build_portfolio_html() {
  python3 - <<'PY'
from pathlib import Path
import html, json, os
project_dir = Path(os.environ['PROJECT_DIR'])
project_name = os.environ['PROJECT_NAME']
project_id = os.environ['PROJECT_ID']
project_title = os.environ['PROJECT_TITLE']
tagline = os.environ['TAGLINE']
brief = os.environ['BRIEF']
pages_base = os.environ['PAGES_BASE']
portfolio = project_dir / 'index.html'
slides = sorted((project_dir / 'slides').glob('slide_*.png'))
igs = sorted((project_dir / 'sns' / 'instagram').glob('ig_*.png'))
status_items = [
    ('LP', (project_dir / 'lp' / 'pattern1_modern.html').exists()),
    ('Mock', (project_dir / 'mock' / 'app_mock.html').exists()),
    ('Slides', (project_dir / 'slides' / f'{project_name}.pdf').exists()),
    ('Video', (project_dir / 'video' / 'promo.mp4').exists()),
    ('Audio', (project_dir / 'audio' / 'intro.mp3').exists()),
    ('IG', len(igs) >= 10),
    ('Docs', (project_dir / 'docs' / '05_market_research.md').exists()),
]
slide_thumbs = '\n'.join(
    f"<div class='slide-thumb' onclick=\"openModal('slides/{p.name}')\"><img src='slides/{p.name}' alt='{p.name}'></div>"
    for p in slides
)
ig_grid = '\n'.join(
    f"<div class='ig-item' onclick=\"openModal('sns/instagram/{p.name}')\"><img src='sns/instagram/{p.name}' alt='{p.name}'></div>"
    for p in igs
)
status_html = '\n'.join(
    f"<div class='status-chip'><span class='dot {'dot-green' if ok else 'dot-gray'}'></span>{html.escape(name)}</div>"
    for name, ok in status_items
)
doc_links = [
    ('概要', 'docs/01_executive_summary.md'),
    ('課題定義', 'docs/02_problem_statement.md'),
    ('ソリューション', 'docs/03_solution.md'),
    ('ビジネスモデル', 'docs/04_business_model.md'),
    ('市場調査', 'docs/05_market_research.md'),
]
doc_cards = '\n'.join(
    f"<a class='card' href='{href}' target='_blank' rel='noreferrer'><div class='card-body'><div class='card-tag'>Document</div><div class='card-title'>{label}</div><div class='card-desc'>{href}</div></div></a>"
    for label, href in doc_links if (project_dir / href).exists()
)
html_out = f"""<!DOCTYPE html>
<html lang='ja'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>{html.escape(project_title)} | Demo</title>
  <style>
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; font-family: Inter, 'Noto Sans JP', sans-serif; background: #0a0a0a; color: #ededed; font-size: 17px; line-height: 1.7; }}
    a {{ color: inherit; }}
    .hero {{ padding: 88px 24px 56px; text-align: center; border-bottom: 1px solid #1f1f1f; }}
    .badge {{ display:inline-block; padding:6px 14px; border:1px solid #2a2a2a; border-radius:999px; color:#aaa; font-size:12px; margin-bottom:16px; }}
    h1 {{ font-size: clamp(2.2rem, 6vw, 3.8rem); margin: 0 0 12px; }}
    .tagline {{ color:#9ca3af; max-width: 720px; margin:0 auto 24px; }}
    .container {{ max-width: 1120px; margin: 0 auto; padding: 0 24px 72px; }}
    section {{ padding: 48px 0; border-bottom: 1px solid #151515; }}
    .section-header {{ display:flex; align-items:center; gap:12px; margin-bottom:24px; }}
    .section-line {{ flex:1; height:1px; background:#222; }}
    .status-bar {{ display:flex; gap:10px; flex-wrap:wrap; margin-top: 28px; }}
    .status-chip {{ display:flex; align-items:center; gap:8px; padding:6px 12px; border:1px solid #262626; border-radius:999px; color:#b3b3b3; background:#111; font-size:12px; }}
    .dot {{ width:8px; height:8px; border-radius:50%; display:inline-block; }}
    .dot-green {{ background:#22c55e; box-shadow:0 0 8px rgba(34,197,94,.5); }}
    .dot-gray {{ background:#555; }}
    .grid-3 {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:16px; }}
    .card {{ background:#111; border:1px solid #222; border-radius:14px; overflow:hidden; text-decoration:none; display:block; }}
    .card:hover {{ border-color:#444; transform:translateY(-1px); }}
    .card-img {{ width:100%; aspect-ratio:16/9; object-fit:cover; display:block; background:#1a1a1a; }}
    .card-body {{ padding:18px 20px; }}
    .card-tag {{ font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:#6b7280; margin-bottom:6px; }}
    .card-title {{ font-size:1rem; font-weight:700; margin-bottom:6px; }}
    .card-desc {{ color:#9ca3af; font-size:.9rem; }}
    .slides-row {{ display:flex; gap:12px; overflow:auto; }}
    .slide-thumb {{ flex:0 0 240px; aspect-ratio:16/9; border:1px solid #222; border-radius:10px; overflow:hidden; cursor:pointer; }}
    .slide-thumb img, .ig-item img {{ width:100%; height:100%; object-fit:cover; display:block; }}
    .ig-grid {{ display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:10px; }}
    .ig-item {{ aspect-ratio:1; border:1px solid #222; border-radius:10px; overflow:hidden; cursor:pointer; }}
    .links {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:14px; }}
    .link-block {{ padding:16px 18px; border:1px solid #222; border-radius:12px; background:#111; }}
    #modal {{ display:none; position:fixed; inset:0; background:rgba(0,0,0,.92); z-index:9999; align-items:center; justify-content:center; }}
    #modal.open {{ display:flex; }}
    #modal img {{ max-width:90vw; max-height:88vh; border-radius:8px; object-fit:contain; }}
    #modal-close {{ position:absolute; top:16px; right:20px; background:none; border:none; color:#fff; font-size:2rem; cursor:pointer; }}
  </style>
</head>
<body>
  <div class='hero'>
    <div class='badge'>Vibe Coder Bootcamp Demo</div>
    <h1>{html.escape(project_title)}</h1>
    <p class='tagline'>{html.escape(tagline)}<br>{html.escape(brief)}</p>
    <div class='status-bar'>{status_html}</div>
  </div>
  <div class='container'>
    <section>
      <div class='section-header'><strong>成果物リンク</strong><div class='section-line'></div></div>
      <div class='links'>
        <div class='link-block'><a href='lp/pattern1_modern.html' target='_blank'>LP1</a></div>
        <div class='link-block'><a href='lp/pattern2_premium.html' target='_blank'>LP2</a></div>
        <div class='link-block'><a href='lp/pattern3_casual.html' target='_blank'>LP3</a></div>
        <div class='link-block'><a href='mock/app_mock.html' target='_blank'>Mock App</a></div>
        <div class='link-block'><a href='slides/{project_name}.pdf' target='_blank'>Slides PDF</a></div>
        <div class='link-block'><a href='video/promo.mp4' target='_blank'>Promo Video</a></div>
        <div class='link-block'><a href='audio/intro.mp3' target='_blank'>Audio Intro</a></div>
      </div>
    </section>
    <section>
      <div class='section-header'><strong>LP / Mock</strong><div class='section-line'></div></div>
      <div class='grid-3'>
        <a class='card' href='lp/pattern1_modern.html' target='_blank'><img class='card-img' src='screenshots/lp_pattern1.png' alt='lp1'><div class='card-body'><div class='card-tag'>Landing Page</div><div class='card-title'>Pattern 1</div><div class='card-desc'>サイバーパンク</div></div></a>
        <a class='card' href='lp/pattern2_premium.html' target='_blank'><img class='card-img' src='screenshots/lp_pattern2.png' alt='lp2'><div class='card-body'><div class='card-tag'>Landing Page</div><div class='card-title'>Pattern 2</div><div class='card-desc'>ラグジュアリー</div></div></a>
        <a class='card' href='lp/pattern3_casual.html' target='_blank'><img class='card-img' src='screenshots/lp_pattern3.png' alt='lp3'><div class='card-body'><div class='card-tag'>Landing Page</div><div class='card-title'>Pattern 3</div><div class='card-desc'>プレイフル</div></div></a>
        <a class='card' href='mock/app_mock.html' target='_blank'><img class='card-img' src='screenshots/mock_app.png' alt='mock'><div class='card-body'><div class='card-tag'>Mock App</div><div class='card-title'>Agent Dispatch App</div><div class='card-desc'>5 screens iPhone UI</div></div></a>
      </div>
    </section>
    <section>
      <div class='section-header'><strong>Slides</strong><div class='section-line'></div></div>
      <div class='slides-row'>{slide_thumbs}</div>
    </section>
    <section>
      <div class='section-header'><strong>Instagram</strong><div class='section-line'></div></div>
      <div class='ig-grid'>{ig_grid}</div>
    </section>
    <section>
      <div class='section-header'><strong>Documents</strong><div class='section-line'></div></div>
      <div class='grid-3'>{doc_cards}</div>
    </section>
  </div>
  <div id='modal' onclick='closeModal()'><button id='modal-close'>✕</button><img id='modal-img' src=''></div>
  <script>
    function openModal(src) {{ document.getElementById('modal-img').src = src; document.getElementById('modal').classList.add('open'); }}
    function closeModal() {{ document.getElementById('modal').classList.remove('open'); }}
    document.addEventListener('keydown', (e) => {{ if (e.key === 'Escape') closeModal(); }});
  </script>
</body>
</html>
"""
portfolio.write_text(html_out, encoding='utf-8')
PY
}

update_top_portal() {
  python3 - <<'PY'
from pathlib import Path
import os
root_index = Path(os.environ['TOP_INDEX'])
project_id = os.environ['PROJECT_ID']
project_title = os.environ['PROJECT_TITLE']
tagline = os.environ['TAGLINE']
card = f"""
<section style=\"padding:24px; margin:24px; border:1px solid #222; border-radius:16px; background:#111;\">
  <a href=\"demos/{project_id}/\" style=\"text-decoration:none; color:inherit; display:block;\">
    <div style=\"font-size:12px; color:#9ca3af; text-transform:uppercase; letter-spacing:.12em; margin-bottom:8px;\">New Demo</div>
    <div style=\"font-size:28px; font-weight:800; margin-bottom:10px;\">{project_title}</div>
    <div style=\"color:#9ca3af;\">{tagline}</div>
  </a>
</section>
"""
if not root_index.exists():
    raise SystemExit(0)
text = root_index.read_text(encoding='utf-8')
if f"demos/{project_id}/" in text:
    raise SystemExit(0)
if '</main>' in text:
    text = text.replace('</main>', card + '\n</main>', 1)
elif '</body>' in text:
    text = text.replace('</body>', card + '\n</body>', 1)
else:
    text += card
root_index.write_text(text, encoding='utf-8')
PY
}

cleanup_artifacts() {
  rm -rf "${PROJECT_DIR}/video/remotion-project/node_modules" 2>/dev/null || true
  rm -rf "${PROJECT_DIR}/sns/instagram/session/prompts" "${PROJECT_DIR}/sns/instagram/session/images" 2>/dev/null || true
  rm -rf "${PROJECT_DIR}/slides/slides_output" 2>/dev/null || true
  find "${PROJECT_DIR}" -name node_modules -type d -prune -exec rm -rf {} + 2>/dev/null || true
}

commit_and_push() {
  local suffix=""
  if [[ "${PARTIAL}" -eq 1 ]]; then
    suffix=" (partial)"
  fi
  if [[ ! -d "${REPO_ROOT}/.git" ]]; then
    return 0
  fi
  git -C "${REPO_ROOT}" add -A
  if git -C "${REPO_ROOT}" diff --cached --quiet; then
    return 0
  fi
  git -C "${REPO_ROOT}" commit -m "demo: ${PROJECT_NAME}${suffix}"
  git -C "${REPO_ROOT}" push
}

# Push demo assets to the vibe-coder-demo repo (Cloudflare Pages source).
# rsensui2/ryoko is an internal archive; rsensui2/vibe-coder-demo is what CF Pages auto-deploys.
deploy_to_pages_repo() {
  local suffix=""
  [[ "${PARTIAL}" -eq 1 ]] && suffix=" (partial)"
  local VCD_REPO="git@github.com:rsensui2/vibe-coder-demo.git"
  local VCD_DIR="/tmp/vibe-coder-demo"

  if [[ -d "${VCD_DIR}/.git" ]]; then
    git -C "${VCD_DIR}" pull --ff-only 2>/dev/null || true
  else
    git clone "${VCD_REPO}" "${VCD_DIR}" || return 1
  fi

  local dest="${VCD_DIR}/demos/${PROJECT_ID}"
  rm -rf "${dest}"
  cp -r "${PROJECT_DIR}" "${dest}"

  git -C "${VCD_DIR}" add -A
  if git -C "${VCD_DIR}" diff --cached --quiet; then
    return 0
  fi
  git -C "${VCD_DIR}" -c user.name="Ryoko AI" -c user.email="ryoko@tekion.jp" \
    commit -m "demo: ${PROJECT_NAME}${suffix}"
  git -C "${VCD_DIR}" push
}

send_slack_report() {
  local mode_text="✅ ${PROJECT_TITLE} 全完了"
  if [[ "${PARTIAL}" -eq 1 ]]; then
    mode_text="⚠️ ${PROJECT_TITLE} 部分完了"
  fi
  local gateway_port gateway_token
  gateway_port="$(jq -r '.gateway.port // 18789' ~/.openclaw/openclaw.json 2>/dev/null)"
  gateway_token="$(jq -r '.gateway.auth.token // empty' ~/.openclaw/openclaw.json 2>/dev/null)"
  [[ -n "${gateway_token}" ]] || return 0
  local body
  body=$(jq -cn \
    --arg channel "slack" \
    --arg target "${SLACK_CHANNEL}" \
    --arg message "${mode_text}\n- LP1: ${PAGES_BASE}/${PROJECT_ID}/lp/pattern1_modern.html\n- LP2: ${PAGES_BASE}/${PROJECT_ID}/lp/pattern2_premium.html\n- LP3: ${PAGES_BASE}/${PROJECT_ID}/lp/pattern3_casual.html\n- モック: ${PAGES_BASE}/${PROJECT_ID}/mock/app_mock.html\n- スライド: ${PAGES_BASE}/${PROJECT_ID}/slides/${PROJECT_NAME}.pdf\n- 動画: ${PAGES_BASE}/${PROJECT_ID}/video/promo.mp4\n- 音声: ${PAGES_BASE}/${PROJECT_ID}/audio/intro.mp3\n- ポータル: ${PAGES_BASE}/${PROJECT_ID}/" \
    '{tool:"message",args:{action:"send",channel:$channel,target:$target,message:$message},sessionKey:"main"}')
  curl -fsS "http://127.0.0.1:${gateway_port}/tools/invoke" \
    -H "Authorization: Bearer ${gateway_token}" \
    -H 'Content-Type: application/json' \
    -d "${body}" >/dev/null || true
}

export PROJECT_DIR PROJECT_NAME PROJECT_ID PROJECT_TITLE TAGLINE BRIEF PAGES_BASE TOP_INDEX
capture_screenshots || true
build_portfolio_html
update_top_portal || true
cleanup_artifacts
commit_and_push
deploy_to_pages_repo || log WARN "deploy_to_pages_repo failed (continuing)"
send_slack_report
mark_done "deploy" "index.html" "screenshots/lp_pattern1.png"
write_state "completed" "deploy ${STATUS_NOTE}"
