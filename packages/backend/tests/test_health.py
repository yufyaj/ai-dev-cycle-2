"""
ヘルスチェックAPIエンドポイントのテスト

このモジュールは /health エンドポイントの動作を検証します。
TDD（Test-Driven Development）のRedフェーズとして作成されています。
"""
import pytest
from datetime import datetime
from httpx import AsyncClient
from fastapi import status


@pytest.mark.asyncio
async def test_health_endpoint_returns_200():
    """
    /health エンドポイントが200 OKを返すことを検証
    """
    from app.main import app

    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == status.HTTP_200_OK


@pytest.mark.asyncio
async def test_health_endpoint_returns_ok_status():
    """
    /health エンドポイントのレスポンスに status: "ok" が含まれることを検証
    """
    from app.main import app

    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
        data = response.json()

        assert "status" in data
        assert data["status"] == "ok"


@pytest.mark.asyncio
async def test_health_endpoint_returns_timestamp():
    """
    /health エンドポイントのレスポンスに timestamp が含まれることを検証
    """
    from app.main import app

    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
        data = response.json()

        assert "timestamp" in data
        assert isinstance(data["timestamp"], str)


@pytest.mark.asyncio
async def test_health_endpoint_timestamp_is_iso8601_format():
    """
    timestamp がISO 8601形式であることを検証
    """
    from app.main import app

    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
        data = response.json()

        timestamp = data["timestamp"]
        # ISO 8601形式でパース可能か確認
        try:
            parsed_time = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            assert parsed_time is not None
        except ValueError:
            pytest.fail(f"Timestamp '{timestamp}' is not in ISO 8601 format")


@pytest.mark.asyncio
async def test_health_endpoint_multiple_requests():
    """
    複数回連続でアクセスしても正常に動作することを検証
    エッジケース: 連続リクエスト
    """
    from app.main import app

    async with AsyncClient(app=app, base_url="http://test") as client:
        for _ in range(5):
            response = await client.get("/health")
            assert response.status_code == status.HTTP_200_OK
            data = response.json()
            assert data["status"] == "ok"
            assert "timestamp" in data


@pytest.mark.asyncio
async def test_health_endpoint_timestamp_is_updated():
    """
    タイムスタンプが毎回最新の値を返すことを検証
    エッジケース: タイムスタンプの更新
    """
    from app.main import app
    import asyncio

    async with AsyncClient(app=app, base_url="http://test") as client:
        # 1回目のリクエスト
        response1 = await client.get("/health")
        timestamp1 = response1.json()["timestamp"]

        # 少し待機
        await asyncio.sleep(0.1)

        # 2回目のリクエスト
        response2 = await client.get("/health")
        timestamp2 = response2.json()["timestamp"]

        # タイムスタンプが異なることを確認（または同じ場合でも正常に動作）
        # 注: 処理が高速な場合、同じタイムスタンプになる可能性がある
        # 重要なのは、エラーが発生しないこと
        time1 = datetime.fromisoformat(timestamp1.replace('Z', '+00:00'))
        time2 = datetime.fromisoformat(timestamp2.replace('Z', '+00:00'))

        # time2 >= time1 であることを確認（時間が巻き戻らない）
        assert time2 >= time1


@pytest.mark.asyncio
async def test_health_endpoint_response_structure():
    """
    レスポンスの構造が正しいことを検証
    必要なフィールドのみが含まれることを確認
    """
    from app.main import app

    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
        data = response.json()

        # 必須フィールドが含まれることを確認
        assert "status" in data
        assert "timestamp" in data

        # 余計なフィールドがないことを確認
        assert len(data) == 2
