# FINDLY 技術アーキテクチャ

## システム全体像

```
[FINDLY Tag] ──BLE広告── [FINDLYゲートウェイ] ──MQTT/HTTPS── [クラウドバックエンド] ──Push通知── [ユーザースマホ]
                                                                        │
                                                              [鉄道会社ダッシュボード]
                                                              [遺失物管理システム連携]
```

---

## ハードウェア仕様

### FINDLY Tag（スマートタグ）

| 仕様 | 詳細 |
|------|------|
| BLEチップ | Nordic Semiconductor nRF52832 |
| BLEバージョン | Bluetooth 5.0 |
| 広告間隔 | 通常: 10秒、省電力: 60秒（バッテリー残量に応じて自動切替） |
| UUID | ハードウェア製造時にユニークID焼き付け |
| 電池 | CR2032（最大2年） |
| サイズ | 35mm × 35mm × 6mm |
| 重量 | 8g |
| 防水 | IP67 |
| Firmware OTA | BLE DFU（Device Firmware Update）対応 |

**動作モード**
- **通常モード**: 10秒間隔でBLE Advertisementを送信
- **省電力モード**: 60秒間隔（バッテリー残量20%以下で自動移行）
- **高頻度モード**: スマホとのBLE接続中は1秒間隔（近接検知精度向上）

### FINDLY Gateway（ゲートウェイ）

| 仕様 | 詳細 |
|------|------|
| BLEスキャン | BLE 5.0 マルチチャンネルスキャン |
| 通信 | Wi-Fi 6 / 有線LAN（SFP対応）|
| 処理 | ARM Cortex-A55 Quad-core |
| BLE受信範囲 | 最大75m（見通し） |
| 同時検知数 | 最大1,000デバイス/秒 |
| 設置方法 | 壁面・天井・ポール設置対応 |
| 電源 | PoE（IEEE 802.3at）/ ACアダプタ |
| 耐環境性 | -20℃〜50℃、IP54 |

---

## クラウドアーキテクチャ

### インフラ構成（AWS）

```
Route53 → CloudFront → API Gateway
                           ↓
                    Lambda (Node.js / Python)
                           ↓
              ┌────────────┼────────────┐
           DynamoDB      Redis        S3
         (デバイス管理)  (セッション) (ログ・履歴)
              │
         Amazon MSK (Kafka)
         (リアルタイムイベントストリーム)
              │
         Lambda Consumers
         ┌────┴────┐
      通知処理   分析処理
         │
   SNS → FCM/APNs
```

### データモデル（主要テーブル）

**devices テーブル**
```json
{
  "device_id": "FINDLY-A1B2C3D4",
  "user_id": "usr_xxx",
  "nickname": "財布",
  "last_seen_at": 1708000000,
  "last_gateway_id": "gw_shinjuku_01",
  "battery_level": 85,
  "firmware_version": "2.3.1"
}
```

**detection_events テーブル**
```json
{
  "event_id": "evt_xxx",
  "device_id": "FINDLY-A1B2C3D4",
  "gateway_id": "gw_shinjuku_01",
  "station_name": "新宿駅 遺失物センター",
  "rssi": -65,
  "detected_at": 1708000000,
  "notified": true,
  "notification_sent_at": 1708000023
}
```

---

## 通知フロー（詳細）

```
1. タグが遺失物センターに持ち込まれる
   ↓
2. ゲートウェイがBLE Advertisement受信（RSSI閾値: -80dBm以上）
   ↓
3. ゲートウェイ → MQTT Broker（AWS IoT Core）へイベント送信
   ↓ (平均レイテンシ: 800ms)
4. Lambda Consumerがイベント受信・デバイスID逆引き
   ↓
5. DynamoDBでuser_id取得・通知設定確認
   ↓
6. Amazon SNS → FCM（Android）/ APNs（iOS）送信
   ↓ (合計所要時間: 平均23秒)
7. ユーザースマホにプッシュ通知「📍 新宿駅遺失物センターで検知されました」
```

---

## セキュリティ設計

### デバイス認証
- タグのUUIDは製造時にセキュアエレメントに焼き付け
- UUID ≠ 個人情報（クラウド側でのみ紐付け管理）
- BLE Advertisement にはUUIDのみを含む（位置情報・個人情報をBLEで流さない）

### データ暗号化
- 通信: TLS 1.3 (mTLS for gateway)
- 保存: AES-256 at rest (DynamoDB, S3)
- PII（個人情報）はカラムレベル暗号化

### プライバシー設計
- UUID Rotation: 24時間ごとにUUID（ペイロード）をローリング更新（ストーキング防止）
- 第三者スキャン: 他ユーザーのデバイスをスキャンしても個人情報は取得不可
- ゲートウェイオペレーター（鉄道会社）はデバイス存在のみ確認可・ユーザー情報は非公開

---

## アプリ技術スタック

| レイヤー | 技術 |
|---------|------|
| iOS | Swift / SwiftUI / CoreBluetooth |
| Android | Kotlin / Jetpack Compose / Android BLE API |
| バックグラウンドスキャン | iOS: Core Location + BLE Background Scan, Android: Foreground Service |
| 地図 | MapLibre（OpenStreetMap） |
| プッシュ通知 | Firebase Cloud Messaging（FCM）/ Apple Push Notification Service（APNs） |

---

## 鉄道会社向けダッシュボード

```
機能:
  - リアルタイム検知件数表示
  - 遺失物ステータス管理（受付中 / 保管中 / 受取済み）
  - 問い合わせ電話件数 vs FINDLY通知件数の比較レポート
  - ゲートウェイ死活監視
  - 月次レポート自動生成（PDF）
```

**技術**: Next.js + Recharts + Supabase

---

## スケーラビリティ

| 指標 | 現在の設計上限 |
|------|--------------|
| 登録デバイス数 | 1,000万個 |
| 同時接続ゲートウェイ | 100,000台 |
| 1日の検知イベント数 | 5億件 |
| 通知送信レイテンシP99 | < 60秒 |
