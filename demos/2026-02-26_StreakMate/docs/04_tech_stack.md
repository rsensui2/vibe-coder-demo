# StreakMate — テックスタック

## Vibe Codingで実現するフルスタック構成

### フロントエンド
- **Next.js 14** (App Router)
- **Tailwind CSS** + shadcn/ui
- **Framer Motion** (炎・バッジアニメーション)

### バックエンド / BaaS
- **Supabase** (PostgreSQL + Auth + Realtime)
  - テーブル: users, habits, streak_logs, badges, ai_messages
  - RLS (Row Level Security) でユーザーデータを保護
  - Realtimeでストリーク更新をリアルタイム反映

### AIコーチ機能
- **Claude API** (Anthropic)
  - 毎朝7時にCronジョブで全ユーザー分のメッセージ生成
  - プロンプト: ユーザーのstreakデータ + 習慣種別 + 曜日 → パーソナライズメッセージ

### インフラ / デプロイ
- **Vercel** (フロントエンド + Edge Functions)
- **Vercel Cron** (毎朝7時のAIメッセージ生成)
- **Resend** (メール通知)

### 開発ツール
- **Cursor** + Claude (Vibe Coding)
- **GitHub** (バージョン管理)
- **Vercel Analytics** (ユーザー分析)

## データモデル（主要テーブル）

```sql
-- ユーザーの習慣
habits (id, user_id, name, icon, color, created_at)

-- 毎日の記録ログ
streak_logs (id, user_id, habit_id, logged_at, streak_count)

-- AIコーチメッセージ
ai_messages (id, user_id, message, sent_at, read_at)

-- バッジ
badges (id, user_id, badge_type, earned_at)
```

## 開発工数（Vibe Coding版）

| 機能 | 従来開発 | Vibe Coding |
|------|----------|-------------|
| 認証・ユーザー管理 | 1週間 | 2時間（Supabase Auth） |
| ストリーク記録機能 | 2週間 | 4時間 |
| AIコーチ機能 | 2週間 | 3時間 |
| UI/デザイン実装 | 1ヶ月 | 1日（shadcn + Tailwind） |
| **合計** | **約3ヶ月** | ****3日以内**** |
