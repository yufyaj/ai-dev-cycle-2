# 要件定義（入力テンプレート）

## メタ
- project_id: {{project_id}} 例: 0001
- タイトル: {{title}}
- 作成者: {{author}}
- 期日: {{due_date}}

## 目的・背景
{{background}}

## スコープ
- 含まれる範囲: {{in_scope}}
- 含まれない範囲(Non-goals): {{out_of_scope}}

## 成果物(Deliverables)
- {{deliverables}}

## 受け入れ基準(Definition of Done)
- 機能: {{acceptance_functional}}
- 品質/性能: {{acceptance_non_functional}}
- セキュリティ: {{acceptance_security}}

## リポ構成(モノレポ)
- FEパス(PATHS_FE): {{paths_fe}} (例: apps/web/**)
- BEパス(PATHS_BE): {{paths_be}} (例: apps/api/**)
- FE作業ディレクトリ(FE_WORKDIR): {{fe_workdir}} (例: apps/web)
- BE作業ディレクトリ(BE_WORKDIR): {{be_workdir}} (例: apps/api})

## 技術要件
- FEパッケージマネージャ(PKG_MANAGER): {{pkg_manager}} (例: pnpm)
- Nodeバージョン(NODE_VERSION): {{node_version}} (例: 20)
- FEインストールコマンド(FE_INSTALL_CMD): {{fe_install_cmd}}
- FEテストコマンド(FE_TEST_CMD): {{fe_test_cmd}}
- BE言語(BE_LANGUAGE): {{be_language}} (node|python|java)
- BEバージョン(BE_VERSION): {{be_version}}
- BEインストールコマンド(BE_INSTALL_CMD): {{be_install_cmd}}
- BEテストコマンド(BE_TEST_CMD): {{be_test_cmd}}

## セキュリティ要件
- Semgrepポリシー(SEMGREP_POLICY): {{semgrep_policy}} (例: p/default,p/owasp-top-ten)
- 重大度閾値(SECURITY_SEVERITY_THRESHOLD): {{severity_threshold}} (例: high)
- Trivy重大度(TRIVY_SEVERITY): {{trivy_severity}} (例: HIGH,CRITICAL)
- CodeQL有効化(CODEQL_ENABLE): {{codeql_enable}} (true/false)

## 自動修正(Autofix)ポリシー
- 最大試行回数(CLAUDE_AUTOFIX_MAX_RUNS): {{autofix_runs}} (例: 5)
- クールダウン分(CLAUDE_AUTOFIX_COOLDOWN_MINUTES): {{autofix_cooldown}} (例: 1)
- セキュリティ検出も自動修正: {{autofix_security_enable}} (true/false)

## Claudeレビュー
- 最大ターン(CLAUDE_MAX_TURNS): {{claude_max_turns}} (例: 6)
- 許可ツール(レビュー)(CLAUDE_ALLOWED_TOOLS): {{claude_allowed_tools}}
- 許可ツール(修正)(CLAUDE_ALLOWED_TOOLS_FIX): {{claude_allowed_tools_fix}}

## リスク/前提/依存
- リスク: {{risks}}
- 前提: {{assumptions}}
- 依存: {{dependencies}}

## 参照
- テスト観点: .checklists/unit-test/{fe.md,be.md}
- レビュー観点: .checklists/code-review/*.md
- セキュリティ観点: .checklists/security/*.md
