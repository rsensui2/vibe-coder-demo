# FocusFlow - 技術仕様書

## アーキテクチャ
```
[Mobile App (React Native)]  →  [API Gateway]  →  [Backend (Next.js)]
         ↓                                             ↓
    [Local Storage]                             [Supabase (DB)]
         ↓                                             ↓
    [Push Notifications]                        [AI Service (Claude)]
```

## 技術スタック
- **フロントエンド**: React Native（iOS/Android）、Next.js（Web版）
- **バックエンド**: Next.js API Routes / Edge Functions
- **データベース**: Supabase（PostgreSQL + Realtime）
- **認証**: Clerk（ソーシャルログイン対応）
- **AI**: Claude API（通知分類、パターン分析）
- **デプロイ**: Vercel（Web）、Expo EAS（モバイル）

## 主要テーブル設計
| テーブル | 用途 |
|---------|------|
| users | ユーザー情報・プラン |
| tasks | タスク（優先度、締め切り、繰り返し） |
| focus_sessions | 集中セッション記録 |
| rewards | 獲得バッジ・ストリーク |
| notifications_blocked | ブロックした通知ログ |
| analytics | 集中パターン分析データ |

## AI通知分類ロジック
1. 通知受信 → Claudeに送信
2. カテゴリ分類: 緊急（通す）/ 重要（保留）/ 不要（ブロック）
3. 学習機能: ユーザーの判断をフィードバックし精度向上

## セキュリティ
- 全通信HTTPS、データ暗号化（AES-256）
- GDPR・個人情報保護法準拠
- 脳波データ等の医療情報は取り扱わない（タスク管理に特化）

## パフォーマンス目標
- アプリ起動: < 2秒
- タスク操作レスポンス: < 100ms
- プッシュ通知遅延: < 3秒
