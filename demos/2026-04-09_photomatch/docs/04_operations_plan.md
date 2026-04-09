# Photomatch - 運用計画

## 組織体制（初期）

```
CEO / Co-Founder
├─ CTO / Engineering Lead (1)
│  ├─ Frontend Engineer (1)
│  └─ Backend Engineer (1)
├─ VP Business Dev (1)
│  ├─ Marketing Manager (1)
│  └─ Community Manager (1)
└─ CS Lead (1)
   └─ Support Staff (1)

Total: 9人
```

## マイルストーンと責務

### Month 1-2: Foundation
**Goal**: MVP 完成、初期ユーザー 100人

| タスク | Owner | KPI |
|--------|-------|-----|
| DB スキーマ設計 | CTO | Phase 2 までレビュー完了 |
| Frontend MVP | Frontend Eng | Photographer + Buyer dashboard 完成 |
| Stripe 統合 | Backend Eng | テスト決済成功 |
| LP ローンチ | Mkt Manager | 500 PV / week |
| 初期ユーザー獲得 | BD Lead | 50 Photographer + 20 Buyer 登録 |
| CS Setup | CS Lead | Slack Community 立ち上げ |

### Month 3: Soft Launch
**Goal**: Beta テスト、初マッチング実現

| タスク | Owner | KPI |
|--------|-------|-----|
| Bug Fix & UX 改善 | Engineering | user satisfaction 4.0/5.0以上 |
| 初マッチング成約 | BD Lead | 10 matches / week |
| Reviews 機能 | Backend Eng | Rating システム完成 |
| Community ルール策定 | Community Mgr | Code of Conduct 公開 |
| PR / Press | Mkt Manager | 1 メディア掲載 |

### Month 4-6: Ramp Up
**Goal**: 正式ローンチ、5000 ユーザー

| タスク | Owner | KPI |
|--------|-------|-----|
| スケーリング対応 | CTO | 99.9% uptime |
| プレミアム機能開発 | Engineering | Premium 登録 5% conversion |
| Ad Campaign | Mkt Manager | CAC ¥4K 以下達成 |
| カスタマーサポート | CS Lead | Response time < 12h |
| パートナーシップ | BD Lead | 3 strategic partners |

## 品質管理（QA）

### テスト戦略
- **Unit Tests**: 70% coverage（Backend）
- **Integration Tests**: 主要フロー（認証、決済、マッチング）
- **E2E Tests**: Photographer & Buyer ジャーニー全体
- **Manual QA**: Beta testers による週1回テスト

### ユーザーテスト
- **Monthly User Interview**: Photographer 5人 + Buyer 5人
- **Usability Testing**: 月1回、新機能前
- **NPS Survey**: 四半期ごと

## コンプライアンス & リスク

### 法的要件
- **利用規約**: Terms of Service（GDPR/CCPA 対応）
- **個人情報保護**: PII handling policy
- **決済規約**: Stripe Terms + 税務申告

### リスク評価

| リスク | 確度 | 影響度 | 対策 |
|--------|------|--------|------|
| 低品質カメラマン流入 | 高 | 高 | Portfolio review before publish |
| 支払い不履行 | 中 | 高 | Escrow payment (Stripe Hold) |
| 著作権問題 | 中 | 中 | Copyright claim process + DMCA |
| データ漏洩 | 低 | 高 | SOC 2 Type II 認証取得 |
| Competitor 参入 | 高 | 低 | Lock-in via community + data |

## KPI ダッシュボード

### Growth Metrics
- **DAU / MAU**: Daily / Monthly Active Users
- **New Signups / Week**: Photographer + Buyer 別
- **Conversion Rate**: Signup → First Match → Payment
- **Churn Rate**: Monthly user retention

### Business Metrics
- **GMV (Gross Merchandise Volume)**: 総取引額
- **Revenue**: 手数料 + Premium fee
- **LTV (Lifetime Value)**: 平均ユーザー生涯価値
- **CAC (Customer Acquisition Cost)**: チャネル別

### Operational Metrics
- **API Response Time**: P99 < 200ms
- **Uptime**: 99.9% 以上
- **Support Ticket SLA**: 12h 以内返信

## 予算計画（Year 1）

| カテゴリ | 概算 | 備考 |
|---------|------|------|
| 人件費 | ¥10M | 9人 × 平均 1.1M/month |
| インフラ | ¥500K | Vercel + Supabase + AWS |
| マーケティング | ¥5M | Instagram + YouTube + PR |
| 営業・パートナー開発 | ¥2M | 出張・イベント |
| 法務・会計 | ¥1M | 弁護士・税理士 |
| その他（雑費） | ¥500K | オフィス家賃・ツール等 |
| **Total** | **¥19M** | |

---

**Year 1 損益予想**
- 収入: ¥6M (GMV ¥50M × 12% 手数料率)
- 支出: ¥19M
- **赤字: ¥13M** (VC funding 対象)

---

