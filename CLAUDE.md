# AI Dev Cycle 2 - Claude Code 指示書

このドキュメントは、Claude Codeがこのプロジェクトで作業する際の指針を定義します。

## プロジェクト概要

TDD駆動開発を自動化するGitHub Actions + Claude Codeのワークフローシステム。
要件定義書からIssue/Sub-issue作成、TDD実装、テスト、レビュー、PR作成までを自動化します。

## プロジェクト構成

```
ai-dev-cycle-2/
├── packages/
│   ├── frontend/    # フロントエンドアプリケーション
│   └── backend/     # バックエンドアプリケーション
├── .github/workflows/
│   ├── tdd-implement.yml   # TDD自動実装ワークフロー
│   └── pr-review.yml       # PR自動レビューワークフロー
├── ai-docs/requirements/
│   ├── _guides/            # ガイドライン
│   └── {連番}-{機能名}/   # 要件定義書
├── CLAUDE.md              # このファイル
└── README.md
```

## 作業モード

### モード1: 要件定義書作成

ユーザーから「〇〇機能の要件定義書を作ってください」と依頼された場合。

**参照ドキュメント:**
- `ai-docs/requirements/_guides/requirements-creation-guide.md`
- `ai-docs/requirements/_guides/template.md`

**手順:**
1. requirements-creation-guide.md の手順に従って対話
2. 段階的に詳細を収集
3. 要件定義書を `ai-docs/requirements/{連番}-{機能名}/requirement.md` に作成
4. ユーザーに確認を求める
5. 承認後、Issue/Sub-issue作成に進む

**連番の決定:**
```bash
# 既存の最大連番を確認
ls -d ai-docs/requirements/[0-9]* 2>/dev/null | sort -r | head -1
# 最大連番 + 1 を使用（例: 002 → 003）
# 初回の場合は 001
```

### モード2: Issue/Sub-Issue作成

要件定義書から親IssueとSub-Issueを作成する場合。

**参照ドキュメント:**
- `ai-docs/requirements/_guides/issue-creation-guide.md`

**重要なルール:**
- **親Issue**: `[Epic]` で始まるタイトル、`epic` ラベル
- **Sub-Issue**: `[frontend]` または `[backend]` で始まるタイトル
- **ラベル戦略**:
  - Sub-issue作成時: `frontend` または `backend` のみ（**tdd-implement:* は付けない**）
  - 実装開始時に人が手動で `tdd-implement:frontend` または `tdd-implement:backend` に変更

**使用ツール:**
- `gh issue create` - 親Issue作成
- `gh sub-issue create` - Sub-issue作成（gh-sub-issue extension必須）

**実装順序の推奨:**
1. Backend基礎（認証、データモデル、API）
2. Frontend基礎（ルーティング、state管理）
3. Backend → Frontend の順で機能実装

### モード3: TDD実装

`tdd-implement:frontend` または `tdd-implement:backend` ラベルが付与されたIssueの実装。

**参照ドキュメント:**
- CLAUDE.md（このファイル）
- Issue本文の実装内容と受け入れ基準
- `ai-docs/security/codeguard-rules/` - セキュリティルール（実装時に必ず準拠）

**TDDサイクル（厳守）:**
1. **Red**: 失敗するテストを先に書く
2. **Green**: テストを通す最小限の実装
3. **Refactor**: コードの可読性と保守性を向上

**作業ディレクトリ:**
- フロントエンド: `packages/frontend/`
- バックエンド: `packages/backend/`

**完了条件:**
- すべてのテストが通る
- コードカバレッジが適切
- このCLAUDE.mdのコーディング規約に準拠
- 対象パッケージ内のみを変更

**成果物:**
- ブランチ: `feature/{パッケージ名}/issue-{番号}`
- コミット: `✨ feat({パッケージ名}): Issue #{番号} をTDDで実装`
  - **必ずgitmojiを先頭に付与**
- ドラフトPR作成（タイトル: `[{パッケージ名}] TDD実装: {Issue タイトル}`）

### モード4: コードレビュー

ドラフトPRに対するレビュー（GitHub Actionsから自動起動）。

**参照ドキュメント:**
- `ai-docs/security/codeguard-rules/` - セキュリティチェックリスト

**レビュー観点:**
1. **セキュリティ（CodeGuardルール準拠）**
   - SQLインジェクション、XSS、CSRF対策
   - 機密情報のハードコーディング（パスワード、APIキー、トークン等）
   - 安全でない暗号化アルゴリズムの使用
   - 認証・認可の不備
   - 入力検証の欠如
2. コード品質（可読性、保守性、パフォーマンス、エラーハンドリング）
3. テスト品質（カバレッジ、エッジケース、可読性）
4. ベストプラクティス（デザインパターン、DRY、SOLID原則）

**レビュー結果の形式:**
PRコメントとして以下の形式で投稿：
```markdown
## 🔍 コードレビュー結果

### ✅ 良い点
- [良い点をリストアップ]

### ⚠️ 改善提案
- [改善が必要な点をリストアップ]

### 🚨 重大な問題
- [重大な問題、なければ「なし」]

### 📊 総合評価
- セキュリティ: [🟢安全 / 🟡要確認 / 🔴問題あり]
- コード品質: [🟢良好 / 🟡改善推奨 / 🔴要改善]
- テスト品質: [🟢十分 / 🟡追加推奨 / 🔴不十分]

### 🎯 次のアクション
[問題なければ「ドラフト解除可能」、問題があれば「修正が必要」と具体的な指示]
```

## コーディング規約

### 一般原則

- **可読性優先**: 誰が読んでも理解できるコード
- **KISS原則**: Keep It Simple, Stupid
- **DRY原則**: Don't Repeat Yourself
- **SOLID原則**: 特にSingle Responsibility Principleを重視

### 命名規則

#### Frontend（JavaScript/TypeScript）
- 変数・関数: `camelCase`
- コンポーネント: `PascalCase`
- 定数: `UPPER_SNAKE_CASE`
- ファイル名: コンポーネントは `PascalCase.tsx`、その他は `camelCase.ts`

#### Backend（Python想定）
- 変数・関数: `snake_case`
- クラス: `PascalCase`
- 定数: `UPPER_SNAKE_CASE`
- ファイル名: `snake_case.py`

### コメント

- **日本語で記述**
- 「何を」ではなく「なぜ」を説明
- 複雑なロジックには必ずコメント
- TODOコメントは `# TODO: 説明` 形式

### テスト

#### 単体テスト（Unit Test）
- テストは実装と同じファイル構造で配置
- テスト名は `test_` で始める（Python）、`it('should...', ...)` 形式（JavaScript）
- 1つのテストは1つの事を検証
- Arrange-Act-Assert パターンを使用
- エッジケースも必ずテスト

#### E2Eテスト（End-to-End Test）
- **配置**: `packages/frontend/e2e/` ディレクトリ
- **ツール**: Playwright
- **命名**: `*.spec.ts` 形式
- **構造**: `test.describe()` でグループ化
- **セレクター優先順位**:
  1. `getByRole()` - アクセシビリティ重視（推奨）
  2. `getByLabel()` - フォーム要素
  3. `getByText()` - 表示テキスト
  4. `getByTestId()` - 最終手段
- **ベストプラクティス**:
  - Page Object Modelパターンを使用（複雑なページの場合）
  - `waitFor` は最小限に（Playwrightの自動待機を活用）
  - 各テストは独立して実行可能にする
  - `test.beforeEach()` で共通のセットアップ
  - ユーザー視点でのシナリオをテスト

### エラーハンドリング

- 例外は適切にキャッチして処理
- ユーザーにわかりやすいエラーメッセージ
- ログには十分な情報を含める
- 本番環境では詳細なエラーを隠す

### セキュリティ

**基本要件:**
- パスワードは必ずハッシュ化
- SQLクエリはパラメータ化（SQLインジェクション対策）
- ユーザー入力は必ずバリデーション
- 機密情報は環境変数で管理（ハードコーディング厳禁）
- HTTPS必須

**セキュリティルール:**
実装とレビューの際は、必ず以下のCodeGuardセキュリティルールに準拠してください：
- `ai-docs/security/codeguard-rules/claude-code-rules.md`（ダウンロード後）
- `ai-docs/security/codeguard-rules/README.md`（セットアップ手順）

CodeGuardは8つの重要なセキュリティドメインをカバーしています：
1. 暗号化（安全なアルゴリズムと鍵管理）
2. 入力検証（SQLインジェクション、XSS対策）
3. 認証（MFA とセキュアなセッション管理）
4. 認可（アクセス制御と IDOR 防止）
5. サプライチェーン（依存性セキュリティ）
6. クラウドセキュリティ（IaC と Kubernetes 対策）
7. プラットフォームセキュリティ（モバイルと API セキュリティ）
8. データ保護（暗号化とセキュアストレージ）

## パッケージ別の追加規約

### Frontend

- 状態管理は適切なライブラリを使用（Redux、Zustand等）
- コンポーネントは小さく保つ（100行以内推奨）
- propsの型定義は必須（TypeScript）
- CSSはモジュール化またはCSS-in-JS

### Backend

- API設計はRESTful原則に従う
- 認証・認可は全エンドポイントで確認
- レート制限を実装
- データベースクエリは最適化

## Git運用ルール

### コミットメッセージ

**必ずgitmojiを先頭に付与してください。**

**形式:**
```
{gitmoji} {type}({scope}): {subject}

{body}
```

**例:**
```
✨ feat(frontend): ログインフォームの実装

- メールアドレス入力フィールド追加
- パスワード入力フィールド追加
- バリデーション実装
```

### よく使うgitmoji

| gitmoji | code | 用途 |
|---------|------|------|
| ✨ | `:sparkles:` | 新機能追加 |
| 🐛 | `:bug:` | バグ修正 |
| 📝 | `:memo:` | ドキュメント追加・更新 |
| ♻️ | `:recycle:` | リファクタリング |
| ✅ | `:white_check_mark:` | テスト追加・更新 |
| 🎨 | `:art:` | コードの構造・フォーマット改善 |
| ⚡️ | `:zap:` | パフォーマンス改善 |
| 🔒 | `:lock:` | セキュリティ修正 |
| ⬆️ | `:arrow_up:` | 依存関係のアップグレード |
| ⬇️ | `:arrow_down:` | 依存関係のダウングレード |
| 🚧 | `:construction:` | 作業中（WIP） |
| 🔧 | `:wrench:` | 設定ファイル修正 |
| 🚀 | `:rocket:` | デプロイ関連 |
| 🔥 | `:fire:` | コード・ファイル削除 |

**参考:** [gitmoji.dev](https://gitmoji.dev/)

### コミットタイプ

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響しない変更（空白、フォーマット等）
- `refactor`: リファクタリング
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更

### ブランチ命名規則

- `feature/{パッケージ名}/issue-{番号}` - 機能追加
- `fix/{パッケージ名}/issue-{番号}` - バグ修正
- `refactor/{パッケージ名}/issue-{番号}` - リファクタリング

## GitHubラベルの使い分け

| ラベル | 使用タイミング | ワークフロー起動 |
|--------|---------------|-----------------|
| `epic` | 親Issue作成時 | しない |
| `frontend` | Sub-issue作成時（フロントエンド） | しない |
| `backend` | Sub-issue作成時（バックエンド） | しない |
| `tdd-implement:frontend` | 実装開始時（手動変更） | **する** |
| `tdd-implement:backend` | 実装開始時（手動変更） | **する** |

## 自動修正ワークフロー

PRコメントでClaude Codeによる自動修正を起動できます。

### 使用可能なコマンド

#### `/fix-tests` - テスト失敗を自動修正

**使用タイミング**: PR自動テストが失敗した時

**動作**:
1. テスト失敗ログを分析
2. 失敗原因を特定（テストコード or 実装コード）
3. 適切な修正を適用
4. 修正内容をPRコメントで報告
5. 自動的にコミット・プッシュ

**例**:
```
/fix-tests
```

#### `/apply-review` - レビュー指摘を自動修正

**使用タイミング**: コードレビュー完了後、重要な指摘事項がある時

**動作**:
1. 直近のClaude Codeレビューコメントを取得
2. 🚨重大な問題と重要度の高い⚠️改善提案のみを適用
3. 修正内容をPRコメントで報告
4. 自動的にコミット・プッシュ

**修正対象**:
- ✅ 重大な問題（セキュリティ、バグ等）
- ✅ 重要な改善提案（パフォーマンス、セキュリティに関わる提案）
- ❌ 軽微な提案（スタイリング、コメント追加等）

**例**:
```
/apply-review
```

### 注意事項

- **手動起動のみ**: 自動では実行されません。PRコメントでコマンドを入力してください
- **1回のみ実行**: 同じコメントに対しては1回のみ実行されます
- **権限が必要**: PR作成者またはCollaboratorのみが実行できます
- **修正内容の確認**: 修正後、必ずコミット内容を確認してください
- **無限ループ防止**: 修正が失敗した場合、手動で対応してください

## よくある質問

### Q: 要件定義書の連番がわからない場合は？
A: 以下のコマンドで最大連番を確認し、+1する
```bash
ls -d ai-docs/requirements/[0-9]* 2>/dev/null | sort -r | head -1
```

### Q: Sub-issueに`tdd-implement:*`ラベルを付けてしまった場合は？
A: すぐにラベルを削除し、`frontend`または`backend`に変更してください。

### Q: TDD実装中に仕様が不明確な場合は？
A: Issueにコメントでユーザーに質問してください。勝手に判断しないこと。

### Q: テストが通らない場合は？
A: Red-Green-Refactorサイクルを見直してください。Greenフェーズで最小限の実装をしているか確認。

### Q: コードレビューで重大な問題を見つけた場合は？
A: 🚨セクションに明記し、「修正が必要」と明示してください。

## 参考資料

### プロジェクト内ドキュメント
- `README.md` - プロジェクト全体の概要と手順
- `ai-docs/requirements/_guides/requirements-creation-guide.md` - 要件定義書作成ガイド
- `ai-docs/requirements/_guides/issue-creation-guide.md` - Issue作成ガイド
- `ai-docs/requirements/_guides/template.md` - 要件定義書テンプレート

### 外部リソース
- [Claude Code公式ドキュメント](https://docs.claude.com/en/docs/claude-code)
- [TDD（Test-Driven Development）](https://ja.wikipedia.org/wiki/テスト駆動開発)
- [GitHub Sub-issues](https://zenn.dev/tacoms/articles/ea427591f8dba2)
- [gh-sub-issue](https://github.com/yahsan2/gh-sub-issue)
- [project-codeguard/rules](https://github.com/project-codeguard/rules) - セキュリティルール

## 更新履歴

- 2025-01-24: project-codeguard/rulesのセキュリティルール統合
- 2025-01-24: Git運用ルール（gitmoji必須）を追加
- 2025-01-24: 初版作成
