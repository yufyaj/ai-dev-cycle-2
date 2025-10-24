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
- コミット: `feat({パッケージ名}): Issue #{番号} をTDDで実装`
- ドラフトPR作成（タイトル: `[{パッケージ名}] TDD実装: {Issue タイトル}`）

### モード4: コードレビュー

ドラフトPRに対するレビュー（GitHub Actionsから自動起動）。

**レビュー観点:**
1. セキュリティ（SQLインジェクション、XSS、機密情報のハードコーディング）
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

- テストは実装と同じファイル構造で配置
- テスト名は `test_` で始める（Python）、`it('should...', ...)` 形式（JavaScript）
- 1つのテストは1つの事を検証
- Arrange-Act-Assert パターンを使用
- エッジケースも必ずテスト

### エラーハンドリング

- 例外は適切にキャッチして処理
- ユーザーにわかりやすいエラーメッセージ
- ログには十分な情報を含める
- 本番環境では詳細なエラーを隠す

### セキュリティ

- パスワードは必ずハッシュ化
- SQLクエリはパラメータ化（SQLインジェクション対策）
- ユーザー入力は必ずバリデーション
- 機密情報は環境変数で管理（ハードコーディング厳禁）
- HTTPS必須

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

## GitHubラベルの使い分け

| ラベル | 使用タイミング | ワークフロー起動 |
|--------|---------------|-----------------|
| `epic` | 親Issue作成時 | しない |
| `frontend` | Sub-issue作成時（フロントエンド） | しない |
| `backend` | Sub-issue作成時（バックエンド） | しない |
| `tdd-implement:frontend` | 実装開始時（手動変更） | **する** |
| `tdd-implement:backend` | 実装開始時（手動変更） | **する** |

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

## 更新履歴

- 2025-01-24: 初版作成
