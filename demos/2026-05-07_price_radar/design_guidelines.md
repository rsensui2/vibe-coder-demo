# PriceRadar — Design Guidelines

## プロダクト概要

**PriceRadar (プライスレーダー)** は、ダイナミックプライシングが普及した時代の「人間派」価格監視サービス。チケット・ホテル・航空券などの価格を24時間自動でウォッチし、安くなった瞬間にだけ通知する。Bot嫌いの個人ユーザーが、株価レベルの執着で「買い時」を狙うためのツール。

- ターゲット: 米国スポーツ/ライブチケット買付層、出張族・旅行者
- 訴求: "もう価格チェックしなくていい。" / "安くなった瞬間を、逃さない。"

## ブランドキー (Pattern 1 = メイン)

| 用途 | カラー | 用途 |
|---|---|---|
| 背景 (深) | `#0A0E1A` | ダーク基調、ナイトモード前提 |
| 背景 (副) | `#0F1729` | カード・パネル |
| アクセント (主) | `#00E5FF` | レーダーのスキャン光、CTA |
| アクセント (副) | `#FF3B6B` | アラート・値下げ通知 |
| テキスト主 | `#E6F0FF` | |
| テキスト副 | `#7B8BAB` | |
| 罫線 | `#1F2A44` | |

**世界観 (Pattern 1)**: ダーク × ネオンシアン × アラートピンク。レーダー・ターミナル・トレーディング画面のメタファ。直線的・ジオメトリック。

## タイポグラフィ

- 英文: `Inter`, `SF Pro Display`, system-ui
- 数字 (価格): `JetBrains Mono` 等の等幅フォント (タイカードでの数値が動的に見える)
- 日本語: `'Noto Sans JP'`, `-apple-system`, sans-serif
- 見出しは大胆に (Hero h1 = 64-88px)、行間 1.2、文字間 -0.02em

## 共通モチーフ

- **レーダーのスキャン円**: `radial-gradient` + `conic-gradient` で円形スキャン光 (Pattern 1で活用)
- **価格チャート**: 折れ線 (SVG) で価格推移を視覚化
- **アラートバッジ**: 値下げ % を `#FF3B6B` 背景の丸ピルで表現
- **ターゲットURL カード**: 監視中アイテムを縦リストで表示

## LP 3パターンのデザイン方針 (親が決定)

各パターンは全く異なるテイストで生成する。同系色・同レイアウトは禁止。

### Pattern 1 — Modern Tech (lp/pattern1_modern.html)

```yaml
direction: ダーク × ネオンシアン × ピンクアラート、データドリブン、レーダー/ターミナル風
colors:
  bg: "#0A0E1A"
  bg_alt: "#0F1729"
  accent: "#00E5FF"
  alert: "#FF3B6B"
  text: "#E6F0FF"
  text_sub: "#7B8BAB"
mood: エネルギッシュ・データドリブン・トレーディング画面っぽさ
layout: 非対称、Hero 左に大型タイポ + 右にスマホモック、価格チャートを背景にうっすら
key_elements:
  - スキャンするレーダー円 (CSS conic-gradient + アニメーション)
  - リアルタイム数字カウンター (監視中件数・節約額)
  - ターミナル風コードブロック (\$ priceradar watch ticketmaster.com/...)
  - 折れ線グラフ (SVG) で価格下落を可視化
```

### Pattern 2 — Premium Trader (lp/pattern2_premium.html)

```yaml
direction: 白×ゴールド、ラグジュアリー、静寂、余白重視、ヘッジファンドの分析レポート風
colors:
  bg: "#FAF8F3"
  bg_alt: "#FFFFFF"
  accent: "#B89B5E"
  ink: "#1A1A1A"
  text_sub: "#5E5E5E"
  border: "#E8E2D4"
mood: プレミアム・静寂・余白重視、富裕層・本気でチケット狙うコレクター向け
layout: 雑誌レイアウト (左コラム + 右大型ビジュアル)、フッターまで大きく余白
key_elements:
  - セリフ体の引用 (Times・Garamond)
  - ゴールド極細線でセクション仕切り
  - 数字は大型 (節約額 \$2,450 を巨大に)
  - 「監視リスト」を金縁のカードでリスト表示
  - 「14日無料」の代わりに "Members Preview" のような上品な言い回し
```

### Pattern 3 — Casual Friendly (lp/pattern3_casual.html)

```yaml
direction: クリーム×コーラル×ミント、レトロガーリー、プレイフル、イラスト的・遊び心
colors:
  bg: "#FFF8EE"
  bg_alt: "#FFFFFF"
  primary: "#FF6B5B"
  secondary: "#5BC9B0"
  yellow: "#FFD45E"
  ink: "#2C2419"
  text_sub: "#7A6F5F"
mood: プレイフル・親しみ・カジュアル、Z世代・初めて使う人向け
layout: カード積み重ね型 (奥行き・重なり)、傾いたバッジ・手書き風アクセント
key_elements:
  - 太丸ゴシック・大きい絵文字風アイコン (CSS only)
  - 手書き風アンダーライン (SVG path) で重要ワードを装飾
  - 吹き出しでユーザーの声を表現 (LINE風)
  - スタンプ風バッジ ("無料！" "ラク！" を斜めに配置)
  - スクロール時に少し弾むようなアニメーション (CSS transform + cubic-bezier)
```

## モックアプリ (mock/app_mock.html)

- iPhone フレーム (Dynamic Island 付き、CSS で描画)
- 4-5 画面をタブ切替 (JS):
  1. **監視中ダッシュボード**: 登録済アイテム一覧 (3件/制限)、現在価格 + 変動 % + ミニチャート
  2. **追加 (URL貼付)**: URL入力 → サムネ取得 → 閾値 (絶対値 or %) 設定
  3. **アラート履歴**: 過去30日の通知一覧、タップで詳細チャートへ
  4. **詳細チャート**: 価格推移 (30日線) + 統計サマリ (最安値・現在値・差分)
  5. **設定**: プラン (Free/$9.99/$29.99)、通知方式 (Push/Email/Slack)、通貨設定
- 配色は Pattern 1 の Modern Tech に準拠 (#0A0E1A bg + #00E5FF accent + #FF3B6B alert)

## スライド (slides/)

- 16:9, 1920×1080 想定
- 背景: ダーク (`#0A0E1A`) + 微細なグリッド・スキャン光
- アクセント: シアン (`#00E5FF`) と ピンク (`#FF3B6B`)
- フォント: 大型 sans-serif、数字は等幅で
- 受賞歴のあるプロダクトデザイナーが作ったような精緻な仕上がり
- 写真不使用、純粋なグラフィックデザイン

## Instagram (sns/instagram/)

- 1080×1080 (1:1)
- 各カードに番号 (01/10) を右下に
- 「価格監視あるある」「PriceRadar の使い方」「節約額の事例」などストーリー仕立て
- 配色は Pattern 1 ベース、視認性のため明度コントラスト強め

## 共通CSS変数 (Pattern 1 / モック / スライド)

```css
:root {
  --bg: #0A0E1A;
  --bg-alt: #0F1729;
  --accent: #00E5FF;
  --alert: #FF3B6B;
  --text: #E6F0FF;
  --text-sub: #7B8BAB;
  --border: #1F2A44;
  --radius: 16px;
  --easing: cubic-bezier(0.22, 1, 0.36, 1);
}
```
