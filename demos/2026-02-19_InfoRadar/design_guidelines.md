# InfoRadar Design Guidelines

## Brand Concept

**"Precision Intelligence"** — 精度の高い知性。ノイズを切り裂き、真実の信号だけを届ける。

レーダー（Radar）の比喩：暗闇の中でも重要なシグナルを正確に捕捉する技術力。

---

## Color Palette

```yaml
Primary:
  main: "#0A0E1A"        # ディープネイビー（背景・権威感）
  accent: "#00D4FF"      # エレクトリックシアン（レーダー波・強調）
  secondary: "#1E2D45"   # ミッドナイトブルー（カード背景）

Text:
  primary: "#F0F4FF"     # クールホワイト
  secondary: "#8BA3CC"   # ミストブルーグレー（サブテキスト）
  highlight: "#00D4FF"   # シアン（キーワード強調）

Status:
  success: "#00E5A0"     # エメラルドグリーン
  warning: "#FFB547"     # アンバー
  error: "#FF4D6D"       # ラズベリーレッド

Gradient:
  hero: "linear-gradient(135deg, #0A0E1A 0%, #1E2D45 50%, #0A0E1A 100%)"
  accent: "linear-gradient(90deg, #00D4FF, #0066FF)"
  card_glow: "radial-gradient(ellipse at center, rgba(0,212,255,0.15) 0%, transparent 70%)"
```

---

## Typography

```yaml
Font Stack:
  heading: "'Inter', 'Noto Sans JP', sans-serif"
  body: "'Inter', 'Noto Sans JP', sans-serif"
  mono: "'JetBrains Mono', 'Courier New', monospace"

Scale:
  hero: "clamp(2.5rem, 6vw, 5rem) / font-weight: 800"
  h1: "2.5rem / font-weight: 700"
  h2: "1.75rem / font-weight: 600"
  h3: "1.25rem / font-weight: 600"
  body: "1rem / line-height: 1.8"
  small: "0.875rem"
  mono: "0.9rem"
```

---

## Visual Language

```yaml
Style: "Tech-Premium Dark UI"

Key Visuals:
  - レーダースキャン円（回転アニメーション想定）
  - パルス波・信号波エフェクト
  - グリッドラインとドットマトリクス（技術感）
  - ニュースカード（アイコン＋ソース名＋要約文）
  - シアンのグロウ効果（重要度スコア）

Avoid:
  - 明るい白背景
  - 派手なグラデーション（過剰）
  - カジュアルなイラスト・マスコット

Cards:
  background: "rgba(30,45,69,0.8)"
  border: "1px solid rgba(0,212,255,0.2)"
  border-radius: "12px"
  backdrop-filter: "blur(8px)"
```

---

## Imagery & Icons

```yaml
Icons:
  style: "Line icons with 1.5px stroke, シアンアクセント"
  library: "Heroicons / Lucide（参考）"

Illustrations:
  style: "技術的な抽象グラフィック（レーダー、信号波、ネットワークノード）"
  color: "モノクロ ＋ シアンアクセントのみ"

Photos:
  style: "Not used / 代わりに抽象グラフィックを使用"
```

---

## Layout Principles

```yaml
Spacing:
  section: "80px〜120px padding-top"
  card_gap: "24px"
  max_width: "1200px"

Grid: "12カラム / ブレイクポイント: 640, 1024, 1280px"

Elevation:
  card: "0 4px 24px rgba(0,212,255,0.1)"
  modal: "0 20px 60px rgba(0,0,0,0.5)"
```

---

## Tone of Voice

```yaml
Language: "日本語メイン / 専門用語OK（ターゲットはリテラシー高め）"
Tone:
  - 信頼感・権威感（「私たちは正確です」）
  - 知的な興奮（「重要な情報が届いた」感）
  - 簡潔さ（余分な言葉を排除）

Messaging Examples:
  hero_headline: "一次情報だけが、あなたに届く"
  subheadline: "AIがノイズを除去し、今日知るべき情報を厳選してお届けします"
  cta: "無料で始める（クレジットカード不要）"
```
