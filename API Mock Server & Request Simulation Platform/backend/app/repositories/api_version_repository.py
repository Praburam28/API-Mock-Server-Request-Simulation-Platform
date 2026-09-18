from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.api_version import APIVersion


class APIVersionRepository:

    def get_by_id(
        self,
        db: Session,
        version_id: int,
    ) -> APIVersion | None:
        return db.get(
            APIVersion,
            version_id,
        )

    def get_by_mock_api_and_id(
        self,
        db: Session,
        mock_api_id: int,
        version_id: int,
    ) -> APIVersion | None:
        return db.scalar(
            select(APIVersion).where(
                APIVersion.id == version_id,
                APIVersion.mock_api_id == mock_api_id,
            )
        )

    def get_by_mock_api_and_version(
        self,
        db: Session,
        mock_api_id: int,
        version: str,
    ) -> APIVersion | None:
        return db.scalar(
            select(APIVersion).where(
                APIVersion.mock_api_id == mock_api_id,
                APIVersion.version == version,
            )
        )

    def get_all_by_mock_api(
        self,
        db: Session,
        mock_api_id: int,
    ) -> list[APIVersion]:
        return list(
            db.scalars(
                select(APIVersion)
                .where(
                    APIVersion.mock_api_id == mock_api_id,
                )
                .order_by(APIVersion.id.desc())
            ).all()
        )
        
    
    def get_active_by_mock_api_id(
        self,
        db: Session,
        mock_api_id: int,
    ) -> APIVersion | None:
        return db.scalar(
            select(APIVersion)
            .where(
                APIVersion.mock_api_id == mock_api_id,
                APIVersion.is_active.is_(True),
            )
            .order_by(
                APIVersion.id.desc(),
            )
        )


    def create(
        self,
        db: Session,
        api_version: APIVersion,
    ) -> APIVersion:
        db.add(api_version)
        db.flush()
        db.refresh(api_version)

        return api_version

    def update(
        self,
        db: Session,
        api_version: APIVersion,
    ) -> APIVersion:
        db.flush()
        db.refresh(api_version)

        return api_version

    def delete(
        self,
        db: Session,
        api_version: APIVersion,
    ) -> None:
        db.delete(api_version)
        db.flush()