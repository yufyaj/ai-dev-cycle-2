# Backend

FastAPI + Python バックエンドアプリケーション

## 技術スタック

- Python 3.11+
- FastAPI
- Pydantic（バリデーション）
- pytest（テストフレームワーク）

## セットアップ

```bash
# 仮想環境作成（推奨）
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 依存関係インストール
pip install -r requirements.txt
```

## 開発

```bash
# サーバー起動
uvicorn app.main:app --reload
```

## テスト

```bash
# テスト実行
pytest

# カバレッジ付きテスト
pytest --cov=app --cov-report=html

# 詳細表示
pytest -v
```
