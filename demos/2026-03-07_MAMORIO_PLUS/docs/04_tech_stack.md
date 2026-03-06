# MAMORIO PLUS - 技術スタック

## アーキテクチャ概要

```
┌─────────────────────────────────────────────────────────┐
│                    エッジデバイス                         │
│  ┌──────────┐   ┌──────────────┐   ┌──────────────┐   │
│  │MAMORIO   │   │スマートフォン  │   │スマートホーム │   │
│  │PLUSタグ  │──▶│ (iOS/Android)│──▶│ IoT連携       │   │
│  │BLE+UWB   │   │ アプリ        │   │(HomeKit/IFTTT)│   │
│  └──────────┘   └─────┬────────┘   └──────────────┘   │
└─────────────────────────┼───────────────────────────────┘
                          │ HTTPS / WebSocket
┌─────────────────────────▼───────────────────────────────┐
│                    バックエンド（AWS）                     │
│                                                          │
│  API Gateway → Lambda（Go / Python）                     │
│  ├── 位置情報API                                         │
│  ├── AI予測API（SageMaker）                              │
│  ├── コミュニティNWサーバー                               │
│  └── Business APIゲートウェイ                             │
│                                                          │
│  データ層:                                               │
│  ├── DynamoDB（リアルタイム位置情報）                     │
│  ├── RDS Aurora（ユーザー・アイテム管理）                 │
│  ├── S3（履歴データ・ML学習データ）                       │
│  └── ElastiCache Redis（セッション・キャッシュ）          │
└─────────────────────────────────────────────────────────┘
```

---

## ハードウェア技術

### UWB（Ultra Wideband）実装

```c
// UWBレンジング実装概要（疑似コード）
typedef struct {
    uint16_t device_id;
    float distance_m;       // 距離（メートル）
    float azimuth_deg;      // 方位角（度）
    float elevation_deg;    // 仰角（度）
    uint64_t timestamp_us;  // タイムスタンプ（マイクロ秒）
} UWBRangingResult;

// Two-Way Ranging（TWR）プロトコル
// 1. イニシエーター（iPhone）がポーリング送信
// 2. レスポンダー（MAMORIOタグ）がレスポンス返信
// 3. イニシエーターがファイナル送信
// 4. ToA（到着時間）差分から距離を計算
// 精度: ±5cm（視線内）、±10cm（障害物あり）
```

### BLE 5.3 技術仕様
- **Advertising:** Extended Advertising（長距離モード対応）
- **接続:** GATT over BLE（独自プロファイル）
- **暗号化:** BLE Security Mode 1, Level 4（FIPS 140-2）
- **電力効率:** Connection-less CTE（Constant Tone Extension）でDFを実現

---

## AI/ML技術

### 紛失予測エンジン

```python
# モデルアーキテクチャ概要
class ForgettingPredictor(nn.Module):
    """
    ユーザーの行動シーケンスから
    忘れ物リスクを予測するTransformerモデル
    """
    def __init__(self):
        super().__init__()
        # 時系列行動エンコーダー
        self.behavior_encoder = TransformerEncoder(
            d_model=256,
            nhead=8,
            num_layers=4
        )
        # 時空間コンテキスト
        self.spatial_embed = SpatialEmbedding(hidden=128)
        self.temporal_embed = TemporalEmbedding(hidden=128)
        
        # リスクスコアヘッド
        self.risk_head = nn.Sequential(
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Linear(128, 1),
            nn.Sigmoid()
        )
    
    def forward(self, behavior_seq, location, timestamp):
        ctx = torch.cat([
            self.spatial_embed(location),
            self.temporal_embed(timestamp)
        ], dim=-1)
        h = self.behavior_encoder(behavior_seq)
        risk_score = self.risk_head(h + ctx)
        return risk_score  # 0.0〜1.0
```

### 学習データ（匿名・プライバシー保護）
- 行動シーケンス：アイテムの接続/切断ログ
- コンテキスト：時刻・曜日・天気・カレンダーイベント（ローカル処理）
- フィードバック：ユーザーの予測精度評価
- モデル更新：週次オンラインラーニング

### フェデレーテッドラーニング
```
各ユーザーデバイス内でローカル学習
→ 差分（勾配のみ）をサーバーに送信
→ 集約して글로벌モデルを更新
→ 各デバイスにモデル配布
（生データはデバイスから一切出ない）
```

---

## セキュリティ・プライバシー技術

### ゼロ知識証明（zkSNARKs）

```javascript
// コミュニティファインディングのZKP実装概要
// 「タグXをロケーションYで発見した」という事実を
// 発見者Bのプライバシーを開示せずに証明する

const circuit = `
template LocationProof() {
    // 公開入力: タグID, エンクリプトされた位置ハッシュ
    signal input tagId;
    signal input encLocationHash;
    
    // プライベート入力: 実際の位置座標（外部非公開）
    signal private input latitude;
    signal private input longitude;
    
    // 証明: hash(lat, lon) == encLocationHash であること
    component hasher = Poseidon(2);
    hasher.inputs[0] <== latitude;
    hasher.inputs[1] <== longitude;
    hasher.out === encLocationHash;
}
`
// オーナーのみが復号できるECIES暗号化
const encrypted = ECIES.encrypt(ownerPublicKey, {lat, lon});
```

---

## インフラ構成

### AWS構成
| サービス | 用途 | スペック |
|---------|------|---------|
| Lambda（Go 1.21） | APIハンドラー | メモリ512MB、タイムアウト30s |
| DynamoDB | リアルタイム位置DB | オンデマンドモード |
| Aurora Serverless v2 | ユーザー・アイテムDB | PostgreSQL 15 |
| SageMaker | AI学習・推論 | ml.g4dn.xlarge |
| CloudFront | CDN | エッジ50拠点 |
| Cognito | 認証 | Adaptive Authentication |

### SLO目標
- API可用性：99.9%（月43分以下のダウンタイム）
- 位置情報更新レイテンシ：p99 < 200ms
- コミュニティ検索：p99 < 2秒

---

*技術仕様 v1.0 / 2026年3月*
