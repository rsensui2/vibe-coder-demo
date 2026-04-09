# Photomatch - 技術仕様書

## アーキテクチャ概要

```
Frontend (Next.js 15 + React 19)
  ├─ Photographer Dashboard
  ├─ EC Buyer Search & Match
  └─ Admin Panel

API Layer (Next.js API Routes + tRPC)
  ├─ Authentication (NextAuth.js)
  ├─ User Profile Management
  ├─ Portfolio & Media Upload
  ├─ Matching Algorithm
  └─ Payment Integration

Database (Supabase PostgreSQL)
  ├─ users
  ├─ portfolios
  ├─ matches
  ├─ transactions
  └─ reviews

Storage (Supabase Storage / AWS S3)
  ├─ Portfolio Images
  ├─ Profile Photos
  └─ Contract PDFs

Payment (Stripe / PayPal)
  ├─ Photographer Payout
  ├─ EC Buyer Invoice
  └─ Commission Tracking

Analytics (PostHog / Mixpanel)
  ├─ User Funnel
  ├─ Match Conversion
  └─ Revenue Tracking
```

## コアテーブル設計

### users
```sql
id (UUID PK)
type (ENUM: photographer, ec_buyer, admin)
email (UNIQUE)
display_name
avatar_url
bio (text)
location
verified_at (TIMESTAMP)
premium_until (TIMESTAMP)
created_at, updated_at
```

### portfolios
```sql
id (UUID PK)
user_id (FK users.id)
title
description
category (ENUM: product, fashion, food, people, other)
images (JSON array of { url, order })
like_count
view_count
created_at, updated_at
```

### matches
```sql
id (UUID PK)
photographer_id (FK users.id)
ec_buyer_id (FK users.id)
status (ENUM: proposed, accepted, rejected, completed, cancelled)
proposed_rate (INT)
actual_rate (INT)
delivery_date
completed_at
reviewed_at
created_at, updated_at
```

### reviews
```sql
id (UUID PK)
match_id (FK matches.id)
from_user_id (FK users.id)
to_user_id (FK users.id)
rating (INT 1-5)
comment (text)
categories (JSON: punctuality, quality, communication)
created_at
```

## 主要機能

### 1. Photographer Dashboard
**User Story**: カメラマンが自分の作品を展示し、依頼を受け取る

- ポートフォリオ管理
  - 最大 50 作品まで無料、プレミアム登録で無制限
  - 画像アップロード（5MB/枚、最大 100MB/月）
  - カテゴリ分類（商品撮影、人物、食べ物など）
  
- マッチング通知
  - マッチしたEC事業者の情報を表示
  - 提案された単価確認 → 承認/拒否
  - チャット機能で詳細打ち合わせ
  
- 収益管理
  - 月間売上集計
  - 支払い予定日
  - Stripe 口座連携

### 2. EC Buyer Search
**User Story**: EC事業者がカメラマンを検索し、依頼を出す

- 検索フィルター
  - カテゴリ（商品/食べ物など）
  - 地域（送付納期の都合）
  - 予算レンジ
  - スター（評価★4.0以上など）
  
- ポートフォリオ閲覧
  - カメラマンのプロフィール、レビュー表示
  - 作品の詳細を全画面表示
  - 「このカメラマンに依頼」ボタン → 提案フォーム
  
- 提案管理
  - 提案フォーム: 予算・納期・詳細リクエスト入力
  - 提案一覧で状態確認（返信待ち、承認済み）

### 3. マッチング AI
**アルゴリズム**: 簡易スコアリング（初期版）

```
match_score = (
  category_match * 0.3 +
  location_proximity * 0.2 +
  price_fit * 0.2 +
  photographer_rating * 0.2 +
  portfolio_quality * 0.1
) * 100
```

- 初期版: 手動推薦 + フィルター
- Phase 2: ML モデル（Photog 特性 × EC ニーズの予測）

### 4. Payment & Settlement
- Stripe Connect
  - EC事業者 → Photomatch → Photographer の3者決済
  - 手数料差し引き後、週1回自動払い
  - 税金処理: 1099-NEC準拠

### 5. Review & Rating
- 5段階評価 + テキスト評論
- カテゴリ別スコア: 納期遵守、クオリティ、コミュニケーション
- 平均スコアは Photographer プロフィールに表示

## 開発スタック

| レイヤー | 選定技術 | 理由 |
|---------|--------|------|
| Frontend | Next.js 15 | SSR/SSG, FullStack JavaScript |
| UI Framework | TailwindCSS + shadcn/ui | 開発速度・保守性 |
| State Mgmt | TanStack Query (React Query) | Server State Management |
| Database | Supabase (PostgreSQL) | Real-time, Auth統合 |
| Auth | NextAuth.js | OAuth (Google/GitHub) + Email |
| File Upload | Supabase Storage | Postgres統合, CDN |
| Payment | Stripe | 決済業界標準 |
| Analytics | PostHog | Open-source, Privacy-first |
| Hosting | Vercel + Supabase | Deploy速度, Scale自動 |
| CI/CD | GitHub Actions | GitOps |

## セキュリティ

- **認証**: NextAuth.js + JWT (HS256)
- **HTTPS**: 全通信暗号化
- **CORS**: Origin whitelist
- **Rate Limiting**: 1000req/hour/IP
- **XSS 対策**: DOMPurify, CSP header
- **CSRF 対策**: SameSite cookie
- **データ暗号化**: PII はDB暗号化
- **PCI DSS**: Stripe に委任（データ保持なし）

## パフォーマンス目標

| メトリック | 目標 |
|-----------|------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| API Response | < 200ms (p99) |
| Image Load (CDN) | < 500ms |

## スケーリング計画

### Phase 1 (0-100K users)
- Single Vercel deployment
- Supabase managed database
- CDN: Vercel edge

### Phase 2 (100K-1M users)
- Multi-region Vercel
- Database replication (read replicas)
- ElasticSearch for search
- Redis cache layer

### Phase 3 (1M+ users)
- Kubernetes on GCP / AWS
- Managed PostgreSQL (Cloud SQL / RDS)
- Message queue (RabbitMQ / Kafka)
- Microservices (matching, payment, notifications)

---

**開発期間**: MVP 3ヶ月 → Phase 1 launch (Month 6)
