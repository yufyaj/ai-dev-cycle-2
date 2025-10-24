# Issue/Sub-Issue作成ガイドライン

このドキュメントは、要件定義書から親IssueとSub-Issueを作成する際の準拠事項を定義します。

## 前提条件

### 必要なツール

1. **GitHub CLI (gh)**
   ```bash
   # インストール確認
   gh --version
   ```

2. **gh-sub-issue extension**
   ```bash
   # インストール
   gh extension install yahsan2/gh-sub-issue

   # 確認
   gh extension list
   ```

## Issue階層構造

GitHubのSub-issue機能により、以下の階層構造を実現します：

```
親Issue (Epic)
├── Sub-Issue 1 (Task) - frontend
├── Sub-Issue 2 (Task) - backend
├── Sub-Issue 3 (Task) - frontend
└── Sub-Issue 4 (Task) - backend
```

## ラベル戦略

### Sub-issue作成時のラベル

**作成時に付与:**
- `frontend` - フロントエンドタスク（分類用、ワークフロー起動しない）
- `backend` - バックエンドタスク（分類用、ワークフロー起動しない）

**実装開始時に手動で変更:**
- `frontend` → `tdd-implement:frontend` (ワークフロー起動)
- `backend` → `tdd-implement:backend` (ワークフロー起動)

### ラベルの使い分け

| ラベル | 用途 | ワークフロー起動 |
|--------|------|-----------------|
| `frontend` | Sub-issueの分類 | しない |
| `backend` | Sub-issueの分類 | しない |
| `tdd-implement:frontend` | TDD実装トリガー | **する** |
| `tdd-implement:backend` | TDD実装トリガー | **する** |

## 親Issueの作成規則

### タイトル命名規則

```
[Epic] {機能名}
```

**例:**
- `[Epic] ユーザー認証機能`
- `[Epic] ダッシュボード画面の実装`
- `[Epic] データエクスポート機能`

### 本文テンプレート

```markdown
## 概要
{機能の概要を1-3文で説明}

## 背景・目的
{なぜこの機能が必要なのか、ビジネス価値は何か}

## 受け入れ基準
- [ ] {基準1}
- [ ] {基準2}
- [ ] {基準3}

## 機能要件

### {カテゴリ1}
- {要件1}
- {要件2}

### {カテゴリ2}
- {要件3}
- {要件4}

## 非機能要件

- **パフォーマンス**: {具体的な数値目標}
- **セキュリティ**: {要件}
- **可用性**: {要件}

## 制約・前提条件

- {制約1}
- {制約2}

## UI/UX要件（該当する場合）

- {要件}

## 参考資料

- {リンクやドキュメント}
```

### ラベル

**必須:**
- `epic`

**推奨:**
- `enhancement` (新機能)
- `bug` (バグ修正)

## Sub-Issueの作成規則

### タイトル命名規則

```
[{パッケージ名}] {具体的なタスク名}
```

**例:**
- `[frontend] ログインフォームの実装`
- `[backend] 認証APIエンドポイントの実装`
- `[frontend] ユーザー情報表示コンポーネントの作成`
- `[backend] セッション管理機能の実装`

### 本文テンプレート

```markdown
## 概要
{このタスクの具体的な内容}

## 実装内容
- {実装項目1}
- {実装項目2}
- {実装項目3}

## 受け入れ基準
- [ ] {テストケース1}
- [ ] {テストケース2}
- [ ] {テストケース3}

## 技術的な詳細

### 使用技術・ライブラリ
- {技術1}
- {技術2}

### API仕様（該当する場合）
- **エンドポイント**: `{method} {path}`
- **リクエスト**: {説明}
- **レスポンス**: {説明}

### データモデル（該当する場合）
\```{language}
{コード例}
\```

## テストケース
1. **正常系**: {テストケース}
2. **異常系**: {テストケース}
3. **エッジケース**: {テストケース}

## 依存関係
- {他のSub-Issueとの依存関係がある場合は明記}

## 見積もり
- **工数**: {時間}
- **複雑度**: {低/中/高}
```

### ラベル

**Sub-issue作成時に付与（必須、いずれか）:**
- `frontend` - フロントエンドタスク
- `backend` - バックエンドタスク

**実装開始時に手動で変更:**
- `frontend` → `tdd-implement:frontend`
- `backend` → `tdd-implement:backend`

**推奨ラベル:**
- `priority:high` / `priority:medium` / `priority:low`
- `complexity:low` / `complexity:medium` / `complexity:high`

## Sub-Issueの分割方針

### 分割の基準

1. **パッケージ境界**: frontend/backendで明確に分割
2. **機能単位**: 1つのSub-Issueは1つの明確な機能
3. **サイズ**: 1-3日で完了できる規模
4. **独立性**: 可能な限り他のSub-Issueに依存しない
5. **テスタビリティ**: 独立してテスト可能
6. **AIコンテキスト**: Claude Codeが理解しやすい粒度（小さいコンテキスト）

### 典型的な分割パターン

#### パターン1: 画面機能

```
親Issue: [Epic] ユーザープロフィール機能

Sub-Issues:
1. [backend] プロフィール取得APIの実装 (backend)
2. [backend] プロフィール更新APIの実装 (backend)
3. [backend] プロフィール画像アップロード機能の実装 (backend)
4. [frontend] プロフィール表示画面の実装 (frontend)
5. [frontend] プロフィール編集フォームの実装 (frontend)
6. [frontend] プロフィール画像アップロードUIの実装 (frontend)
```

**実装順序:** Backend (1→2→3) → Frontend (4→5→6)

#### パターン2: API機能

```
親Issue: [Epic] データエクスポート機能

Sub-Issues:
1. [backend] エクスポートAPIエンドポイントの実装 (backend)
2. [backend] CSV形式変換ロジックの実装 (backend)
3. [backend] JSON形式変換ロジックの実装 (backend)
4. [backend] エクスポートジョブキューの実装 (backend)
5. [frontend] エクスポートボタンUIの実装 (frontend)
6. [frontend] フォーマット選択UIの実装 (frontend)
7. [frontend] ダウンロード処理の実装 (frontend)
```

#### パターン3: 認証機能

```
親Issue: [Epic] ユーザー認証機能

Sub-Issues:
1. [backend] JWTトークン生成機能の実装 (backend)
2. [backend] ログインAPIエンドポイントの実装 (backend)
3. [backend] ログアウトAPIエンドポイントの実装 (backend)
4. [backend] トークンリフレッシュ機能の実装 (backend)
5. [backend] パスワードリセット機能の実装 (backend)
6. [frontend] ログインフォームの実装 (frontend)
7. [frontend] 認証状態管理の実装 (frontend)
8. [frontend] 認証ガード（ルート保護）の実装 (frontend)
9. [frontend] パスワードリセット画面の実装 (frontend)
```

## パッケージ判別基準

### Frontend（フロントエンド）

**該当する実装:**
- UI/UXコンポーネント
- 画面レイアウト、スタイリング
- クライアントサイドstate管理
- ブラウザAPI操作
- フォームバリデーション（クライアント側）
- ルーティング、ナビゲーション
- アニメーション、トランジション

**キーワード:**
- コンポーネント、画面、表示、UI、デザイン
- React、Vue、Angular、Svelte
- CSS、スタイル、レイアウト

### Backend（バックエンド）

**該当する実装:**
- APIエンドポイント
- データベース操作（CRUD）
- ビジネスロジック
- 認証・認可処理
- サーバーサイドバリデーション
- 外部API連携
- バッチ処理、cron job
- メール送信、通知機能

**キーワード:**
- API、エンドポイント、REST、GraphQL
- データベース、DB、SQL、ORM
- 認証、JWT、トークン
- サーバー、モデル、スキーマ

## 受け入れ基準の書き方（SMART原則）

- **Specific（具体的）**: 曖昧さをなくす
- **Measurable（測定可能）**: テスト可能
- **Achievable（達成可能）**: 現実的
- **Relevant（関連性）**: 機能要件に沿う
- **Time-bound（期限）**: 完了定義が明確

### ✅ 良い例

```markdown
## 受け入れ基準
- [ ] ユーザーが正しいメールアドレスとパスワードを入力した場合、ログインに成功しダッシュボードにリダイレクトされる
- [ ] 不正な認証情報の場合、「メールアドレスまたはパスワードが正しくありません」というエラーメッセージが表示される
- [ ] パスワードは8文字以上、英数字混在が必須で、条件を満たさない場合はエラーが表示される
- [ ] ログイン状態が24時間保持される
- [ ] 5回連続でログイン失敗した場合、アカウントが15分間ロックされる
```

### ❌ 悪い例

```markdown
## 受け入れ基準
- [ ] ログインできる
- [ ] エラーが出ない
- [ ] 使いやすい
```

## Claude Codeでの作成方法

### 推奨プロンプト

```
以下の要件定義書を読んで、親IssueとSub-Issueを作成してください。

【要件定義書】
{ファイルパスまたは内容}

【準拠事項】
ai-docs/requirements/issue-creation-guide.md に従ってください

【重要】
Sub-issue作成時は `frontend` または `backend` ラベルのみを付与し、
`tdd-implement:*` ラベルは付与しないでください。
（実装開始時に人が手動で変更します）

【手順】
1. 要件定義書を分析
2. 親Issueを作成（gh issue create）
3. 機能をfrontend/backend別のSub-Issueに分割
4. gh-sub-issueで各Sub-Issueを作成（ラベルは frontend または backend のみ）
5. 実装順序を推奨

作成したIssueのURL一覧を報告してください。
```

### 実装例

```bash
# 1. 親Issue作成
PARENT_ID=$(gh issue create \
  --title "[Epic] ユーザー認証機能" \
  --body "$(cat parent-issue-body.md)" \
  --label "epic,enhancement" \
  --json number --jq .number)

echo "親Issue作成完了: #${PARENT_ID}"

# 2. Sub-Issue作成（gh-sub-issue使用）
# 注意: ラベルは frontend または backend のみ
gh sub-issue create ${PARENT_ID} \
  --title "[backend] JWTトークン生成機能の実装" \
  --body "$(cat sub-issue-1-body.md)" \
  --label "backend,priority:high,complexity:medium"

gh sub-issue create ${PARENT_ID} \
  --title "[backend] ログインAPIエンドポイントの実装" \
  --body "$(cat sub-issue-2-body.md)" \
  --label "backend,priority:high,complexity:low"

gh sub-issue create ${PARENT_ID} \
  --title "[frontend] ログインフォームの実装" \
  --body "$(cat sub-issue-3-body.md)" \
  --label "frontend,priority:medium,complexity:low"

echo "Sub-Issue作成完了"
echo "実装開始時は、ラベルを tdd-implement:frontend または tdd-implement:backend に変更してください"
```

## 実装開始の流れ

### 1. Sub-issue作成直後（待機状態）

```
Sub-Issue: [backend] ログインAPIの実装
ラベル: backend, priority:high
状態: 待機中（ワークフロー起動しない）
```

### 2. 実装準備完了後（手動でラベル変更）

```bash
# ラベルを変更
gh issue edit {issue番号} \
  --remove-label "backend" \
  --add-label "tdd-implement:backend"
```

### 3. ワークフロー自動起動

```
Sub-Issue: [backend] ログインAPIの実装
ラベル: tdd-implement:backend, priority:high
状態: TDD実装ワークフロー起動 → 自動実装開始
```

## チェックリスト

### 親Issue作成時

- [ ] タイトルが `[Epic]` で始まっている
- [ ] 概要が明確（1-3文）
- [ ] 背景・目的が説明されている
- [ ] 受け入れ基準が具体的でテスト可能
- [ ] 機能要件が網羅的
- [ ] 非機能要件が含まれている
- [ ] `epic` ラベルが付与されている

### Sub-Issue作成時

- [ ] タイトルが `[frontend]` または `[backend]` で始まっている
- [ ] 親IssueのSub-issueとして関連付けられている
- [ ] 実装内容が具体的
- [ ] 受け入れ基準が明確
- [ ] テストケースが含まれている
- [ ] `frontend` または `backend` ラベルのみ付与（**tdd-implement:* は付与しない**）
- [ ] 依存関係が明記されている（ある場合）
- [ ] 見積もりが記載されている

### 実装開始時

- [ ] Sub-issueの準備が完了している
- [ ] ラベルを `frontend` → `tdd-implement:frontend` または `backend` → `tdd-implement:backend` に変更
- [ ] GitHub Actionsが起動したことを確認

## 実装順序の推奨

1. **依存関係**: 他のタスクの前提となるものを優先
2. **リスク**: 技術的不確実性が高いものを先に
3. **価値**: ビジネス価値が高いものを優先
4. **複雑度**: 複雑なものを先に（早期リスク発見）

### 一般的な順序

```
Phase 1: Backend基礎
  - データモデル設計
  - 認証・認可機能
  - 基本CRUD API

Phase 2: Frontend基礎
  - ルーティング設定
  - 認証状態管理
  - 基本レイアウト

Phase 3: 機能実装
  - Backend API → Frontend UIの順

Phase 4: 統合・テスト
  - E2Eテスト
  - パフォーマンステスト
```

## AI駆動開発のメリット

Sub-issueを小さく分割することで：
- ✅ **小さいコンテキスト** = Claude Codeが理解しやすい
- ✅ **並列開発可能** = 複数タスクを同時に処理
- ✅ **自動実装の精度向上** = 明確な指示で高品質な実装
- ✅ **段階的な実装制御** = ラベル変更で実装タイミングを制御

## 進捗管理

GitHubのSub-issue機能により自動化：
- 進捗率の可視化（親Issueに完了率が表示）
- 階層的な表示
- GitHub Projects連携

## 参考資料

- [gh-sub-issue GitHub](https://github.com/yahsan2/gh-sub-issue)
- [Zenn: GitHub Sub-issuesを使った進捗管理](https://zenn.dev/tacoms/articles/ea427591f8dba2)
- [Zenn: gh-sub-issueの紹介](https://zenn.dev/yahsan2/articles/5225afe6bac43d)
