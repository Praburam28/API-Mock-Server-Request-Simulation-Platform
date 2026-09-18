from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.request_schema import RequestSchema


class RequestSchemaRepository:

    def get_by_id(
        self,
        db: Session,
        request_schema_id: int,
    ) -> RequestSchema | None:
        return db.get(
            RequestSchema,
            request_schema_id,
        )

    def get_by_api_version_id(
        self,
        db: Session,
        api_version_id: int,
    ) -> RequestSchema | None:
        return db.scalar(
            select(RequestSchema).where(
                RequestSchema.api_version_id == api_version_id,
            )
        )

    def create(
        self,
        db: Session,
        request_schema: RequestSchema,
    ) -> RequestSchema:
        db.add(request_schema)
        db.flush()
        db.refresh(request_schema)

        return request_schema

    def update(
        self,
        db: Session,
        request_schema: RequestSchema,
    ) -> RequestSchema:
        db.flush()
        db.refresh(request_schema)

        return request_schema

    def delete(
        self,
        db: Session,
        request_schema: RequestSchema,
    ) -> None:
        db.delete(request_schema)
        db.flush()