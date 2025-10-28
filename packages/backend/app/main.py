"""
FastAPIアプリケーションのメインモジュール

このモジュールはFastAPIアプリケーションと各種エンドポイントを定義します。
"""
from fastapi import FastAPI
from datetime import datetime, timezone
from app.schemas import HealthCheckResponse

# FastAPIアプリケーションのインスタンス化
app = FastAPI(
    title="Backend API",
    description="TDD駆動開発を自動化するGitHub Actions + Claude CodeのバックエンドAPI",
    version="1.0.0",
)


@app.get(
    "/health",
    response_model=HealthCheckResponse,
    summary="ヘルスチェック",
    description="アプリケーションの稼働状態を確認するエンドポイント",
    tags=["Health"],
)
async def health_check() -> HealthCheckResponse:
    """
    ヘルスチェックエンドポイント

    アプリケーションが正常に稼働していることを確認するためのエンドポイント。
    常に200 OKを返し、現在のタイムスタンプを含むレスポンスを返します。

    Returns:
        HealthCheckResponse: 稼働状態とタイムスタンプを含むレスポンス
    """
    # 現在のUTC時刻を取得
    current_time = datetime.now(timezone.utc)

    # ISO 8601形式に変換（Z付きフォーマット）
    timestamp = current_time.isoformat().replace("+00:00", "Z")

    return HealthCheckResponse(status="ok", timestamp=timestamp)
