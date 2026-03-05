# ZeroKoku - プロダクト仕様書

## コア機能

### 1. レシートスキャン
- OCR精度: 99.2%（独自AIモデル）
- 対応形式: JPEG/PNG/PDF/LivePhoto
- 処理速度: 3秒以内
- 自動分類カテゴリ: 50種類以上

### 2. 金融機関連携（Open Banking）
- 対応機関: 国内主要銀行・クレカ500行以上
- 自動同期: リアルタイム〜24時間
- 対応: Bank API / Moneytree / MoneyForward連携

### 3. AI税務エンジン
- ベースモデル: GPT-5 Fine-tuned（国税庁データ）
- 対応税制: 所得税・住民税・消費税（簡易課税）
- 副業対応: 雑所得・事業所得・一時所得の自動判別

### 4. e-Tax自動提出
- 電子申告: e-Tax XML生成・提出
- 対応フォーム: 確定申告書B（第一表〜第四表）
- 受付確認: 自動ポーリング

## 技術スタック

| Layer | Technology |
|-------|------------|
| Mobile | React Native (iOS/Android) |
| Backend | Node.js + Python（AI） |
| Database | PostgreSQL + Redis |
| AI | GPT-5 API + 独自ファインチューニング |
| OCR | Google Vision API + 独自後処理 |
| Security | SOC2 Type II 準拠 |

## セキュリティ

- データ暗号化: AES-256-GCM（保存・通信時）
- 認証: Face ID / Touch ID / パスキー対応
- 規制準拠: 個人情報保護法・電子帳簿保存法
