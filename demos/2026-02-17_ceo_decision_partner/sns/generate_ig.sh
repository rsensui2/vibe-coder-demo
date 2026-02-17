#!/bin/bash
set -e

SKILL_DIR="${HOME}/.openclaw/workspace/skills/nanobanana-slide-generator"
PYTHON="${SKILL_DIR}/venv/bin/python"
SCRIPT="${SKILL_DIR}/scripts/generate_slide_with_retry.py"
OUTPUT_DIR="/tmp/vibe-coder-demo/demos/2026-02-17_ceo_decision_partner/sns/instagram"

# Color scheme: Dark Navy #1B2A4A, Gold #C9A96E, Blue #3B7DD8, Light BG #F8F6F3

declare -A PROMPTS

PROMPTS[ig_01_decision_canvas]='Create a square 1080x1080px infographic image with a dark navy (#1B2A4A) background. Title at the top in gold (#C9A96E) text: "Decision Canvas". Subtitle in white: "6つの要素で意思決定を構造化" (meaning "Structure decisions with 6 elements"). Show a hexagonal diagram in the center with 6 connected nodes arranged in a circle. Each node is a rounded rectangle with gold border and white text inside. The 6 nodes read: "目的 Purpose", "選択肢 Options", "リスク Risk", "関係者 Stakeholders", "期限 Timeline", "判断基準 Criteria". Lines connect all nodes to a central circle labeled "決断 Decision" in gold. Clean, modern corporate infographic style. Bottom right corner: small "CEO Decision Partner" text in gray. Professional, minimal design with subtle blue (#3B7DD8) accent lines.'

PROMPTS[ig_02_problem]='Create a square 1080x1080px infographic image with dark navy (#1B2A4A) background. Large headline in gold (#C9A96E): "経営者の82%" (meaning "82% of CEOs"). Below in white large text: "相談相手がいない" (meaning "have no one to consult"). Show a large circular percentage chart: 82% filled in gold, 18% in dark gray. Below the chart, three bullet points in white text with blue (#3B7DD8) icons: "判断に平均23日" (avg 23 days to decide), "機会損失：売上の12%" (opportunity cost: 12% of revenue), "成功率2.3倍の差" (2.3x success rate difference). Bottom: "CEO Decision Partner" in small gray text. Clean corporate infographic, modern minimal style.'

PROMPTS[ig_03_features]='Create a square 1080x1080px infographic with dark navy (#1B2A4A) background. Title in gold (#C9A96E): "4つのコア機能" (meaning "4 Core Features"). Show 4 feature cards arranged in a 2x2 grid. Each card has a dark blue (#2A3A5A) background with gold icon and white text. Card 1: brain icon, "AI壁打ち" (AI Sparring), subtitle "24時間いつでも相談". Card 2: grid/canvas icon, "Decision Canvas", subtitle "6要素で構造化". Card 3: chart icon, "データ分析", subtitle "市場・競合を即座に分析". Card 4: heart icon, "メンタルサポート", subtitle "経営者の心に寄り添う". Blue (#3B7DD8) accent lines between cards. Bottom: "CEO Decision Partner" logo text. Modern, clean corporate style.'

PROMPTS[ig_04_pricing]='Create a square 1080x1080px pricing comparison infographic with dark navy (#1B2A4A) background. Title in gold (#C9A96E): "料金プラン" (meaning "Pricing Plans"). Show 3 pricing columns side by side. Left column (dark blue bg): "Starter" in white, "¥9,800/月" in gold, bullets: "月30回相談", "基本Canvas機能". Center column (highlighted with gold border, slightly larger): "Pro" with a "人気" (Popular) badge in gold, "¥29,800/月" in large gold text, bullets: "無制限相談", "Canvas保存・共有", "優先サポート". Right column (dark blue bg): "Enterprise" in white, "要相談" in gold, bullets: "複数経営者対応", "カスタマイズ", "専任サポート". Bottom banner in blue (#3B7DD8): "14日間無料トライアル" (14-day free trial). Clean corporate pricing table design.'

PROMPTS[ig_05_persona]='Create a square 1080x1080px persona infographic with dark navy (#1B2A4A) background. Title in gold (#C9A96E): "ペルソナ" (Persona). Show a simple illustrated avatar of a 45-year-old Japanese businessman in a suit (clean vector style, not photo). Name card: "田中太郎（45歳）" in white. Info cards below with blue (#3B7DD8) icons: "製造業CEO・社員50名" (Manufacturing CEO, 50 employees), "課題：海外展開の判断" (Challenge: overseas expansion decision), "悩み：相談相手がいない" (Pain: no one to consult), "理想：構造化された思考プロセス" (Goal: structured thinking process). Before/After section at bottom: "Before: 判断に23日 → After: 7日に短縮" in gold text. Modern corporate infographic style.'

PROMPTS[ig_06_tips]='Create a square 1080x1080px infographic with dark navy (#1B2A4A) background. Title in gold (#C9A96E): "意思決定の5つのTips" (meaning "5 Decision-Making Tips"). Show 5 numbered items vertically with gold number circles and white text. 1: "72時間ルール — 重要な判断は寝かせる" (72-hour rule). 2: "10-10-10テスト — 3つの時間軸で考える" (10-10-10 test). 3: "プレモーテム — 失敗を事前に想定" (Pre-mortem). 4: "反転テスト — ゼロから始めるか？" (Inversion test). 5: "2-way door判定 — やり直せるか？" (2-way door). Each item has a subtle blue (#3B7DD8) divider line. Bottom: "CEO Decision Partner" text. Clean numbered list infographic style.'

PROMPTS[ig_07_comparison]='Create a square 1080x1080px comparison table infographic with dark navy (#1B2A4A) background. Title in gold (#C9A96E): "サービス比較" (meaning "Service Comparison"). Show a comparison table with 4 rows and 4 columns. Header row in gold: empty, "コンサル" (Consulting), "コーチ" (Coach), "CDP" (highlighted in gold). Row 1 "費用": "30万〜/月", "15万〜/月", "9,800円〜/月" (CDP cell highlighted). Row 2 "頻度": "月1-2回", "週1回", "24時間365日" (CDP highlighted). Row 3 "即応性": "要予約", "要予約", "即座に対応" (CDP highlighted). Row 4 "カスタマイズ": "△", "○", "◎" (CDP highlighted). CDP column has a subtle gold glow. Bottom: blue (#3B7DD8) banner "CEO Decision Partner が選ばれる理由". Modern clean table design.'

PROMPTS[ig_08_roadmap]='Create a square 1080x1080px roadmap infographic with dark navy (#1B2A4A) background. Title in gold (#C9A96E): "3年ロードマップ" (meaning "3-Year Roadmap"). Show a vertical timeline with 3 major milestones connected by a gold line. Year 1 (2026) with blue (#3B7DD8) circle: "サービスローンチ" (Service Launch), bullets: "個人経営者向け", "Decision Canvas v1". Year 2 (2027) with gold circle: "機能拡張" (Feature Expansion), bullets: "チーム意思決定対応", "業界特化モデル", "API連携". Year 3 (2028) with larger gold circle: "エコシステム構築" (Ecosystem), bullets: "経営者コミュニティ", "メンターマッチング", "グローバル展開". Bottom: "CEO Decision Partner" text. Clean timeline infographic style.'

PROMPTS[ig_09_testimonial]='Create a square 1080x1080px testimonial infographic with dark navy (#1B2A4A) background. Title in gold (#C9A96E): "利用者の声" (meaning "User Testimonials"). Show 3 testimonial cards stacked vertically with dark blue (#2A3A5A) card backgrounds. Card 1: quote mark icon in gold, "深夜でも相談できるのが最高" (Great that I can consult even late at night), attribution: "IT企業CEO・38歳" in gray, 5 gold stars. Card 2: "Decision Canvasで役員会が変わった" (Decision Canvas changed our board meetings), "製造業社長・52歳", 5 gold stars. Card 3: "コンサルの1/10の費用で10倍使える" (10x usage at 1/10 the cost of consulting), "飲食チェーンオーナー・47歳", 5 gold stars. Blue (#3B7DD8) accent lines. Bottom: "CEO Decision Partner". Clean modern testimonial layout.'

PROMPTS[ig_10_cta]='Create a square 1080x1080px call-to-action infographic with dark navy (#1B2A4A) background. Large centered headline in gold (#C9A96E): "もう一人で悩まない" (meaning "No more deciding alone"). Subtitle in white: "経営の意思決定に、AIパートナーを" (An AI partner for business decisions). Center: a glowing gold button-like element reading "14日間無料トライアル" (14-day free trial) with a subtle glow effect. Below the button, 3 benefit points in white with blue (#3B7DD8) check icons: "24時間365日対応", "Decision Canvasで構造化", "月額9,800円から". Bottom: "CEO Decision Partner" and "Powered by Ryoko_AI" in small gray text. Bold, impactful CTA design with dramatic lighting. Modern premium feel.'

# Generate all 10 images in parallel (max 5 at a time)
PIDS=()
for name in ig_01_decision_canvas ig_02_problem ig_03_features ig_04_pricing ig_05_persona ig_06_tips ig_07_comparison ig_08_roadmap ig_09_testimonial ig_10_cta; do
  ${PYTHON} ${SCRIPT} \
    --prompt "${PROMPTS[$name]}" \
    --output "${OUTPUT_DIR}/${name}.png" \
    --max-retries 3 &
  PIDS+=($!)
  
  # Limit to 5 parallel
  if [ ${#PIDS[@]} -ge 5 ]; then
    wait ${PIDS[0]}
    PIDS=("${PIDS[@]:1}")
  fi
done

# Wait for remaining
for pid in "${PIDS[@]}"; do
  wait $pid
done

echo "✅ All 10 images generated"
ls -la ${OUTPUT_DIR}/
