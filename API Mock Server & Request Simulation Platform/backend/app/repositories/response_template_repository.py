from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.response_template import ResponseTemplate


class ResponseTemplateRepository:

    def get_by_id(
        self,
        db: Session,
        response_template_id: int,
    ) -> ResponseTemplate | None:
        return db.get(
            ResponseTemplate,
            response_template_id,
        )

    def get_by_api_version_id(
        self,
        db: Session,
        api_version_id: int,
    ) -> ResponseTemplate | None:
        return db.scalar(
            select(ResponseTemplate).where(
                ResponseTemplate.api_version_id == api_version_id,
            )
        )

    def create(
        self,
        db: Session,
        response_template: ResponseTemplate,
    ) -> ResponseTemplate:
        db.add(response_template)
        db.flush()
        db.refresh(response_template)

        return response_template

    def update(
        self,
        db: Session,
        response_template: ResponseTemplate,
    ) -> ResponseTemplate:
        db.flush()
        db.refresh(response_template)

        return response_template

    def delete(
        self,
        db: Session,
        response_template: ResponseTemplate,
    ) -> None:
        db.delete(response_template)
        db.flush()