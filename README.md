# AI-Dev-Cycle GitHub Actions Pack

要件 → Issue化 → Draft PR → CI(Tests→Security) → CI成功後のClaudeレビュー → Ready化 → 人間承認 → マージを自動化します。Monorepo対応、Projectsは不使用です。

- Claudeは`anthropics/claude-code-action`を使用（MAX OAuthトークン: `CLAUDE_CODE_OAUTH_TOKEN`）。直APIキーは未使用。
- 主要アクションはコミットSHAでピン留め済み。設定値はRepository Variables(変数)で制御できます。

## セットアップ

1) GitHub App「Claude」をインストールし、ローカルで `claude setup-token` を実行→表示トークンをSecretsへ登録
- リポの Secrets: `CLAUDE_CODE_OAUTH_TOKEN`

2) 変数（Repository Variables）を設定（例）
- PATHS_FE=apps/web/**, FE_WORKDIR=apps/web, NODE_VERSION=20, PKG_MANAGER=pnpm, FE_INSTALL_CMD=pnpm i --frozen-lockfile, FE_TEST_CMD=pnpm test -- --ci
- PATHS_BE=apps/api/**, BE_WORKDIR=apps/api, BE_LANGUAGE=python, BE_VERSION=3.11, BE_INSTALL_CMD=pip install -r requirements.txt, BE_TEST_CMD=pytest -q
- SEMGREP_POLICY=p/default,p/owasp-top-ten, SECURITY_SEVERITY_THRESHOLD=high, TRIVY_SEVERITY=HIGH,CRITICAL, CODEQL_ENABLE=false
- CLAUDE_MAX_TURNS=6, CLAUDE_ALLOWED_TOOLS= mcp__github_inline_comment__create_inline_comment,Bash(gh pr comment:*),Bash(gh pr view:*), CLAUDE_ALLOWED_TOOLS_FIX= Bash(git *),Bash(gh pr comment:*),Bash(gh pr view:*),Bash(gh run view:*)
- BRANCH_PREFIXES=feat/req-,fix/req-, CLAUDE_AUTOFIX_MAX_RUNS=5, CLAUDE_AUTOFIX_COOLDOWN_MINUTES=1

3) 要件テンプレートを用意
- `requirements/<id>/issues/parent.md`
- `requirements/<id>/issues/sub/*.md`
- 参考テンプレ: `templates/requirements_intake.md`, `templates/issues/*`

## 初期設定コマンド（GitHub CLI）

- 事前に `gh auth status` でログイン確認。別リポを対象にする場合は各コマンドへ `-R <owner/repo>` を付与。

- Variables（代表初期値）
フロントエンド
```
gh variable set PATHS_FE -b 'apps/web/**'
gh variable set FE_WORKDIR -b 'apps/web'
gh variable set PKG_MANAGER -b 'pnpm'
gh variable set NODE_VERSION -b '20'
gh variable set FE_INSTALL_CMD -b 'pnpm i --frozen-lockfile'
gh variable set FE_TEST_CMD -b 'pnpm test -- --ci'
```

バックエンド（Python例）
```
gh variable set PATHS_BE -b 'apps/api/**'
gh variable set BE_WORKDIR -b 'apps/api'
gh variable set BE_LANGUAGE -b 'python'
gh variable set BE_VERSION -b '3.11'
gh variable set BE_INSTALL_CMD -b 'pip install -r requirements.txt'
gh variable set BE_TEST_CMD -b 'pytest -q'
```

セキュリティ
```
gh variable set SEMGREP_POLICY -b 'p/default,p/owasp-top-ten'
gh variable set SECURITY_SEVERITY_THRESHOLD -b 'high'
gh variable set TRIVY_SEVERITY -b 'HIGH,CRITICAL'
gh variable set CODEQL_ENABLE -b 'false'
```

Claude（レビュー/修正の許可ツールと上限）
```
gh variable set CLAUDE_MAX_TURNS -b '6'
gh variable set CLAUDE_ALLOWED_TOOLS -b 'mcp__github_inline_comment__create_inline_comment,Bash(gh pr comment:*),Bash(gh pr view:*)'
gh variable set CLAUDE_ALLOWED_TOOLS_FIX -b 'Bash(git add:*),Bash(git commit:*),Bash(git push:*),Bash(gh pr comment:*),Bash(gh pr view:*),Bash(gh run view:*)'
```

ブランチ規約/Autofix
```
gh variable set BRANCH_PREFIXES -b 'feat/req-,fix/req-'
gh variable set CLAUDE_AUTOFIX_MAX_RUNS -b '5'
gh variable set CLAUDE_AUTOFIX_COOLDOWN_MINUTES -b '1'
```

確認
```
gh variable list
gh secret list
```

## ワークフロー

- Issueize Requirement (`.github/workflows/issueize-requirement.yml`)
  - 手動実行で親/子Issueを作成。ラベル: `req:<id>`, 親`type:parent`, 子`type:sub`
  - 親本文に子Issueのチェックリストを追記。重複検知（タイトル一致＋ラベル）あり

- Auto Draft PR (`.github/workflows/auto-draft-pr.yml`)
  - 規約ブランチpushでDraft PRを自動作成（既存PRがなければ）。本文に親Issue参照を付与

- PR CI & Security (`.github/workflows/pr-ci.yml`)
  - 変更範囲（PATHS_FE/BE）に応じFE/BEテスト、Semgrep/Gitleaksを実行。Dockerfile変更時はTrivy。CodeQLは可変

- Claude Review After CI (`.github/workflows/claude-after-ci.yml`)
  - 「PR CI & Security」がsuccessのときのみ、ClaudeがPRをレビュー（フォークPRは除外）

- Claude Autofix After Failed CI (`.github/workflows/claude-autofix.yml`)
  - 「PR CI & Security」がfailureのとき、Draft PRに対し最大5回/1分間隔で自動修正を試行（Tests/セキュリティ/Claude指摘）

- Claude Manual Run (`.github/workflows/claude-manual.yml`)
  - 手動起動で任意の`prompt`を実行（設計補助/要約/局所修正）

## 運用ルール
- ゲート順序はA: Tests → Security → Claude。CI失敗時はマージ不可
- 自動修正はDraft PRのみ対象（フォーク/Readyは除外）。`no-autofix`ラベルで停止
- 変更規模や対象パスの上限は設けない方針（必要に応じて変数化可能）
- ブランチ保護のRequired checks: `frontend-tests`, `backend-tests`, `semgrep`, `gitleaks`（段階で`codeql`, `trivy`）

## 使い方
1. 要件をCLI対話で固め、`requirements/<id>/issues/`に親/子MDを配置
2. Actions > Issueize Requirement を手動実行（`project_id=<id>`）
3. `feat/req-<id>-<slug>`で開発しpush → Draft PRが自動作成
4. PRでCI/セキュリティが動作 → 成功時にClaudeレビュー、失敗時はAutofixが試行
5. 準備が整ったらReady化→人間承認→マージ

## 注意
- SecretsはフォークPRには渡されません。Claudeレビュー/Autofixは自動的にスキップされます
- 自動修正は安全な範囲に限定。破壊的変更や履歴改変/キー再発行はコメントで人手対応を促します
