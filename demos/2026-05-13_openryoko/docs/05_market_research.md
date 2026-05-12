# OpenRyoko — Market Research / Competitive Landscape

## 市場概観: 2026 年の AI エージェント市場

### マクロトレンド

2024 年の ChatGPT・Claude 主導の "Chat 時代" から、2025〜2026 年は **AI エージェント時代** に移行している。主要トレンド：

1. **エージェント基盤の覇権争い** — OpenAI Operator, Anthropic Claude Agent SDK, Google Gemini Agent, Microsoft Copilot Studio が乱立
2. **垂直特化エージェント SaaS** — Lindy（生産性）, Devin / Cognition（コード）, Decagon（CS）, Sierra（CS）が急成長
3. **OSS 化の波** — LangChain, AutoGen, CrewAI, OpenAgents が GitHub で大量 Star
4. **マルチエージェント / Hierarchical** — 単発 Bot から、複数 AI が分業する組織型へ進化
5. **永続記憶 / 学習** — チャット履歴を超えた、人格・好み・知識の永続化が必須機能に

### 市場規模

- 2025 年世界 AI エージェント市場: 約 $5.4B（推定）
- 2030 年予測: $50B+ (CAGR 約 45%)
- 国内市場: 2026 年で約 ¥800 億円規模（推定）
- 個人 / Indie 向け SaaS だけで月数百〜数千万円課金のスタートアップが続々登場
- エンタープライズ向けは Salesforce / Microsoft / Atlassian がそれぞれ統合進行中

### 文化的トレンド: "Bring Your Own AI"

開発者文化として、SaaS にロックインされる AI から、自分の AI を持ち歩く・自分の鯖で動かす運動が拡大している。Self-hosted・Local-first・OSS 思想と親和性が高い：

- **Self-hosting コミュニティ**: Reddit /r/selfhosted が 380K members
- **Local LLM**: Ollama, LM Studio, llama.cpp が普及
- **OSS Agent**: SuperAGI, AutoGPT が初期に火を付けた
- **Vibe Coding 文化**: AI に自分の脳を Markdown で渡す思想

OpenRyoko はこの文化的トレンドの中心に位置する。

## 主要競合との比較

### Category A: SaaS / クラウド型エージェント

| ツール | 形態 | 月額（個人） | OSS? | 永続記憶 | Slack 統合 | cron | カスタマイズ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Lindy** | SaaS | $49.99〜 | ✗ | △ | ✅ | ✅ | GUI ワークフロー |
| **Cognition Devin** | SaaS | $500/mo | ✗ | ✅ | △ | ✗ | 限定 |
| **OpenAI Operator** | SaaS | $200/mo | ✗ | △ | ✗ | ✗ | カスタム指示 |
| **Sierra** | Enterprise SaaS | エンタープライズ商談 | ✗ | ✅ | ✅ | △ | 担当社員と作る |
| **Decagon** | Enterprise SaaS | エンタープライズ商談 | ✗ | ✅ | ✅ | △ | 担当社員と作る |
| **OpenClaw** | 商用 + プライベート OSS | ¥800-3000/mo | △ | ✅ | ✅ | ✅ | YAML / Markdown |

**OpenRyoko の優位性**: OSS / 自宅鯖 / ベンダーロックなし / 月額 0 円 / カスタマイズ自由度最大

### Category B: ワークフロー / 自動化ツール

| ツール | 形態 | 月額 | OSS? | AI 主役 | 永続人格 | Slack | cron |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **n8n** | OSS + Cloud | Free〜$50 | ✅（SSPL） | ✗（連携） | ✗ | ✅ | ✅ |
| **Zapier** | SaaS | Free〜$70 | ✗ | ✗（連携） | ✗ | ✅ | ✅ |
| **Make (旧 Integromat)** | SaaS | Free〜$30 | ✗ | ✗ | ✗ | ✅ | ✅ |
| **Pipedream** | SaaS | Free〜$20 | △ | △ | ✗ | ✅ | ✅ |

**違い**: これらは「ワークフロー実行エンジン」であり、AI に人格を持たせない。OpenRyoko は **人格つき AI** が主役で、ワークフローは Skills/Cron で代替できる。共存可能（OpenRyoko の cron が n8n を呼ぶ等）。

### Category C: フレームワーク / SDK

| ツール | 形態 | 言語 | OSS? | 永続人格 | Memory | Slack | cron |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **LangChain** | フレームワーク | Python / TS | ✅ MIT | △（自実装） | △（自実装） | △ | ✗ |
| **AutoGen (MS)** | フレームワーク | Python | ✅ MIT | ✅ | △ | ✗ | ✗ |
| **CrewAI** | フレームワーク | Python | ✅ MIT | ✅ | △ | △ | ✗ |
| **OpenAgents** | フレームワーク | Python | ✅ Apache | △ | △ | ✗ | ✗ |
| **Anthropic Claude Agent SDK** | SDK | Python / TS | ✅ MIT | △ | ✅（Beta） | △ | ✗ |

**違い**: フレームワークは「自分で組む」基盤、OpenRyoko は「すぐ使える」常駐デーモン。OpenRyoko 内部で LangChain や Claude SDK を Engine として利用できる（補完的）。

### Category D: マルチエージェント / 組織型

| ツール | 形態 | OSS? | 階層 | 委譲 | 部門越え | クロスベンダー |
| --- | --- | --- | --- | --- | --- | --- |
| **MetaGPT** | OSS | ✅ | ✅ | ✅ | △ | △ |
| **AutoGen Multi-Agent** | OSS | ✅ | △ | ✅ | △ | △ |
| **CrewAI Multi** | OSS | ✅ | △ | ✅ | △ | △ |
| **OpenRyoko** | OSS | ✅ | ✅（無限深さ） | ✅（API） | ✅（cross-request） | ✅ |

OpenRyoko は **常駐サービス** + **無限階層組織** + **クロスベンダー LLM** の組み合わせが他にない。

## SWOT 分析

### Strengths（強み）

- **Markdown / YAML の徹底**: 全てがテキストで git 管理可能
- **常駐デーモン**: 起動しっぱなしの cron + Slack 統合という独自ポジション
- **マルチエンジン**: Claude + Codex + Local を session 単位で切替可能
- **無限階層組織**: 無限深さの employee hierarchy + cross-department services
- **作者の信頼性**: 亮介自身が VBC で 100 名以上の Vibe Coder を指導している実績

### Weaknesses（弱み）

- **作者依存**: 現状ほぼ亮介 1 人で開発、 bus factor = 1
- **国内中心**: ドキュメント・コミュニティが日本語ベース
- **エンタープライズ機能の不足**: SSO / RBAC / 監査ログが未成熟
- **GUI の不在**: CLI / Markdown 中心、非エンジニアには敷居が高い
- **ベンチマークの不在**: 性能・コスト比較データが公開されていない

### Opportunities（機会）

- **OSS Agent 市場の急成長**: 2025〜2027 で 10 倍以上の拡大予測
- **データ主権意識の高まり**: 企業の SaaS 持ち出し制限が強化される潮流
- **Self-hosted ブーム**: Reddit /r/selfhosted が継続的に伸びる
- **Vibe Coding の文化**: 個人 AI 化の思想がインフルエンサーから一般化
- **MCP プロトコル**: Anthropic 主導の標準化に乗ることで他基盤との互換性確保

### Threats（脅威）

- **Big Tech の参入**: Google / Microsoft / OpenAI が無料の Agent 基盤を出す可能性
- **OSS の SSPL 化トレンド**: n8n のように商業圧力でライセンス変更したくなる誘惑
- **同思想の OSS が複数登場**: Letta, MemGPT などが永続記憶で先行
- **LLM 提供元の API 値上げ**: 個人ユーザーの ROI が悪化するリスク
- **マルチテナント SaaS の競合**: より便利な「ホスト版」が現れる

## 競合ポジショニングマップ

```
       高 ← OSS度 → 低
高 ┌──────────────┬──────────────┐
   │              │              │
柔 │  OpenRyoko   │   Lindy      │
軟 │  LangChain   │   Cognition  │
性 │  AutoGen     │   Operator   │
   │              │              │
低 │              │              │
   ├──────────────┼──────────────┤
   │  n8n         │  Zapier      │
   │  CrewAI      │  Make        │
   │              │  Pipedream   │
   │              │              │
   └──────────────┴──────────────┘
       高 ← OSS度 → 低
```

**OpenRyoko の独自ポジション**: 「最も OSS で、最も柔軟、かつ常駐デーモン形態」

## 差別化戦略

### vs SaaS（Lindy / Cognition）

- **訴求**: 「あなたの AI を、あなたのサーバーで」「月額 0 円、ベンダーロックなし」
- **証明**: GitHub で全コード公開、自宅鯖で 24h 動くデモ
- **狙うセグメント**: コスト / プライバシーで SaaS を躊躇している層

### vs フレームワーク（LangChain / AutoGen）

- **訴求**: 「組まずに使える、人格 AI 常駐デーモン」「Markdown だけで動く」
- **証明**: 5 分クイックスタート、サンプル人格と cron が初期から動く
- **狙うセグメント**: フレームワークの学習コストが高すぎる層

### vs ワークフロー（n8n / Zapier）

- **訴求**: 「ワークフローではなく、人格 AI」「Markdown で全部定義」
- **証明**: 比較表で「永続人格」「Memory」「人格別委譲」の差を提示
- **狙うセグメント**: AI 主体の業務効率化を求める層

### vs マルチエージェント OSS（MetaGPT / CrewAI）

- **訴求**: 「常駐デーモン + cron + Slack 統合まで全部入り」
- **証明**: フレームワーク以外の「動くサービス」として日常運用
- **狙うセグメント**: PoC から本番運用へ進めたい開発者

## 戦略提言

### 短期（〜6 ヶ月）

1. **GitHub Trending** 入りを最優先（README 改善、デモ GIF、Hacker News 投稿）
2. **クイックスタート 5 分** を実現するための onboarding 改善
3. **5 つの代表的なテンプレ人格 / cron / skill** を初期同梱
4. **Vibe Coder Bootcamp** の必修教材化

### 中期（〜12 ヶ月）

1. **多言語ドキュメント**（英語版を 100% 完成）
2. **MCP プロトコル完全対応**（Anthropic 公式互換）
3. **エンタープライズ PoC 3 社獲得**
4. **GitHub Stars 5,000** 達成

### 長期（〜24 ヶ月）

1. **マルチテナント版 / SOC2 対応**
2. **Marketplace のローンチ**
3. **国際カンファレンスでの登壇**
4. **企業向け Pro Support の年間契約 10 社以上**

## まとめ

AI エージェント市場は急成長中だが、「OSS + 常駐デーモン + 人格主役 + マルチエンジン」というポジションは現時点で OpenRyoko 独占。SaaS への不満（コスト / ロックイン / プライバシー）と、OSS 文化（self-hosting / vibe coding）の交差点に位置する独自のプロダクトとして、十分な市場機会が存在する。GitHub Trending を起点に、Indie Hacker 層と Vibe Coder 層を獲得し、その後エンタープライズへ展開する戦略が有効。
