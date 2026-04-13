#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=./common.sh
source "${SCRIPT_DIR}/common.sh" "$@"

WORKER="lp_suite_worker"
require_bin claude jq

TITLE="$(project_title)"
TAGLINE="$(tagline)"
BRIEF="$(project_brief)"
DIRECTION_1="ダーク×ネオン（テック感） / ネイビー背景 #0D1B2A / ゴールドアクセント #F5A623 / データダッシュボード風"
DIRECTION_2="ホワイト×ネイビー（信頼感） / クリーンなミニマルデザイン / 不動産テックのプレミアム感"
DIRECTION_3="ライトベージュ×グリーン（親しみやすさ） / カジュアルで使いやすい / 初めての物件探しに安心"

PROMPT=$(cat <<EOF
あなたは日本語のWebデザイナー兼実装者です。
現在のディレクトリ直下にある design_guidelines.md を読み、以下の3つのLPをすべて実装してください。

プロジェクト名: ${PROJECT_NAME}
表示名: ${TITLE}
タグライン: ${TAGLINE}
概要: ${BRIEF}

必須要件:
- 3ファイルを直接保存する
  - lp/pattern1_modern.html
  - lp/pattern2_premium.html
  - lp/pattern3_casual.html
- すべて日本語
- 各ファイルは単一HTML
- CSS中心、Canvas・WebGL・3D・外部ビルド不要
- HeroにCSSだけで描いた物件カードUIのモックを入れる（スコアバッジ付き）
- セクション: Hero, 課題提起（物件探しの苦痛）, ソリューション, 主要機能3つ, 料金プラン, ユーザーの声, FAQ, フッターCTA
- レスポンシブ対応
- テキストはこの事業向けに具体的に書く

各パターンの世界観:
1. pattern1_modern.html
   - ${DIRECTION_1}
   - 背景 #0D1B2A, アクセント #F5A623, テキスト #FAFAFA
   - 物件カードUI・AIスコアバッジ・ダッシュボード風レイアウト
2. pattern2_premium.html
   - ${DIRECTION_2}
   - 背景 白, ネイビー #0D1B2A, ゴールド #D4A84B
   - タイポグラフィ主役・上質感・信頼感
3. pattern3_casual.html
   - ${DIRECTION_3}
   - 背景 #F8FBF8, アクセント #2ECC71, メイン #2C4A6E
   - カード型・丸み・ポップなCTA

事業コンセプト:
- SUUMO・アットホーム・ホームズなど複数の不動産情報サイトを横断スクリーニング
- AIが価格妥当性・立地・周辺環境・口コミを100点満点でスコア化
- 条件に合った優良物件だけを自動抽出してランキング表示
- 新着・値下がりアラートをリアルタイムで通知
- 月980円のサブスクで全サイト対応・無制限検索
- 物件探しの月12時間を削減

サービス名: HomeScan AI（ホームスキャン AI）
ターゲット: 転勤族・引越し検討者・投資家

作業ルール:
- 説明文より実装を優先する
- 完了時は3ファイルを保存したあと、要約を短く出力する
EOF
)

mkdir -p "${PROJECT_DIR}/lp"
cd "${PROJECT_DIR}"
claude --print --permission-mode bypassPermissions --model sonnet --effort high "$PROMPT" > "${LOG_DIR}/${WORKER}.claude.out"

if ! exists_all_relative \
  "lp/pattern1_modern.html" \
  "lp/pattern2_premium.html" \
  "lp/pattern3_casual.html"; then
  mark_error "${WORKER}" "one or more LP files missing"
  exit 1
fi

mark_done "${WORKER}" \
  "lp/pattern1_modern.html" \
  "lp/pattern2_premium.html" \
  "lp/pattern3_casual.html"
log INFO "${WORKER}: done"
