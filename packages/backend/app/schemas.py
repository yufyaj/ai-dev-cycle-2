"""
APIレスポンスのPydanticモデル定義

このモジュールはAPIエンドポイントのレスポンススキーマを定義します。
"""
from pydantic import BaseModel, ConfigDict


class HealthCheckResponse(BaseModel):
    """
    ヘルスチェックAPIのレスポンスモデル

    Attributes:
        status: アプリケーションの稼働状態（常に "ok"）
        timestamp: 現在のUTC時刻（ISO 8601形式）
    """

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "status": "ok",
                "timestamp": "2025-10-28T12:34:56.789000Z",
            }
        }
    )

    status: str
    timestamp: str
