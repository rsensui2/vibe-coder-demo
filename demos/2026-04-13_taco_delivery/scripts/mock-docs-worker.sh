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
サービス名: TacoRun（タコラン）

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
- 5画面: ホーム（店舗一覧・検索）, タコス選択＋カスタムトッピング, GPS追跡マップ, TacoPass会員ページ, 注文履歴・レビュー
- iPhoneフレームをCSSだけで描画
- タブナビゲーションで画面切り替え
- カラー: 背景 #1A0A00, アクセント #FF6B2B, テキスト #FFF8F0
- タコスカードに配達時間バッジ（例: 28分）とスパイス度（🌶️🌶️🌶️）を表示
- トッピング選択画面は具材アイコンをグリッドで並べてチェックボックスUI
- GPS追跡画面はCSSだけで描いた地図モック＋配達員アイコン＋「あと12分」ステータス
- TacoPass画面は会員カード風デザイン＋特典リスト
- 具体的なメニュー名・価格（例: カルニタスタコス ¥680, ティンガタコス ¥720）を入れる

docs の要件:
- それぞれMarkdownで事業内容に即した本文を書く
- 企画書として読める密度にする
- テーマは タコスデリバリーアプリ（TacoRun）
- 日本のフードデリバリー市場の課題（メキシカン専門店の少なさ・選択肢の偏り）を含める
- UberEats・Wolt・出前館などの既存サービスとの差別化
- 日本のフードデリバリー市場規模（1.2兆円）・メキシコ料理店増加トレンドを含める
- 収益モデル（手数料15% + TacoPassサブスク + 広告）・競合分析・グロース戦略を含める

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
