# [REQ {{project_id}}] {{title}}

## 概要
{{background}}

## スコープ
- 含む: {{in_scope}}
- 含まない: {{out_of_scope}}

## 成果物 / DoD
- {{deliverables}}
- 受け入れ基準: {{acceptance_functional}} / {{acceptance_non_functional}} / {{acceptance_security}}

## 実装方針
- FE: {{fe_workdir}} / {{paths_fe}} / {{fe_install_cmd}} / {{fe_test_cmd}}
- BE: {{be_workdir}} / {{paths_be}} / {{be_install_cmd}} / {{be_test_cmd}}
- セキュリティ: Semgrep={{semgrep_policy}}, Sev={{severity_threshold}}, Trivy={{trivy_severity}}, CodeQL={{codeql_enable}}

## 参照
- テスト観点: .checklists/unit-test/{fe.md,be.md}
- レビュー観点: .checklists/code-review/*.md
- セキュリティ観点: .checklists/security/*.md

## Tasks
(ここにSub Issueのタスクリストが自動で追記されます)

<!-- meta: req_id={{project_id}} -->
