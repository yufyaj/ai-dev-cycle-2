# [REQ {{project_id}}] セキュリティハードニング

## 目的
検出/推奨に基づき脆弱性の低減と安全化を行う

## 作業
- [ ] Semgrep ({{semgrep_policy}}) 指摘の対応（閾値: {{severity_threshold}}以上）
- [ ] Gitleaks（秘密情報の除去/マスク/環境変数化）
- [ ] Dockerfile 変更がある場合は Trivy ({{trivy_severity}}) 対応
- [ ] 必要に応じてCodeQLの指摘に対する安全な修正（代表パターン）

## 完了条件
- [ ] PR CI のSecurityジョブが成功する
