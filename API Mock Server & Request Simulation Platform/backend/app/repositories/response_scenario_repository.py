from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.response_scenario import ResponseScenario


class ResponseScenarioRepository:
    def get_by_id(
        self,
        db: Session,
        response_scenario_id: int,
    ) -> ResponseScenario | None:
        return db.get(ResponseScenario, response_scenario_id)

    def get_by_api_version_id(
        self,
        db: Session,
        api_version_id: int,
    ) -> list[ResponseScenario]:
        return list(
            db.scalars(
                select(ResponseScenario)
                .where(
                    ResponseScenario.api_version_id == api_version_id,
                )
                .order_by(
                    ResponseScenario.id,
                )
            ).all()
        )

    def get_active_by_api_version_id(
        self,
        db: Session,
        api_version_id: int,
    ) -> list[ResponseScenario]:
        return list(
            db.scalars(
                select(ResponseScenario)
                .where(
                    ResponseScenario.api_version_id == api_version_id,
                    ResponseScenario.is_active.is_(True),
                )
                .order_by(
                    ResponseScenario.id,
                )
            ).all()
        )

    def get_default_by_api_version_id(
        self,
        db: Session,
        api_version_id: int,
    ) -> ResponseScenario | None:
        return db.scalar(
            select(ResponseScenario).where(
                ResponseScenario.api_version_id == api_version_id,
                ResponseScenario.is_default.is_(True),
            )
        )

    def create(
        self,
        db: Session,
        response_scenario: ResponseScenario,
    ) -> ResponseScenario:
        db.add(response_scenario)
        db.flush()
        db.refresh(response_scenario)
        return response_scenario

    def update(
        self,
        db: Session,
        response_scenario: ResponseScenario,
    ) -> ResponseScenario:
        db.flush()
        db.refresh(response_scenario)
        return response_scenario

    def delete(
        self,
        db: Session,
        response_scenario: ResponseScenario,
    ) -> None:
        db.delete(response_scenario)
        db.flush()