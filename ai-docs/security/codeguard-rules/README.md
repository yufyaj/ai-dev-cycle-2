# CodeGuard セキュリティルール

このディレクトリには、[project-codeguard/rules](https://github.com/project-codeguard/rules) のセキュリティルールを配置します。

## 概要

CodeGuardは、AI コーディングエージェント向けのセキュリティフレームワークで、以下の8つの重要なセキュリティドメインをカバーしています：

1. **暗号化** - 安全なアルゴリズムと鍵管理
2. **入力検証** - SQL インジェクション、XSS 対策
3. **認証** - MFA とセキュアなセッション管理
4. **認可** - アクセス制御と IDOR 防止
5. **サプライチェーン** - 依存性セキュリティ
6. **クラウドセキュリティ** - IaC と Kubernetes 対策
7. **プラットフォームセキュリティ** - モバイルと API セキュリティ
8. **データ保護** - 暗号化とセキュアストレージ

## セットアップ

### 1. ルールのダウンロード

最新のルールをダウンロードします：

```bash
cd ai-docs/security/codeguard-rules/

# リポジトリをクローンしてrulesディレクトリのみをコピー
git clone --depth 1 https://github.com/project-codeguard/rules.git temp-codeguard
cp -r temp-codeguard/rules/* .
rm -rf temp-codeguard

# 配置を確認（25個程度のルールファイルが表示される）
ls -la *.md
```

### 2. ルールの配置

ダウンロードしたルールがこのディレクトリに配置されます：

```
ai-docs/security/codeguard-rules/
├── README.md (このファイル)
├── codeguard-0-authentication-mfa.md
├── codeguard-0-authorization-access-control.md
├── codeguard-0-input-validation-injection.md
├── codeguard-1-crypto-algorithms.md
├── codeguard-1-hardcoded-credentials.md
└── （その他のルールファイル、合計25個程度）
```

### 3. 動作確認

ルールが正しく配置されているか確認：

```bash
ls -la ai-docs/security/codeguard-rules/
```

## 使用方法

### 実装時

Claude CodeがTDD実装を行う際、自動的にこのルールを参照します。

CLAUDE.mdに記載されている通り、以下のセキュリティ要件が遵守されます：
- パスワードは必ずハッシュ化
- SQLクエリはパラメータ化（SQLインジェクション対策）
- ユーザー入力は必ずバリデーション
- 機密情報は環境変数で管理
- HTTPS必須

### レビュー時

PR自動レビューワークフローにより、CodeGuardのルールに基づいたセキュリティチェックが実行されます。

チェック項目：
- SQLインジェクション、XSS などの脆弱性
- 機密情報のハードコーディング
- 認証・認可の不備
- 安全でない暗号化アルゴリズムの使用
- 依存関係のセキュリティ問題

## 更新方法

定期的にCodeGuardのルールを更新することを推奨します：

```bash
cd ai-docs/security/codeguard-rules/

# 最新のルールをダウンロード（既存ファイルを上書き）
git clone --depth 1 https://github.com/project-codeguard/rules.git temp-codeguard
cp -r temp-codeguard/rules/* .
rm -rf temp-codeguard

# 変更をコミット
git add .
git commit -m "⬆️ chore(security): CodeGuardルールを最新版に更新"
git push
```

## カスタマイズ

プロジェクト固有のセキュリティ要件がある場合は、`custom-rules.md` を作成してください：

```bash
# カスタムルールファイルを作成
touch ai-docs/security/codeguard-rules/custom-rules.md
```

**custom-rules.md 例:**
```markdown
# プロジェクト固有セキュリティルール

## API認証
- すべてのAPIエンドポイントにJWT認証必須
- トークンの有効期限は24時間

## データベース
- PostgreSQL 15以上を使用
- すべてのクエリはPrisma ORMを経由

## 環境変数
- .envファイルは.gitignoreに必ず追加
- 本番環境の環境変数はGitHub Secretsで管理
```

CLAUDE.mdにカスタムルールへの参照を追加してください。

## トラブルシューティング

### ルールが適用されない場合

1. ルールファイルが正しく配置されているか確認
   ```bash
   ls -la ai-docs/security/codeguard-rules/*.md
   # 25個程度のルールファイルが表示されるはず
   ```

2. CLAUDE.mdに参照が記載されているか確認

3. Claude Codeを再起動

### ルールが厳しすぎる場合

特定のルールを無効化したい場合は、CLAUDE.mdに例外を記載してください：

```markdown
## セキュリティ例外

以下のケースではCodeGuardルールの例外を許可：
- テストコードでのハードコードされた認証情報（テスト用のみ）
- 開発環境でのHTTP使用（localhost限定）
```

## 参考資料

- [project-codeguard/rules リポジトリ](https://github.com/project-codeguard/rules)
- [CodeGuard リリースページ](https://github.com/project-codeguard/rules/releases)
- [ライセンス](https://github.com/project-codeguard/rules/blob/main/LICENSE) - CC BY 4.0 (ルール), Apache 2.0 (ツール)
