# OpenRyoko — User Research

## リサーチ方針

亮介自身が VBC で 100 名以上の Vibe Coder と接してきた現場感覚、X / Slack / GitHub の OSS コミュニティ観察、そして亮介自身が OpenClaw → OpenRyoko を実際に運用してきた当事者経験を基に、想定ユーザーペルソナを 4 つに整理する。各ペルソナは仮想だが、複数の実在事例の合成によって構成されている。

## Persona 1: Indie Hacker 健太（32 歳）

### 基本プロフィール

- 職業: フリーランスの SaaS 開発者（toC ツール 1 本で月 ¥300K MRR）
- 居住: 福岡市
- 環境: M2 Mac mini を自宅鯖として 24h 稼働、Cloudflare Tunnel 経由で公開
- 技術スタック: Next.js / Supabase / Stripe
- LLM 利用: ChatGPT Plus + Claude Pro 課金、API は月 ¥3,000 程度

### 課題

- ChatGPT Operator や Lindy を試したが、月 $200 は個人開発者にはきつい
- 自分の脳内ログ（Notion 数万ページ）を AI に持たせたいが、Operator は持ち出せない
- cron で「朝に売上集計を Slack に飛ばす」程度は欲しいが、Zapier はオーバースペック
- 自宅鯖をすでに持っているので、そこで動く OSS が理想

### OpenRyoko で得たい価値

- 自宅鯖に住む AI 秘書
- Notion / Linear / Stripe / Slack を統合した「自分専用 COO」
- 月 5,000 円以下で運用したい（LLM API 込み）
- カスタマイズは Markdown 編集で済ませたい（フルスクラッチは時間がない）

### 採用判断ポイント

- 「5 分で動く」クイックスタートの実証
- LLM の選択肢（Claude が好きだが、Codex も使いたい）
- Slack 統合の質
- ドキュメントの充実度

## Persona 2: スタートアップ CTO 美咲（38 歳）

### 基本プロフィール

- 会社: SaaS スタートアップ（45 人）
- 役職: CTO（プレシリーズ A 調達済み）
- チーム: エンジニア 12 名（うち AI 系 2 名）
- 既存ツール: Slack / Notion / Linear / Datadog
- 課題感: AI 活用が業務に浸透していない。営業・カスタマーサポート・社内 IT で「AI 秘書」が欲しい

### 課題

- Lindy / Devin はライセンス高すぎ、機密データ持ち出しに抵抗
- 既製 SaaS だと自社業務に合わない
- 内製は時間がかかる、PoC で頓挫しがち
- 法務 / コンプライアンスから「ベンダーロックは避けたい」と圧

### OpenRyoko で得たい価値

- 社内 Slack に常駐する AI、自社サーバー（GCP / AWS）で運用
- 業務別に複数の人格 AI を Markdown で定義
  - 営業支援、CS 一次対応、社内 IT、人事 Q&A など
- 自社のドキュメント（Notion）と接続、内部に閉じた知識検索
- 監査ログとプライバシー対応

### 採用判断ポイント

- OSS であること（fork して内部で運用できる）
- Enterprise 版のロードマップ（SOC2 など）
- 受託サポート契約の有無
- 既存基盤（Slack / Linear / Notion）との接続容易性

### 想定アンチパターン

- 「全部一人でやる」雰囲気のままだと、複数人運用に不向きな印象
- ドキュメントが日本語中心だと海外チームに展開しづらい
- 商用利用ライセンスが将来変わるかもしれない不安

## Persona 3: AI 研究者 涼介（28 歳）

### 基本プロフィール

- 所属: 国内大学の博士課程 / AI Lab
- 研究テーマ: マルチエージェント・人格モデル・メモリ機構
- 環境: 大学の Linux サーバー + 自宅の RTX 4090
- 既存ツール: LangChain / AutoGen / CrewAI で PoC を作りまくっている

### 課題

- LangChain は柔軟だが、エージェントの「永続記憶」と「人格」と「スケジュール実行」を全部実装するのは面倒
- AutoGen はオーケストレーション中心、Memory が弱い
- 既製 PoC 基盤としては OpenRyoko のような統合パッケージが理想
- 自分の研究テーマ（人格モデル）にとって、Markdown 定義の人格は実験素材として使いやすい

### OpenRyoko で得たい価値

- マルチエージェント環境の既製基盤
- Engine / Memory / Cron / Hierarchy の各層を独立に差し替え可能（モジュラリティ）
- 論文用の再現性が高い（git でフル管理）
- 研究室の後輩にもすぐ展開できる軽量さ

### 採用判断ポイント

- アーキテクチャドキュメントの公開度
- 内部 API の安定性
- カスタムエンジン（Ollama / vLLM）プラグインの容易さ
- 研究目的の引用可能性（論文への記載）

## Persona 4: Vibe Coder 真央（25 歳）

### 基本プロフィール

- 職業: 大手 IT 企業のフロントエンドエンジニア兼サイドプロジェクト勢
- 趣味: 自分の脳内を全部 Markdown に書き出して整理する
- フォローしてる人: 亮介 / shadcn / Lee Robinson / Theo
- VBC 受講検討中
- 既存ツール: Obsidian / Notion / GitHub Copilot

### 課題

- 「自分専用 AI に自分の脳を移植したい」というロマン
- ChatGPT のカスタム指示では物足りない
- Obsidian のメモを AI に永続的に渡したい
- Slack でも Discord でも、私の AI が私の代わりに動いてほしい

### OpenRyoko で得たい価値

- Markdown ベースの「思想」が刺さる（SOUL.md / MEMORY.md ネーミング）
- 自分の人格を AI に注入できる遊び
- VBC で実用的な学習ロードマップを得たい
- GitHub に自分の OpenRyoko 設定リポジトリを公開して、ポートフォリオにしたい

### 採用判断ポイント

- 思想・世界観のかっこよさ（実用性よりも先に来る）
- VBC との連携
- コミュニティの活発さ（Discord で人と繋がりたい）
- 公開リポジトリのテンプレート

## ペルソナ間の優先順位（GTM 観点）

| Persona | 訴求コピー | チャネル | 単価 / LTV |
| --- | --- | --- | --- |
| Indie Hacker 健太 | 「自宅鯖で動く AI 秘書」 | GitHub / Reddit / X | 中（VBC 入会から $1K-3K） |
| CTO 美咲 | 「ベンダーロックなし、社内 Slack 常駐 AI」 | 営業 + 既存 TEKION 縁 | 大（受託 ¥500K-5M） |
| 研究者 涼介 | 「PoC に使える既製マルチエージェント基盤」 | GitHub / 論文 | 小（コミュニティ貢献） |
| Vibe Coder 真央 | 「Markdown であなたの脳を AI に移植」 | X / VBC / Discord | 中（VBC 入会から $1K-3K） |

## ユーザーリサーチから得たインサイト

### 1. 「自分のもの感」が最大価値

ベンダーロックではない、自分の Markdown で全部定義できる、GitHub で履歴管理できる、という「自分のもの感」が共通の価値。これが OSS の本質的な競争力。

### 2. クイックスタートが命

5 分以内に「動いた！」体験がないと、Indie Hacker / Vibe Coder 層は離脱する。`npm i -g openryoko && ryoko start` がそのまま動くこと、サンプル人格と cron が初期から動いていることが重要。

### 3. Slack 統合の質が差別化

国内エンジニア層は Slack 利用率が圧倒的に高い。Slack で呼べば返事する体験の質（速度・人格の自然さ・コンテキスト保持）が他基盤との差別化ポイント。

### 4. ドキュメントは英語日本語両方が必要

CTO ペルソナは英語ドキュメント必須。Vibe Coder ペルソナは日本語の温度感あるドキュメントが刺さる。

### 5. 「人格」というメタファーが効く

Employee / Department / rank という人格メタファーは、Indie Hacker と Vibe Coder には強く刺さる。研究者と CTO には機能的説明（Multi-agent / Role-based access）の方が伝わる。

## 解決すべき具体シナリオ

### Indie Hacker シナリオ

> 健太は週に 2 度、Stripe の売上ダッシュボードと Linear の進捗を Slack で確認するのが面倒。OpenRyoko に `weekly-recap` cron を追加し、毎週月曜朝に Stripe API と Linear API を叩いて Slack DM に要約を送らせる。Markdown で cron 定義を書き git commit するだけで実装完了。所要時間 15 分。

### CTO シナリオ

> 美咲は社内のカスタマーサポート問い合わせを一次対応させたい。OpenRyoko に `cs-bot` 人格を YAML で定義、Notion の社内 FAQ を Memory として渡し、Slack の `#cs-inbound` チャネルに常駐させる。一次対応の 60% を自動化、二次対応に人間が回る運用にする。

### 研究者シナリオ

> 涼介は「人格別の記憶想起」の論文 PoC として、3 つの人格を OpenRyoko で並行稼働させ、同じ質問に対する応答差異をログ取りする。Memory.md を人格別に分割、Cross-Request API で人格間の知識転送を観察する。

### Vibe Coder シナリオ

> 真央は自分の Obsidian Vault を OpenRyoko の `knowledge/` に同期、SOUL.md に自分のトーンを書き、Slack DM で AI 版の自分と対話する。自分の脳と AI の延長線が連続的になる体験を SNS で発信。VBC に入会して仲間と共有。

## まとめ

OpenRyoko の最大の競争力は **「自分のもの感」**。これを Indie Hacker / CTO / 研究者 / Vibe Coder の 4 つの異なる切り口から訴求する。GTM は GitHub Trending を起点に Indie Hacker と Vibe Coder を獲得 → コミュニティ醸成 → CTO 層への受託案件、という順序で進める。
