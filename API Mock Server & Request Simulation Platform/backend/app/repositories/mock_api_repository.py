from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.mock_api import MockAPI


class MockAPIRepository:

    def get_by_id(
        self,
        db: Session,
        mock_api_id: int,
    ) -> MockAPI | None:
        return db.get(
            MockAPI,
            mock_api_id,
        )

    def get_by_owner_and_id(
        self,
        db: Session,
        owner_id: int,
        mock_api_id: int,
    ) -> MockAPI | None:
        return db.scalar(
            select(MockAPI).where(
                MockAPI.id == mock_api_id,
                MockAPI.owner_id == owner_id,
            )
        )

    def get_by_owner_method_path(
        self,
        db: Session,
        owner_id: int,
        method: str,
        path: str,
    ) -> MockAPI | None:
        return db.scalar(
            select(MockAPI).where(
                MockAPI.owner_id == owner_id,
                MockAPI.method == method,
                MockAPI.path == path,
            )
        )

    def get_active_by_method(
        self,
        db: Session,
        method: str,
    ) -> list[MockAPI]:
        return list(
            db.scalars(
                select(MockAPI)
                .where(
                    MockAPI.method == method,
                    MockAPI.is_active.is_(True),
                )
                .order_by(
                    MockAPI.id,
                )
            ).all()
        )

    def get_all_by_owner(
        self,
        db: Session,
        owner_id: int,
    ) -> list[MockAPI]:
        return list(
            db.scalars(
                select(MockAPI)
                .where(
                    MockAPI.owner_id == owner_id,
                )
                .order_by(
                    MockAPI.id.desc(),
                )
            ).all()
        )

    def create(
        self,
        db: Session,
        mock_api: MockAPI,
    ) -> MockAPI:
        db.add(mock_api)
        db.flush()
        db.refresh(mock_api)
        return mock_api

    def update(
        self,
        db: Session,
        mock_api: MockAPI,
    ) -> MockAPI:
        db.flush()
        db.refresh(mock_api)
        return mock_api

    def delete(
        self,
        db: Session,
        mock_api: MockAPI,
    ) -> None:
        db.delete(mock_api)
        db.flush()
