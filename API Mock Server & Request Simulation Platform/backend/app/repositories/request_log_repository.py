from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.mock_api import MockAPI
from app.models.request_log import RequestLog


class RequestLogRepository:

    def get_by_id(
        self,
        db: Session,
        request_log_id: int,
    ) -> RequestLog | None:
        return db.get(
            RequestLog,
            request_log_id,
        )

    def get_all_by_mock_api_id(
        self,
        db: Session,
        mock_api_id: int,
    ) -> list[RequestLog]:
        return list(
            db.scalars(
                select(RequestLog)
                .where(
                    RequestLog.mock_api_id == mock_api_id,
                )
                .order_by(
                    RequestLog.id.desc(),
                )
            ).all()
        )

    def get_all_by_api_version_id(
        self,
        db: Session,
        api_version_id: int,
    ) -> list[RequestLog]:
        return list(
            db.scalars(
                select(RequestLog)
                .where(
                    RequestLog.api_version_id == api_version_id,
                )
                .order_by(
                    RequestLog.id.desc(),
                )
            ).all()
        )

    def create(
        self,
        db: Session,
        request_log: RequestLog,
    ) -> RequestLog:
        db.add(request_log)
        db.flush()
        db.refresh(request_log)
        return request_log

    def get_paginated(
        self,
        db: Session,
        owner_id: int,
        page: int,
        page_size: int,
        mock_api_id: int | None = None,
        method: str | None = None,
        response_status: int | None = None,
    ) -> tuple[list[RequestLog], int]:

        query = (
            select(RequestLog)
            .join(
                MockAPI,
                RequestLog.mock_api_id == MockAPI.id,
            )
            .where(
                MockAPI.owner_id == owner_id,
            )
        )

        count_query = (
            select(func.count(RequestLog.id))
            .join(
                MockAPI,
                RequestLog.mock_api_id == MockAPI.id,
            )
            .where(
                MockAPI.owner_id == owner_id,
            )
        )

        if mock_api_id is not None:
            query = query.where(
                RequestLog.mock_api_id == mock_api_id,
            )

            count_query = count_query.where(
                RequestLog.mock_api_id == mock_api_id,
            )

        if method is not None:
            query = query.where(
                RequestLog.method == method.upper(),
            )

            count_query = count_query.where(
                RequestLog.method == method.upper(),
            )

        if response_status is not None:
            query = query.where(
                RequestLog.response_status == response_status,
            )

            count_query = count_query.where(
                RequestLog.response_status == response_status,
            )

        query = (
            query
            .order_by(
                RequestLog.id.desc(),
            )
            .offset(
                (page - 1) * page_size,
            )
            .limit(
                page_size,
            )
        )

        logs = list(
            db.scalars(query).all()
        )

        total = db.scalar(count_query) or 0

        return logs, total