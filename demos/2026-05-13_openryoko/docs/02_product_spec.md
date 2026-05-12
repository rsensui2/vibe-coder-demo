# OpenRyoko — Product Specification

## 概要

OpenRyoko は Node.js / TypeScript で実装された AI エージェント・ゲートウェイデーモン。`npm i -g openryoko` でグローバルインストール後、`ryoko start` でローカル / VPS / 自宅サーバー上に常駐サービスとして起動する。`http://localhost:7777` で REST API を提供し、Slack / Discord などのコネクタ経由でメッセージを受信する。

## システム構成

```
┌──────────────────────────────────────────────────────┐
│                  Clients                             │
│ ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│ │ Slack   │  │ Discord │  │ Webhook │  │ Web UI  │  │
│ └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  │
└──────┼───────────┼───────────┼───────────┼─────────┘
       └───────────┴───────────┴───────────┘
                   │ REST + WebSocket
                   ▼
┌──────────────────────────────────────────────────────┐
│   Gateway daemon (ryoko @ :7777)                     │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Router  │  │ Sessions │  │ Hot      │            │
│  │ /api    │  │ SQLite   │  │ Reload   │            │
│  └────┬────┘  └──────────┘  └──────────┘            │
└───────┼──────────────────────────────────────────────┘
        │
   ┌────┴────┬────────┬────────┐
   ▼         ▼        ▼        ▼
┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐
│Empl │  │Skill│  │Cron │  │Memo │
│oyee │  │ s   │  │     │  │ ry  │
└──┬──┘  └─────┘  └─────┘  └─────┘
   ▼
┌─────────────────┐
│ LLM Engines     │
│ Claude / Codex  │
└─────────────────┘
```

## モジュール詳細

### 1. Gateway daemon

- 起動: `ryoko start` または `systemctl --user start ryoko.service`
- ポート: デフォルト 7777（`config.yaml` で変更可）
- プロトコル: REST + Server-Sent Events
- 言語: TypeScript / Node.js >=20
- 起動時依存: SQLite（セッション DB）/ Markdown ファイル群
- 主な責務:
  - HTTP リクエストのルーティング
  - セッション永続化（SQLite）
  - 設定ファイル変更のホットリロード（`config.yaml`, `cron/jobs.json`, `org/*.yaml`, `skills/`）
  - エンジン（Claude / Codex）への振り分け
  - コネクタ（Slack 等）への返信

### 2. Engines（LLM プロバイダ）

| Engine | Provider | Models | Use case |
| --- | --- | --- | --- |
| `claude` | Anthropic | Opus 4.x, Sonnet 4.x, Haiku 4.x | デフォルト・高品質会話・コード生成 |
| `codex` | OpenAI | GPT-5.5, GPT-5.4 | 補完・並列タスク・コスト最適 |
| `local` | Ollama / vLLM | Llama / Mistral 系 | プライバシー最優先 |

エンジンは `config.yaml` で切替可。セッション単位・cron 単位で個別指定もできる。

### 3. Employees（人格 YAML）

`org/<department>/<name>.yaml` に YAML で人格を定義する。

```yaml
name: ryoko
department: executive
rank: executive
role: COO / Personal Assistant
engine: claude
model: opus
reportsTo: ceo
provides:
  - name: management
    description: "Delegate tasks to employees"
description: |
  あなたは Ryoko、COO 兼パーソナル AI アシスタント。
  ...
```

API: `GET /api/org`, `GET /api/org/employees/:name`, `POST /api/org/cross-request`

### 4. Skills（Markdown プレイブック）

`skills/<skill-name>/SKILL.md` に手順を書く。YAML frontmatter は必須。

```markdown
---
name: cron-manager
description: "Create, edit, enable, disable, and list cron jobs"
---

# Cron Manager

## 手順
1. ~/.ryoko/cron/jobs.json を読む
2. ...
```

スキルは Claude / Codex CLI が自動発見できるよう、`.claude/skills/` と `.agents/skills/` にシンボリックリンクが自動同期される。

### 5. Cron

`cron/jobs.json` に JSON 配列で定義する。

```json
{
  "id": "daily-briefing",
  "name": "毎朝のブリーフィング",
  "enabled": true,
  "schedule": "0 7 * * *",
  "timezone": "Asia/Tokyo",
  "engine": "claude",
  "model": "opus",
  "employee": "ryoko",
  "prompt": "今日の予定とニュースを要約して。",
  "delivery": {
    "connector": "slack",
    "channel": "C019S4U3TL4"
  }
}
```

ファイル保存と同時にホットリロード。再起動不要。

### 6. Memory（永続記憶）

- `MEMORY.md`: 毎セッションロードされる短い長期記憶（200 行以内推奨）
- `knowledge/<topic>.md`: トピック別の長文。エージェントが必要時に grep で取得
- `memory/YYYY-MM-DD.md`: 日次ノート（任意）
- `sessions/openryoko.db`: SQLite による会話履歴

### 7. Connectors

`connectors/<name>.json` で外部サービスとの接続を定義する。

| Connector | Direction | 主な用途 |
| --- | --- | --- |
| Slack | inbound + outbound | Bot 統合 / DM / Channel post |
| Discord | inbound + outbound | コミュニティ Bot |
| Email (IMAP/SMTP) | inbound + outbound | メール受信・返信 |
| Webhook | inbound | 外部システムからのトリガ |
| Linear / GitHub | outbound | Issue / PR 管理 |

## REST API（主要エンドポイント）

| Method | Path | 説明 |
| --- | --- | --- |
| GET | `/api/status` | Gateway 状態・uptime |
| GET | `/api/sessions` | セッション一覧 |
| GET | `/api/sessions/:id` | セッション詳細（messages 含む） |
| POST | `/api/sessions` | 新規セッション（`{prompt, engine?, employee?, parentSessionId?}`） |
| POST | `/api/sessions/:id/message` | 既存セッションへフォローアップ |
| GET | `/api/sessions/:id/children` | 子セッション一覧 |
| GET | `/api/cron` | cron ジョブ一覧 |
| PUT | `/api/cron/:id` | cron 更新（toggle 等） |
| GET | `/api/cron/:id/runs` | 実行履歴 |
| GET | `/api/org` | 組織ツリー（hierarchy 含む） |
| POST | `/api/org/cross-request` | 部門越え依頼 |
| GET | `/api/skills` | スキル一覧 |
| GET | `/api/skills/:name` | スキル本文 |
| GET | `/api/config` | 現在の設定 |
| PUT | `/api/config` | 設定更新（ホットリロード） |
| GET | `/api/connectors` | コネクタ一覧 |
| POST | `/api/connectors/:name/send` | コネクタ経由送信 |
| GET | `/api/logs` | 最近のログ |

## インストール

```bash
# 1. グローバルインストール
npm i -g openryoko

# 2. 初期化（~/.ryoko/ に config / org / skills を生成）
ryoko init

# 3. 起動
ryoko start

# もしくは systemd で常駐化
ryoko install-systemd
systemctl --user enable --now ryoko.service
```

## Slack Bot 設定

1. Slack API でアプリ作成（Manifest を `docs/slack-app-manifest.yaml` から流用可）
2. Bot Token を `connectors/slack.json` の `bot_token` に設定
3. Socket Mode 有効化（App Token も同ファイルに）
4. ホットリロード後、Slack で Bot にメンション → 応答

## ディレクトリ構成（デフォルト `~/.ryoko/`）

```
~/.ryoko/
├── config.yaml
├── CLAUDE.md / AGENTS.md
├── IDENTITY.md / SOUL.md / MEMORY.md
├── BOOTSTRAP.md  (初回のみ)
├── memory/
│   └── 2026-05-13.md
├── skills/
│   ├── cron-manager/
│   │   └── SKILL.md
│   └── ...
├── org/
│   └── executive/
│       └── ryoko.yaml
├── cron/
│   ├── jobs.json
│   └── runs/
├── connectors/
│   └── slack.json
├── sessions/
│   └── openryoko.db
├── docs/
└── logs/
```

## 動作環境

- Node.js >= 20 LTS
- OS: Linux / macOS / WSL2 / FreeBSD（Windows ネイティブも一応動く）
- メモリ: 512MB〜（Engine が外部 API なら軽量）
- ディスク: 100MB+
- インターネット: LLM API へのアウトバウンドのみ（必須）

## セキュリティ

- API キーは `~/.ryoko/secrets/*.json` に集約、ファイル権限 600 推奨
- Bot Token は `connectors/*.json` 内、 ` .gitignore` 推奨
- 監査ログ: `logs/` 配下に jsonl 形式
- 将来計画: SOC2 Type 1 対応版（マルチテナント）

## バージョニング

- セマンティック: `YYYY.MAJOR.MINOR`（例: `2026.4.29`）
- npm: `openryoko@latest` または `@next`
- アップデート: `npm i -g openryoko@latest && systemctl --user restart ryoko.service`
