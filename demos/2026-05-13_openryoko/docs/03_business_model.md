# OpenRyoko — Business Model / Ecosystem Strategy

## 基本方針

**OpenRyoko 本体は MIT ライセンスの OSS。永久に無料。**

「OSS」と「収益化」を矛盾なく両立させるために、本体ではなく **周辺サービス・教育・受託** で収益化する Linux / Vercel / Supabase 型のビジネスモデルを採用する。

## 4 つの収益柱

### 1. Vibe Coder Bootcamp との連携（メイン）

- VBC は亮介が主宰する Vibe Coding 講座（既存事業）
- 受講生は学習過程で OpenRyoko を使い、自社・個人用 AI を構築する
- **OpenRyoko は VBC のキラー教材**として位置付ける
- 受講料の一部が OSS 開発の継続資金になる
- 受講生コミュニティが GitHub Contributors の最大供給源

### 2. 受託サポート / カスタマイズ

- 企業向け OpenRyoko 導入支援
- 自社特化人格・スキル・コネクタの個別開発
- 想定単価: ¥500K〜¥5M / 案件
- 想定顧客: 50〜500 人規模のスタートアップ / DX 進行中の中堅企業
- 営業チャネル: VBC アラムナイ + 既存の TEKION ネットワーク

### 3. エンタープライズ版（将来）

- マルチテナント対応版 OpenRyoko
- SOC2 Type 1 / Type 2 対応
- SSO / RBAC / 監査ログ強化
- 想定料金: ¥50K-¥200K / 月（テナント単位）
- ターゲット: 100〜10,000 人規模の DX 部門
- ローンチ予定: 2026 Q4

### 4. Marketplace（さらに将来）

- 認定スキル / 人格テンプレート / コネクタの有料配布
- 開発者と OpenRyoko 運営側でレベニューシェア
- 例: 「経理 AI スキルパック」¥3,000、「カスタマーサポート人格」¥5,000
- ローンチ予定: 2027

## OSS としての持続可能性

### コアモデル: "Single-Vendor Open Source"

| 観点 | 採用方針 |
| --- | --- |
| ライセンス | MIT（永久） |
| コア機能 | 完全 OSS。エンタープライズ機能との差別化は将来も "+α" 程度に留める |
| 商業利用 | 制限なし。fork も歓迎 |
| Contributor 還元 | アクティブな貢献者を **Pro Support のサブコントラクタ**として招聘 |

### 似た成功事例

- **Supabase**: OSS + 有料ホスティング
- **Vercel**: OSS（Next.js）+ ホスティング
- **HashiCorp**: OSS（Terraform 等）+ Enterprise / Cloud
- **n8n**: OSS + Cloud（最近 SSPL 化したが教訓）

### Anti-pattern（避けるもの）

- **コミュニティ版を機能制限**してエンタープライズ版を売り込む（嫌われる）
- **SSPL / BSL ライセンス**への突然の変更（コミュニティ離反のリスク）
- **コア機能を SaaS 限定**にする（信頼を失う）

## 短期ロードマップ（〜2026 末）

| Phase | 期間 | 主な施策 |
| --- | --- | --- |
| Phase 1: Foundation | 2026 Q2 | コア機能の安定化 / GitHub Stars 1000 達成 / Discord 開設 |
| Phase 2: Awareness | 2026 Q3 | Vibe Coder Bootcamp との完全統合 / 技術記事 10 本 / 公開 Showcase |
| Phase 3: Enterprise PoC | 2026 Q4 | 中堅企業 3 社で実証 / SOC2 着手 / 受託受注体制構築 |
| Phase 4: Marketplace 準備 | 2027 Q1 | 認定制度設計 / 配布インフラ構築 |

## 営業 / マーケティング戦略

### ターゲットチャネル

1. **GitHub Trending** — 良質な README とデモで Trending 入りを狙う
2. **Hacker News / Reddit /r/selfhosted** — 自宅サーバー文化に親和性が高い
3. **X / Twitter Tech Community** — 亮介と Vibe Coder Bootcamp の既存フォロワー
4. **個人開発者の Show & Tell** — Indie Hackers, Product Hunt
5. **国内勉強会** — DevTools Festival, AI Agents Meetup 等

### コンテンツ戦略

- **クイックスタートGIF**（30秒で「Slackで呼べばAIが返事する」を見せる）
- **比較記事**（vs Lindy, vs Cognition, vs LangChain）
- **チュートリアル動画**（YouTube / Twitter）
- **ユーザーケーススタディ**（VBC 受講生の成功事例）
- **ドキュメントサイト**（docusaurus or mkdocs）

## コミュニティ運営

### GitHub Discussions

- Q&A / Show & Tell / Feature Request の 3 セクション運営
- 亮介が週 2 回返信、活発な質問者にはコントリビューター招待

### Discord

- `#general` / `#help` / `#showcase` / `#contributors` / `#vbc-students`
- 月次 Office Hour（亮介が直接質問に答える）

### Vibe Coder Bootcamp 統合

- VBC カリキュラムに「OpenRyoko で自社 AI を構築」モジュールを追加
- 卒業生は OpenRyoko Certified Engineer の称号
- 卒業生による「私が OpenRyoko で作ったもの」LT 大会を四半期ごと開催

## 競合との共存

- **n8n / Zapier**: ワークフロー → OpenRyoko のトリガ元として併用可
- **LangChain**: フレームワーク → OpenRyoko の Engine 内部実装で利用可
- **Lindy / Cognition**: SaaS → ターゲットセグメントが違う（彼らは非エンジニア / こちらはエンジニア）
- **OpenClaw**: 旧式の同コンセプト → OpenRyoko は後継として推進

## リスクと対策

| リスク | 対策 |
| --- | --- |
| OSS だけで収益が立たない | VBC + 受託の二本柱で先に黒字化、その後 OSS 投資 |
| コミュニティが育たない | Bootcamp が常時 Contributor を供給 |
| Anthropic / OpenAI が公式 Agent SDK を出す | 我々は "公式" の上に立つ統合層として共存 |
| ライセンス論争 | MIT 固定を公約として維持 |
| コア開発者（亮介）依存 | 早期に 2 〜 3 名のメンテナーを迎える |

## 成功指標（KPI）

| 指標 | 6 ヶ月後 | 1 年後 |
| --- | --- | --- |
| GitHub Stars | 1,000 | 5,000 |
| Active Installs（npm） | 500 / 月 | 5,000 / 月 |
| Discord Members | 200 | 1,500 |
| 受託案件 | 3 件 | 10 件 |
| Bootcamp 受講生 | 30 名 | 100 名 |
| エンタープライズ商談 | 5 社 | 20 社 |

## まとめ

OpenRyoko は **「無料の本体」+「有料の周辺」** で持続可能性を狙う OSS。Vibe Coder Bootcamp とのシナジーが核。 SaaS の便利さに飽きたエンジニアコミュニティを最大の支持母体として、長期で育てる。
