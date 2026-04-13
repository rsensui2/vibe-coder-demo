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
DIRECTION_1="ダーク×フィエスタオレンジ（テック感＋メキシカン） / Deep Night #1A0A00 背景 / Fiesta Orange #FF6B2B アクセント / モダンアプリ風"
DIRECTION_2="ホワイト×オレンジ（清潔感＋食欲） / クリーンで明るいミニマルデザイン / タコスデリバリーのプレミアム感"
DIRECTION_3="カラフル×ポップ（フィエスタ感） / Corn Yellow #F39C12 背景 / 祭り感・楽しさ全開 / 若者向けカジュアルUI"

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
- HeroにCSSだけで描いたタコスデリバリーUIのモックを入れる（注文カード・配達時間バッジ付き）
- セクション: Hero, 課題提起（本格タコスが食べられない苦痛）, ソリューション, 主要機能4つ, TacoPassプラン, ユーザーの声, FAQ, フッターCTA
- レスポンシブ対応
- テキストはタコスデリバリー事業向けに具体的に書く

各パターンの世界観:
1. pattern1_modern.html
   - ${DIRECTION_1}
   - 背景 #1A0A00, アクセント #FF6B2B, テキスト #FFF8F0
   - タコスカードUI・配達時間バッジ・モダンアプリ風レイアウト
2. pattern2_premium.html
   - ${DIRECTION_2}
   - 背景 白, オレンジ #FF6B2B, グリーン #27AE60
   - タイポグラフィ主役・フード系プレミアム感・食欲を刺激
3. pattern3_casual.html
   - ${DIRECTION_3}
   - 背景 #FFF8F0, アクセント #F39C12, メイン #C0392B
   - カード型・丸み・フィエスタポップなCTA・若者向け

事業コンセプト:
- エリア内のタコス専門店・メキシコ料理店を一元管理してデリバリー
- 注文から最速33分でドアまで届ける（注文3分・調理15分・配達15分）
- 11種のトッピングで自分だけのタコスをカスタマイズ
- リアルタイムGPS追跡で配達状況をリアルタイム確認
- TacoPass（月980円）でデリバリー無料＋毎週1タコス無料クーポン
- 保温専用パッケージで揚げたてをキープして届ける

サービス名: TacoRun（タコラン）
ターゲット: 20〜35歳都市部在住・タコスファン・忙しいビジネスパーソン

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
