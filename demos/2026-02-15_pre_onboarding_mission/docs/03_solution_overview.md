# ソリューション概要 — Pre-Onboarding Mission

## プロダクト全体像

Pre-Onboarding Missionは3つの主要モジュールで構成される。

```
┌─────────────────────────────────────────────────┐
│              Pre-Onboarding Mission              │
├─────────────┬─────────────────┬─────────────────┤
│  Mission    │   Culture       │   Mission       │
│  Discovery  │   Immersion     │   Statement     │
│  (AI対話)   │  (企業文化体験)  │  (成果物生成)   │
├─────────────┴─────────────────┴─────────────────┤
│          企業管理ダッシュボード                     │
├─────────────────────────────────────────────────┤
│     API連携層（ATS/HRIS/Slack/Teams）            │
└─────────────────────────────────────────────────┘
```

## 画面設計

### 転職者向け画面（モバイルファースト）

#### 1. ウェルカム画面
- 企業からのウェルカムメッセージ（動画 or テキスト）
- 「あなたのミッションを見つけよう」のCTA
- 進捗インジケーター（0% → 100%の旅）

#### 2. ミッションディスカバリー画面（メイン）
- AIチャットインターフェース
- 3つのフェーズで構成:
  - **Phase 1: 自己発見**（15分）— 過去の経験、価値観、強みの深堀り
  - **Phase 2: 企業理解**（15分）— 企業の課題、チームの状況を学ぶ
  - **Phase 3: ミッション設計**（15分）— 自分 × 企業の交差点を見つける
- リアルタイムでミッションマップが可視化される
- 途中保存・再開可能

#### 3. カルチャーイマージョン画面
- **ストーリーカード形式**（Instagram Stories風）でスワイプ
- コンテンツ種別:
  - 社員インタビュー（1分動画）
  - バーチャルオフィスツアー（360°写真）
  - チームの1日（タイムライン形式）
  - プロジェクト事例（ケーススタディ）
  - カルチャークイズ（ゲーミフィケーション）

#### 4. ミッションステートメント画面
- AI対話の結果から自動生成された「My Mission Statement」
- 編集可能（自分の言葉で微調整）
- PDF/画像でエクスポート
- Slack/Teamsで上司・チームに共有
- 入社初日の自己紹介スライド自動生成

#### 5. ダッシュボード（転職者用）
- 全体の進捗状況
- 入社日までのカウントダウン
- 完了したコンテンツ一覧
- チームメンバーの紹介カード

### 企業管理画面

#### 1. 転職者管理ダッシュボード
- 内定者一覧（進捗ステータス付き）
- 各転職者のエンゲージメントスコア
- ミッション完了率のファネル
- アラート（長期間未ログインの転職者etc）

#### 2. コンテンツ管理（CMS）
- 企業文化コンテンツのアップロード・編集
- AI対話シナリオのカスタマイズ
- ウェルカムメッセージの設定
- チーム・部署情報の更新

#### 3. アナリティクス
- 入社後パフォーマンスとの相関分析
- AI対話で抽出された転職者のインサイト（匿名化）
- 部署別・職種別の傾向レポート
- ROI計算ツール（離職率改善 × 採用コスト削減）

## 技術スタック

### フロントエンド

| 技術 | 用途 | 選定理由 |
|------|------|---------|
| Next.js 15 (App Router) | Webアプリ本体 | SSR/ISR対応、SEO、パフォーマンス |
| React 19 | UIコンポーネント | エコシステムの充実 |
| Tailwind CSS | スタイリング | 迅速なUI開発 |
| Framer Motion | アニメーション | スムーズなUX |
| shadcn/ui | UIコンポーネントライブラリ | カスタマイズ性 |

### バックエンド

| 技術 | 用途 | 選定理由 |
|------|------|---------|
| Supabase | DB・認証・ストレージ | BaaS、PostgreSQL、リアルタイム |
| Edge Functions | API処理 | 低レイテンシ、スケーラブル |
| Anthropic Claude API | AI対話エンジン | 日本語品質、長文対話 |
| LangChain | AI対話フロー制御 | プロンプトチェーン管理 |

### インフラ

| 技術 | 用途 | 選定理由 |
|------|------|---------|
| Vercel | ホスティング | Next.jsとの親和性 |
| Supabase Cloud | データベース | マネージドPostgreSQL |
| Cloudflare R2 | メディアストレージ | コスト効率 |
| Upstash Redis | キャッシュ・セッション | サーバーレス対応 |

### 外部連携

| サービス | 連携内容 |
|---------|---------|
| Slack / Microsoft Teams | ミッション共有、通知 |
| ATS（SmartHR, HRMOS等） | 内定者情報の自動取込 |
| カレンダー（Google/Outlook） | 入社日同期、リマインド |
| Zapier / Make | ノーコード連携拡張 |

## MVP定義（3ヶ月で開発）

### MVP機能（Must Have）

1. **AI対話エンジン（ミッションディスカバリー）**
   - 3フェーズの対話フロー
   - テキストベースのチャットUI
   - ミッションステートメントの自動生成

2. **企業管理画面（最小版）**
   - 転職者の招待・管理
   - 基本的な企業情報入力
   - 進捗確認ダッシュボード

3. **転職者ダッシュボード**
   - ログイン・認証
   - AI対話画面
   - ミッション閲覧・PDF出力

### Post-MVP（Phase 2以降）

| Phase | 期間 | 追加機能 |
|-------|------|---------|
| Phase 2 | 4〜6ヶ月目 | カルチャーコンテンツCMS、社員インタビュー、アナリティクス |
| Phase 3 | 7〜9ヶ月目 | ATS連携、Slack/Teams連携、ゲーミフィケーション |
| Phase 4 | 10〜12ヶ月目 | B2Cフリーミアム、モバイルアプリ、多言語対応 |

## データモデル（主要テーブル）

```sql
-- 企業
CREATE TABLE companies (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  culture_data JSONB,
  plan TEXT DEFAULT 'starter',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 転職者
CREATE TABLE candidates (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  position TEXT,
  start_date DATE,
  status TEXT DEFAULT 'invited',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI対話セッション
CREATE TABLE dialogue_sessions (
  id UUID PRIMARY KEY,
  candidate_id UUID REFERENCES candidates(id),
  phase TEXT, -- 'self_discovery', 'company_understanding', 'mission_design'
  messages JSONB[],
  insights JSONB,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ミッションステートメント
CREATE TABLE mission_statements (
  id UUID PRIMARY KEY,
  candidate_id UUID REFERENCES candidates(id),
  content TEXT,
  version INT DEFAULT 1,
  shared_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- カルチャーコンテンツ
CREATE TABLE culture_contents (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  type TEXT, -- 'interview', 'tour', 'project', 'quiz'
  title TEXT,
  media_url TEXT,
  content JSONB,
  order_index INT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## セキュリティ要件

| 要件 | 対策 |
|------|------|
| 個人情報保護 | Supabase RLS、暗号化通信（TLS 1.3） |
| 認証 | Clerk / Supabase Auth（SSO対応） |
| 権限管理 | RBAC（企業管理者/人事担当者/転職者） |
| データ保持 | 入社後6ヶ月で対話データ自動削除（設定可） |
| SOC2 | Year 2でSOC2 Type II取得目標 |
| ISMS | ISO27001準拠の運用体制 |
