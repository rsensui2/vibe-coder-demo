#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=./common.sh
source "${SCRIPT_DIR}/common.sh" "$@"

WORKER="mock_docs_worker"
require_bin claude

TITLE="$(project_title)"
TAGLINE="$(tagline)"
BRIEF="$(project_brief)"

PROMPT=$(cat <<EOF
あなたは日本語のプロダクトデザイナー兼事業企画者です。
現在のディレクトリ直下にある design_guidelines.md を読み、以下をすべて実装してください。

プロジェクト名: ${PROJECT_NAME}
表示名: ${TITLE}
タグライン: ${TAGLINE}
概要: ${BRIEF}
サービス名: HomeScan AI（ホームスキャン AI）

必須成果物:
1. mock/app_mock.html
2. docs/01_executive_summary.md
3. docs/02_problem_statement.md
4. docs/03_solution.md
5. docs/04_business_model.md
6. docs/05_market_research.md

mock/app_mock.html の要件:
- 単一HTML
- 日本語
- 5画面: ホーム（検索条件入力）, 物件一覧（AIスコア付き）, 物件詳細（AI分析レポート）, アラート設定, マイリスト
- iPhoneフレームをCSSだけで描画
- タブナビゲーションで画面切り替え
- カラー: 背景 #0D1B2A, アクセント #F5A623, テキスト #FAFAFA
- 物件カードにAIスコアバッジ（例: 87/100）を表示
- アラート画面に「新着通知」「値下がりアラート」「人気急上昇」のトグル
- 具体的な物件情報（エリア・家賃・間取り・スコア）を入れる

docs の要件:
- それぞれMarkdownで事業内容に即した本文を書く
- 企画書として読める密度にする
- テーマは 不動産情報AIスクリーニングサービス（HomeScan AI）
- 不動産市場の課題（情報分散・好物件の見極め困難・時間コスト）を含める
- SUUMO・アットホーム・ホームズなどの既存サービスとの差別化
- 日本の不動産市場規模・引越し件数・デジタル化の遅れを含める
- 収益モデル（フリーミアム SaaS）・競合分析・グロース戦略を含める

作業ルール:
- ファイルを直接保存する
- 完了時は短い要約のみ出力する
EOF
)

mkdir -p "${PROJECT_DIR}/mock" "${PROJECT_DIR}/docs"
cd "${PROJECT_DIR}"
claude --print --permission-mode bypassPermissions --model sonnet --effort high "$PROMPT" > "${LOG_DIR}/${WORKER}.claude.out"

if ! exists_all_relative \
  "mock/app_mock.html" \
  "docs/01_executive_summary.md" \
  "docs/02_problem_statement.md" \
  "docs/03_solution.md" \
  "docs/04_business_model.md" \
  "docs/05_market_research.md"; then
  mark_error "${WORKER}" "mock or docs missing"
  exit 1
fi

mark_done "${WORKER}" \
  "mock/app_mock.html" \
  "docs/01_executive_summary.md" \
  "docs/05_market_research.md"
log INFO "${WORKER}: done"
