from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base, TimestampMixin


if TYPE_CHECKING:
    from app.models.api_version import APIVersion


class ResponseScenario(Base, TimestampMixin):
    __tablename__ = "response_scenarios"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    api_version_id: Mapped[int] = mapped_column(
        ForeignKey("api_versions.id"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    scenario_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )

    response_body: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    response_headers: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    status_code: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=200,
    )

    delay_ms: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    is_default: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    api_version: Mapped["APIVersion"] = relationship(
        "APIVersion",
        back_populates="response_scenarios",
    )