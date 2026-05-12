# OpenRyoko — Executive Summary

## TL;DR

**OpenRyoko は、自宅サーバーに住む常駐型 AI ゲートウェイデーモン。** Markdown と YAML だけで人格・スキル・cron を定義し、Claude / Codex などの LLM を裏で束ねた "あなた専用の AI 部下"を、完全 OSS（MIT）で持つことができる。SaaS ベンダーロックなし。データ持ち出し不要。 GitHub に書き、git push すれば、AI がアップデートされる。

## 一言で言うと

> **「あなたの Markdown が、AI になる。」**

OpenRyoko は AI エージェントを "持つ" のではなく "住まわせる" 思想で設計された OSS。Slack / Discord / Webhook から入ってきたメッセージを Gateway daemon が受け取り、YAML で定義された人格つき AI 従業員が分担して応答する。cron で定刻処理、Skill (Markdown プレイブック) で再現性のある業務を実行する。

## 何をするのか

| 観点 | 内容 |
| --- | --- |
| 形態 | OSS の常駐デーモン（Node.js / npm 配布） |
| 主な機能 | Gateway / Engines / Employees / Skills / Cron / Memory / Slack 統合 |
| LLM | Claude (Opus / Sonnet) + Codex (GPT-5.x) のマルチエンジン切替 |
| 設定 | YAML / Markdown / JSON のみ。GUI 不要 |
| 永続化 | Markdown（人格・記憶・スキル）+ SQLite（セッション履歴） |
| ライセンス | MIT |
| 想定運用先 | 自宅サーバー / VPS / Raspberry Pi / 開発者ローカル |

## なぜ今これが必要か

AI エージェントの SaaS 化が加速する一方で、以下の問題が浮上している：

1. **ベンダーロック** — Lindy / Cognition / OpenAI Operator は便利だが、人格や記憶を外に持ち出せない
2. **データ主権** — 企業の機密データや個人の脳内ログを外部 SaaS に渡したくない
3. **柔軟性の欠如** — n8n や Zapier はワークフローエンジンであって、人格 AI ではない
4. **学習資産の永続化** — チャット履歴やカスタム指示が、提供元の SaaS に縛られている

OpenRyoko はこの 4 つの不満点を、 **Markdown ファイルで全てを管理する** という極めてシンプルな設計で解決する。

## 想定ユーザー

### Persona 1: Indie Hacker / 1 人開発者

自分専用の AI 秘書を持ちたいが、Lindy や Cognition の月額数万円は高すぎる。自宅サーバー（Mac mini / Raspberry Pi）に置いて、Slack で呼べば返事する AI が欲しい。

### Persona 2: スタートアップ CTO

社内 Slack に常駐する AI で業務効率化したいが、ベンダーロックは避けたい。社員データを外部 SaaS に渡せない業務もある。OSS で自社運用、必要なら fork してカスタマイズしたい。

### Persona 3: AI 研究者 / 大学院生

LangChain は柔軟だが、エージェントの「永続記憶」と「人格」と「スケジュール実行」を全部実装するのは面倒。OpenRyoko は既製の基盤として PoC に使える。

### Persona 4: Vibe Coder

Markdown で自分の脳を AI に移植したい人。SOUL.md / IDENTITY.md / MEMORY.md という命名の通り、自分の人格を AI に注入できるという思想に共感する。

## 価値主張

| 顧客の不満 | OpenRyoko の解決 |
| --- | --- |
| AI が SaaS に閉じ込められている | 自宅サーバーで完全制御 |
| カスタマイズに API コーディングが要る | Markdown を書くだけで人格 / スキルが追加できる |
| 月額数千〜数万円のサブスク疲れ | OSS（MIT）、ホスティング代だけで運用 |
| 仕事の文脈を AI に毎回説明し直す | Memory ファイルが永続化、git で履歴管理 |
| Slack ボットや cron を作るのに別ツール要る | Gateway 一つで完結 |

## ROI（個人ユース）

- **コスト**: LLM 利用料のみ（Claude API or サブスク枠）/ ホスティング 0〜数百円
- **節約**: Lindy 月 ¥7,500 / Cognition Devin 月 $500 / Operator 月 $200 などの代替
- **時短**: cron + Skill で毎朝のブリーフィング / メール処理 / レポート生成を自動化（1 日 30 分 × 30 日 = 月 15 時間）

## ROI（企業ユース）

- **コスト**: 受託サポート（VBC スポンサー枠）or 自社運用エンジニアコスト
- **節約**: SaaS ベンダー契約解消 / データ持ち出し不要によるコンプライアンスコスト削減
- **拡張**: 社員の数だけ AI 従業員を増やせる。Markdown の人格定義は資産として残る

## OSS としての持続可能性

- **本体**: 永久に MIT・無料
- **収益化**: 受託カスタマイズ（VBC 講師経験を活かす）/ Pro Support 契約 / 将来のマルチテナント版
- **コミュニティ**: GitHub Discussions + Discord + Vibe Coder Bootcamp の受講生コミュニティ
- **ロードマップ**: v2026.5 で MCP プロトコル完全対応、Q3 マルチテナント、Q4 SOC2 対応エンタープライズ

## 既に動いている証拠

- **作者の毎日**: 亮介自身が自宅サーバーで 24 時間稼働させ、Slack で常駐 AI として運用中
- **稼働ジョブ**: 23 個の cron が稼働（朝のブリーフィング、ニュース配信、Slack patrol、Linear 同期等）
- **チーム拡張**: COO Ryoko + CDO Anri + Advisory Tako など複数人格を YAML で定義

## まとめ

OpenRyoko は AI を **所有する** のではなく **住まわせる** という新しい関係性を提示する OSS。SaaS の便利さに慣れた人にこそ、 「自分の AI を、自分のサーバーで」という選択肢を再提示したい。Markdown と YAML だけでこれが実現する世界を、一緒に作りたい。

## CTA

- **GitHub を見る**: https://github.com/rsensui2/OpenRyoko
- **npm で入れる**: `npm i -g openryoko && ryoko start`
- **5 分で動かす**: クイックスタートガイド（README 参照）
- **Discord で議論**: コミュニティ招待（招待リンク準備中）
