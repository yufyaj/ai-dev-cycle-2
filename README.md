# AI Dev Cycle 2

TDD駆動開発を自動化するGitHub Actions + Claude Codeのワークフローシステム

## 目次

- [概要](#概要)
- [要件定義からIssue作成](#要件定義からissue作成)
- [セットアップ](#セットアップ)
- [開発手順](#開発手順)
- [ワークフロー詳細](#ワークフロー詳細)
- [カスタマイズ](#カスタマイズ)
- [トラブルシューティング](#トラブルシューティング)
- [Git運用ルール](#git運用ルール)
- [コントリビューション](#コントリビューション)

## 概要

このリポジトリは、GitHubのissueにラベルを付与するだけで、Claude CodeがTDD（Test-Driven Development）で自動実装し、テスト・レビュー・PR作成まで行う自動化システムです。

### プロジェクト構成（モノレポ）

```
ai-dev-cycle-2/
├── packages/
│   ├── frontend/    # フロントエンドアプリケーション
│   └── backend/     # バックエンドアプリケーション
├── .github/
│   └── workflows/
│       ├── tdd-implement.yml   # TDD自動実装ワークフロー
│       └── pr-review.yml       # PR自動レビューワークフロー
├── ai-docs/
│   └── requirements/
│       ├── _guides/            # ガイドライン
│       └── {連番}-{機能名}/   # 要件定義書
└── README.md
```

### 主な機能

- 🤖 **TDD自動実装**: Red → Green → Refactorサイクルで実装
- 📦 **モノレポ対応**: frontend/backend別にラベルで制御
- ✅ **自動テスト**: PRのドラフト作成時に自動テスト実行
- 👀 **自動コードレビュー**: セキュリティ・品質・テストカバレッジをチェック
- 📝 **ドラフトPR自動作成**: 実装完了後、自動でドラフトPR作成
- 🎯 **自動ドラフト解除**: レビュー承認後、自動でレビュー可能状態に
- 💬 **対話型要件定義**: Claude Codeと対話しながら要件定義書を作成

## 要件定義からIssue作成

新機能を実装する前に、Claude Codeと対話しながら要件定義書を作成し、そこから親IssueとSub-Issueを自動生成します。

### 手順

#### Step 1: Claude Codeで要件定義書を作成

```bash
# Claude Code CLIを起動
claude
```

Claude Code内で以下のプロンプトを実行：

```
〇〇機能の要件定義書を一緒に作ってください

ai-docs/requirements/_guides/requirements-creation-guide.md に従って、
対話しながら詳細を詰めていってください。
```

**例:**
```
ユーザー認証機能の要件定義書を一緒に作ってください
```

#### Step 2: 対話しながら詳細を決定

Claude Codeが質問しますので、答えていきます。

**質問例:**
- なぜこの機能が必要ですか？（背景・目的）
- この機能が完成したら、どのような状態になりますか？
- どのような画面が必要ですか？
- セキュリティ要件はありますか？
- パフォーマンス要件はありますか？

**ポイント:**
- 具体的に答える（曖昧な表現を避ける）
- わからない部分は「わからない」と言ってOK（Claude Codeが提案してくれます）
- 段階的に詳細を詰めていく

#### Step 3: 要件定義書の確認

Claude Codeが要件定義書を作成しますので、内容を確認します。

**確認ポイント:**
- 機能要件に漏れはないか
- 受け入れ基準は明確か
- 技術的な制約は反映されているか

修正が必要な場合は、Claude Codeに伝えて修正してもらいます。

#### Step 4: Issue/Sub-Issue自動作成

要件定義書が完成したら、Claude Codeが自動的に親IssueとSub-Issueを作成します。

**作成されるもの:**
- **親Issue**: `[Epic]` で始まるタイトル、`epic` ラベル付き
- **Sub-Issue**: `[frontend]` または `[backend]` で始まるタイトル、親Issueに関連付けられている

**ラベル:**
- Sub-issue作成時は `frontend` または `backend` のみ付与
- 実装開始時に手動で `tdd-implement:frontend` または `tdd-implement:backend` に変更

##### Claude Codeでの作成方法

**推奨プロンプト:**

```
以下の要件定義書を読んで、親IssueとSub-Issueを作成してください。

【要件定義書】
{ファイルパスまたは内容}

【準拠事項】
ai-docs/requirements/_guides/issue-creation-guide.md に従ってください

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

**実装例:**

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

#### Step 5: 実装開始

Sub-issueの準備ができたら、ラベルを変更して実装を開始します。

```bash
# ラベルを変更してTDD実装を開始
gh issue edit {issue番号} \
  --remove-label "frontend" \
  --add-label "tdd-implement:frontend"
```

ラベル変更により、自動的にGitHub ActionsのTDD実装ワークフローが起動します。

### 必要なツール

```bash
# GitHub CLI
brew install gh  # macOS
# sudo apt install gh  # Ubuntu

# gh-sub-issue extension
gh extension install yahsan2/gh-sub-issue

# 確認
gh extension list
```

### 対話例

```
User: ユーザー認証機能の要件定義書を一緒に作ってください

Claude Code:
承知しました！いくつか質問させてください。

1. なぜユーザー認証機能が必要ですか？

User: 現在は誰でもアクセスできるけど、ユーザーごとにパーソナライズしたい

Claude Code:
なるほど。では次の質問です。

2. この機能が完成したら、どのような状態になりますか？

User: ユーザーがログインして、自分専用のダッシュボードを見られる

Claude Code:
ありがとうございます。次は具体的な機能について伺います...

（このように段階的に質問が続く）

...

Claude Code:
要件定義書を作成しました！
ディレクトリ: ai-docs/requirements/001-user-auth/
ファイル: requirement.md

内容を確認してください。

User: OKです

Claude Code:
それでは、親IssueとSub-Issueを作成します...

完了しました！
- 親Issue: #123 [Epic] ユーザー認証機能
- Sub-Issue: #124 [backend] JWTトークン生成機能の実装 (backend)
- Sub-Issue: #125 [backend] ログインAPIエンドポイントの実装 (backend)
- Sub-Issue: #126 [frontend] ログインフォームの実装 (frontend)
...

実装順序: #124 → #125 → #126
```

### ディレクトリ構造

要件定義書は以下の構造で管理されます：

```
ai-docs/requirements/
├── _guides/                      # ガイドライン（固定）
│   ├── requirements-creation-guide.md
│   ├── issue-creation-guide.md
│   └── template.md
├── 001-user-auth/                # 要件1
│   └── requirement.md
├── 002-data-export/              # 要件2
│   └── requirement.md
└── 003-dashboard/                # 要件3
    └── requirement.md
```

**命名ルール:**
- 連番: 3桁のゼロパディング（001, 002, 003...）
- 機能名: ケバブケース（小文字、ハイフン区切り）

### 詳細ガイド

詳細は以下のドキュメントを参照してください：
- `ai-docs/requirements/_guides/requirements-creation-guide.md` - 対話型要件定義作成ガイド
- `ai-docs/requirements/_guides/issue-creation-guide.md` - Issue作成ガイドライン
- `ai-docs/requirements/_guides/template.md` - 要件定義書テンプレート（参考用）

## セットアップ

### 1. Claude Code GitHub Appのインストール

ターミナルで以下のコマンドを実行：

```bash
claude /install-github-app
```

ガイドに従って以下を設定：
- GitHub Appのインストール
- リポジトリへのアクセス許可
- 必要なシークレットの自動設定

### 2. 必要なラベルの作成

GitHub CLIで必要なラベルを一括作成します：

```bash
# GitHub CLIでリポジトリにログイン（初回のみ）
gh auth login

# 必須ラベル
gh label create "epic" --description "親Issue（Epic）" --color "7057ff"
gh label create "frontend" --description "フロントエンドタスク（分類用）" --color "0E8A16"
gh label create "backend" --description "バックエンドタスク（分類用）" --color "1D76DB"
gh label create "tdd-implement:frontend" --description "フロントエンド実装トリガー" --color "0E8A16"
gh label create "tdd-implement:backend" --description "バックエンド実装トリガー" --color "1D76DB"

# 推奨ラベル（優先度）
gh label create "priority:high" --description "優先度: 高" --color "D93F0B"
gh label create "priority:medium" --description "優先度: 中" --color "FBCA04"
gh label create "priority:low" --description "優先度: 低" --color "0E8A16"

# 推奨ラベル（複雑度）
gh label create "complexity:low" --description "複雑度: 低" --color "C2E0C6"
gh label create "complexity:medium" --description "複雑度: 中" --color "FEF2C0"
gh label create "complexity:high" --description "複雑度: 高" --color "F9D0C4"
```

**既に存在するラベルはスキップされます。**

一括作成スクリプト（オプション）:

```bash
# スクリプトを作成
cat > setup-labels.sh << 'EOF'
#!/bin/bash
gh label create "epic" --description "親Issue（Epic）" --color "7057ff" 2>/dev/null || true
gh label create "frontend" --description "フロントエンドタスク（分類用）" --color "0E8A16" 2>/dev/null || true
gh label create "backend" --description "バックエンドタスク（分類用）" --color "1D76DB" 2>/dev/null || true
gh label create "tdd-implement:frontend" --description "フロントエンド実装トリガー" --color "0E8A16" 2>/dev/null || true
gh label create "tdd-implement:backend" --description "バックエンド実装トリガー" --color "1D76DB" 2>/dev/null || true
gh label create "priority:high" --description "優先度: 高" --color "D93F0B" 2>/dev/null || true
gh label create "priority:medium" --description "優先度: 中" --color "FBCA04" 2>/dev/null || true
gh label create "priority:low" --description "優先度: 低" --color "0E8A16" 2>/dev/null || true
gh label create "complexity:low" --description "複雑度: 低" --color "C2E0C6" 2>/dev/null || true
gh label create "complexity:medium" --description "複雑度: 中" --color "FEF2C0" 2>/dev/null || true
gh label create "complexity:high" --description "複雑度: 高" --color "F9D0C4" 2>/dev/null || true
echo "ラベルの作成が完了しました"
EOF

# 実行権限を付与して実行
chmod +x setup-labels.sh
./setup-labels.sh
```

#### ラベル一覧

| ラベル | 用途 | ワークフロー起動 | 色 |
|--------|------|-----------------|-----|
| `epic` | 親Issue（Epic） | しない | 紫 |
| `frontend` | フロントエンド分類用 | しない | 緑 |
| `backend` | バックエンド分類用 | しない | 青 |
| `tdd-implement:frontend` | フロントエンド実装トリガー | **する** | 緑 |
| `tdd-implement:backend` | バックエンド実装トリガー | **する** | 青 |
| `priority:high` | 優先度：高 | しない | 赤 |
| `priority:medium` | 優先度：中 | しない | 黄 |
| `priority:low` | 優先度：低 | しない | 緑 |
| `complexity:low` | 複雑度：低 | しない | 淡緑 |
| `complexity:medium` | 複雑度：中 | しない | 淡黄 |
| `complexity:high` | 複雑度：高 | しない | 淡赤 |

### 3. セキュリティルールのダウンロード

project-codeguard/rules から最新のセキュリティルールをダウンロードします：

```bash
# 最新リリースを確認
curl -s https://api.github.com/repos/project-codeguard/rules/releases/latest | grep "tag_name"

# Claude Code用のルールをダウンロード（v1.0.0の例）
cd ai-docs/security/codeguard-rules/

curl -L -o claude-code-rules.md \
  https://github.com/project-codeguard/rules/releases/download/v1.0.0/claude-code-rules.md

# 配置を確認
ls -la claude-code-rules.md
```

**CodeGuardは8つのセキュリティドメインをカバーしています:**
1. 暗号化（安全なアルゴリズムと鍵管理）
2. 入力検証（SQLインジェクション、XSS対策）
3. 認証（MFA とセキュアなセッション管理）
4. 認可（アクセス制御と IDOR 防止）
5. サプライチェーン（依存性セキュリティ）
6. クラウドセキュリティ（IaC と Kubernetes 対策）
7. プラットフォームセキュリティ（モバイルと API セキュリティ）
8. データ保護（暗号化とセキュアストレージ）

詳細は `ai-docs/security/codeguard-rules/README.md` を参照してください。

### 4. シークレットの確認

GitHubリポジトリの **Settings → Secrets and variables → Actions** で以下が設定されていることを確認：

| シークレット名 | 説明 |
|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | Claude Code GitHub App認証トークン（自動設定済み） |

### 5. テストコマンドの設定

`.github/workflows/pr-review.yml` を開き、各パッケージに応じてテストコマンドをカスタマイズ：

#### フロントエンド（Node.js）の場合

```yaml
- name: テスト環境のセットアップ (frontend)
  if: steps.detect-package.outputs.package == 'frontend' || steps.detect-package.outputs.package == 'all'
  working-directory: packages/frontend
  run: npm install

- name: テスト実行 (frontend)
  if: steps.detect-package.outputs.package == 'frontend' || steps.detect-package.outputs.package == 'all'
  working-directory: packages/frontend
  run: npm test
```

#### バックエンド（Python）の場合

```yaml
- name: テスト環境のセットアップ (backend)
  if: steps.detect-package.outputs.package == 'backend' || steps.detect-package.outputs.package == 'all'
  working-directory: packages/backend
  run: pip install -r requirements.txt

- name: テスト実行 (backend)
  if: steps.detect-package.outputs.package == 'backend' || steps.detect-package.outputs.package == 'all'
  working-directory: packages/backend
  run: pytest
```

### 6. 動作確認

1. テスト用のissueを作成
2. `tdd-implement:frontend` または `tdd-implement:backend` ラベルを付与
3. GitHub Actionsタブでワークフローが実行されることを確認
4. 対象パッケージが正しく判別されているかログで確認

## 開発手順

### 基本的な開発フロー

```
1. Issueの作成
   ↓
2. ラベル付与（tdd-implement）
   ↓
3. 自動実装（TDDサイクル）
   ↓
4. ドラフトPR作成
   ↓
5. 自動テスト実行
   ↓
6. 自動コードレビュー
   ↓
7. ドラフト解除（問題なければ）
   ↓
8. 最終確認・マージ
```

### 詳細手順

#### Step 1: Issueの作成

新機能やバグ修正のissueを作成します。

**Issueに含めるべき情報:**
- 📋 実装内容の明確な説明
- ✅ 受け入れ基準（Acceptance Criteria）
- 🎯 期待される動作
- 🚫 エッジケースや制約条件

**例:**
```markdown
## 概要
ユーザー認証機能を実装する

## 受け入れ基準
- [ ] ユーザーがメールアドレスとパスワードでログインできる
- [ ] 不正な認証情報の場合、エラーメッセージを表示する
- [ ] ログイン成功後、ダッシュボードにリダイレクトする

## エッジケース
- 空の入力値
- 無効なメールアドレス形式
- パスワード長の制限
```

#### Step 2: ラベルの付与

作成したissueに対象パッケージに応じたラベルを付与します。

**使用可能なラベル:**
- `tdd-implement:frontend` - フロントエンド実装用
- `tdd-implement:backend` - バックエンド実装用

**操作方法:**
1. Issue画面右側の「Labels」をクリック
2. 対象パッケージのラベルを選択（なければ作成）
   - フロントエンドの場合: `tdd-implement:frontend`
   - バックエンドの場合: `tdd-implement:backend`
3. 自動的にGitHub Actionsワークフローが起動

**ラベルの作成:**
初回のみ、以下のラベルを作成してください：
- 名前: `tdd-implement:frontend`、色: `#0E8A16`（緑）
- 名前: `tdd-implement:backend`、色: `#1D76DB`（青）

#### Step 3: 自動実装（TDDサイクル）

Claude Codeが自動的に以下の手順で実装を行います：

##### 3-1. Red（失敗するテストを書く）
- Issue要件を満たすテストケースを作成
- エッジケースも含めて網羅的にテスト
- この時点でテストは失敗する

##### 3-2. Green（テストを通す最小限の実装）
- テストを通すための最小限のコードを実装
- すべてのテストが通ることを確認

##### 3-3. Refactor（リファクタリング）
- コードの可読性と保守性を向上
- 重複コードの排除
- CLAUDE.mdの規約に準拠

**進捗確認:**
- GitHub Actionsタブで実行状況を確認できます
- リアルタイムでログが表示されます

#### Step 4: ドラフトPR作成

実装完了後、自動的に以下が作成されます：

- **ブランチ**: `feature/{パッケージ名}/issue-{issue番号}`
  - 例: `feature/frontend/issue-123`
- **ドラフトPR**: タイトルに「[{パッケージ名}] TDD実装: {issue タイトル}」
  - 例: `[frontend] TDD実装: ユーザー認証機能の追加`
- **PR本文**:
  - 📦 対象パッケージ
  - 📝 実装内容の概要
  - 🔄 TDDサイクルの各ステップで行った内容
  - 📊 テストカバレッジの情報
  - 📂 変更されたファイルのリスト
  - `Closes #{issue番号}`
  - Issue作成者へのメンション

**通知:**
元のissueにコメントが追加され、PR作成が通知されます。

#### Step 5: 自動テスト実行

ドラフトPR作成後、自動的にテストが実行されます。

**実行内容:**
- ブランチ名から対象パッケージを自動判別
- 対象パッケージのみテスト環境をセットアップ
- 対象パッケージのテストのみを実行
- カバレッジレポートの生成（設定されている場合）

**例:**
- `feature/frontend/issue-123` → `packages/frontend/` のテストのみ実行
- `feature/backend/issue-456` → `packages/backend/` のテストのみ実行

**結果確認:**
- PRのChecksタブで結果を確認
- 失敗した場合、エラーログが表示されます

#### Step 6: 自動コードレビュー

テスト成功後、Claude Codeが自動レビューを実施します。

**レビュー観点:**

1. **セキュリティチェック（CodeGuardルール準拠）**
   - SQLインジェクション、XSS、CSRFなどの脆弱性
   - 機密情報のハードコーディング（パスワード、APIキー等）
   - 安全でない暗号化アルゴリズムの使用
   - 認証・認可の不備
   - 入力検証の欠如
   - 依存関係のセキュリティ問題

   詳細は `ai-docs/security/codeguard-rules/` を参照

2. **コード品質**
   - CLAUDE.mdの規約準拠
   - 可読性と保守性
   - パフォーマンスの問題
   - エラーハンドリング

3. **テスト品質**
   - テストカバレッジの適切性
   - エッジケースの考慮
   - テストの可読性

4. **ベストプラクティス**
   - デザインパターンの適切な使用
   - DRY原則の遵守
   - SOLID原則の遵守

**レビュー結果:**
PRにコメントとして以下の形式で投稿されます：

```markdown
## 🔍 コードレビュー結果

### ✅ 良い点
- [良い点のリスト]

### ⚠️ 改善提案
- [改善が必要な点]

### 🚨 重大な問題
- [重大な問題、なければ「なし」]

### 📊 総合評価
- セキュリティ: 🟢安全
- コード品質: 🟢良好
- テスト品質: 🟢十分

### 🎯 次のアクション
ドラフト解除可能
```

#### Step 7: ドラフト解除

レビューで重大な問題がなければ、自動的にドラフトが解除されます。

**自動解除の条件:**
- ✅ すべてのテストが成功
- ✅ セキュリティチェック合格
- ✅ コード品質基準を満たす
- ✅ テストカバレッジが十分

**手動修正が必要な場合:**
レビューで問題が見つかった場合：
1. PRコメントで `@claude` をメンション
2. 修正内容を指示
3. Claude Codeが自動で修正を実施
4. 再度レビューサイクルが実行される

#### Step 8: 最終確認・マージ

ドラフトが解除されたら、人間による最終確認を行います。

**確認ポイント:**
- 実装内容がissueの要件を満たしているか
- テストが適切に書かれているか
- コードレビューの指摘事項が解決されているか

**マージ方法:**
1. PRページの「Merge pull request」ボタンをクリック
2. マージコミットメッセージを確認
3. 「Confirm merge」をクリック

**マージ後:**
- 自動的にissueがクローズされます
- ブランチの削除（オプション）

### 追加修正が必要な場合

実装後に追加の修正が必要な場合：

#### パターン1: PRに対して修正依頼

```markdown
@claude この実装に以下の修正をお願いします：
- バリデーションエラーメッセージを日本語化
- タイムアウト時間を30秒に変更
```

#### パターン2: 新しいissueを作成

大きな変更が必要な場合は、新しいissueを作成して `tdd-implement` ラベルを付与

## ワークフロー詳細

### tdd-implement.yml

**トリガー:** issueに `tdd-implement` ラベルが付与された時

**実行内容:**
1. Issue内容の解析
2. TDDサイクルでの実装
3. ブランチ作成とコミット
4. ドラフトPR作成
5. Issue作成者への通知

**使用シークレット:**
- `CLAUDE_CODE_OAUTH_TOKEN`

### pr-review.yml

**トリガー:** ドラフトPR作成・更新時

**実行内容:**
1. テスト環境のセットアップ
2. 自動テスト実行
3. Claude Codeによるコードレビュー
4. レビュー結果のPRコメント投稿
5. 問題なければドラフト解除

**使用シークレット:**
- `CLAUDE_CODE_OAUTH_TOKEN`
- `GITHUB_TOKEN`（自動提供）

## カスタマイズ

### テストコマンドの変更

`.github/workflows/pr-review.yml` の `auto-test` ジョブを編集：

```yaml
- name: テスト実行
  run: |
    # あなたのテストコマンドをここに記述
    npm run test:coverage
```

### レビュー基準の調整

`.github/workflows/pr-review.yml` の `prompt` セクションを編集してレビュー観点を追加・変更できます。

### TDD実装ガイドラインの変更

`.github/workflows/tdd-implement.yml` の `prompt` セクションを編集してTDDの指針を調整できます。

### CLAUDE.mdでのプロジェクト固有設定

`CLAUDE.md` ファイルに以下を記述すると、Claude Codeがそれに従います：

```markdown
## コーディング規約
- インデント: スペース2つ
- 命名規則: キャメルケース
- コメント: 日本語で記述

## テスト規約
- テストフレームワーク: Jest
- カバレッジ目標: 80%以上
- モックライブラリ: jest.mock()

## セキュリティ要件
- 全API呼び出しに認証トークンが必要
- 入力値は必ずバリデーション
- SQLクエリはパラメータ化必須
```

## トラブルシューティング

### ワークフローが起動しない

**確認項目:**
- [ ] `tdd-implement` ラベルが正しく付与されているか
- [ ] GitHub Actionsが有効になっているか（Settings → Actions）
- [ ] ワークフローファイルの構文エラーがないか

### テストが失敗する

**対処方法:**
1. PRのChecksタブでエラーログを確認
2. PRに `@claude` をメンションして修正を依頼
3. または手動で修正をプッシュ

### Claude Codeが応答しない

**確認項目:**
- [ ] `CLAUDE_CODE_OAUTH_TOKEN` が正しく設定されているか
- [ ] トークンの有効期限が切れていないか
- [ ] GitHub Appの権限が適切に設定されているか

**対処方法:**
```bash
# トークンの再設定
claude /install-github-app
```

### レビューコメントが投稿されない

**確認項目:**
- [ ] PRがドラフト状態になっているか
- [ ] GitHub Actionsの実行ログでエラーがないか
- [ ] `pull-requests: write` 権限が付与されているか

## 参考資料

- [Claude Code公式ドキュメント](https://docs.claude.com/en/docs/claude-code/github-actions)
- [Claude Code Action GitHub](https://github.com/anthropics/claude-code-action)
- [TDD（Test-Driven Development）について](https://ja.wikipedia.org/wiki/テスト駆動開発)
- [project-codeguard/rules](https://github.com/project-codeguard/rules) - AI向けセキュリティルール

## ライセンス

このプロジェクトのライセンスをここに記載してください。

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
| 🔧 | `:wrench:` | 設定ファイル修正 |
| 🚀 | `:rocket:` | デプロイ関連 |

完全なリスト: [gitmoji.dev](https://gitmoji.dev/)

### コミットタイプ

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `refactor`: リファクタリング
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更

## コントリビューション

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

**コントリビューション時のルール:**
1. コミットメッセージには必ずgitmojiを付与（上記参照）
2. TDD（Test-Driven Development）を遵守
3. CLAUDE.mdのコーディング規約に準拠
4. PRはドラフトで作成し、レビュー後に本番化
