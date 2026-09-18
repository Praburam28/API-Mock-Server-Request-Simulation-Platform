from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.mock_api import MockAPI
from app.models.request_log import RequestLog


class DashboardRepository:

    def get_total_mock_apis(
        self,
        db: Session,
        owner_id: int,
    ) -> int:
        return (
            db.scalar(
                select(func.count(MockAPI.id)).where(
                    MockAPI.owner_id == owner_id,
                )
            )
            or 0
        )

    def get_active_mock_apis(
        self,
        db: Session,
        owner_id: int,
    ) -> int:
        return (
            db.scalar(
                select(func.count(MockAPI.id)).where(
                    MockAPI.owner_id == owner_id,
                    MockAPI.is_active.is_(True),
                )
            )
            or 0
        )

    def get_total_requests(
        self,
        db: Session,
        owner_id: int,
    ) -> int:
        return (
            db.scalar(
                select(func.count(RequestLog.id))
                .join(
                    MockAPI,
                    RequestLog.mock_api_id == MockAPI.id,
                )
                .where(
                    MockAPI.owner_id == owner_id,
                )
            )
            or 0
        )

    def get_error_requests(
        self,
        db: Session,
        owner_id: int,
    ) -> int:
        return (
            db.scalar(
                select(func.count(RequestLog.id))
                .join(
                    MockAPI,
                    RequestLog.mock_api_id == MockAPI.id,
                )
                .where(
                    MockAPI.owner_id == owner_id,
                    RequestLog.response_status >= 400,
                    RequestLog.response_status <= 599,
                )
            )
            or 0
        )

    def get_average_response_time(
        self,
        db: Session,
        owner_id: int,
    ) -> float:
        average_time = db.scalar(
            select(func.avg(RequestLog.response_time_ms))
            .join(
                MockAPI,
                RequestLog.mock_api_id == MockAPI.id,
            )
            .where(
                MockAPI.owner_id == owner_id,
            )
        )

        return float(average_time or 0)

    def get_most_used_endpoints(
        self,
        db: Session,
        owner_id: int,
        limit: int = 5,
    ) -> list[dict]:
        rows = db.execute(
            select(
                RequestLog.method,
                RequestLog.path,
                func.count(RequestLog.id).label("request_count"),
            )
            .join(
                MockAPI,
                RequestLog.mock_api_id == MockAPI.id,
            )
            .where(
                MockAPI.owner_id == owner_id,
            )
            .group_by(
                RequestLog.method,
                RequestLog.path,
            )
            .order_by(
                func.count(RequestLog.id).desc(),
            )
            .limit(limit)
        ).all()

        return [
            {
                "method": row.method,
                "path": row.path,
                "request_count": row.request_count,
            }
            for row in rows
        ]