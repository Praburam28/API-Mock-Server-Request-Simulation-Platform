from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, JSON, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base, TimestampMixin


if TYPE_CHECKING:
    from app.models.api_version import APIVersion


class ResponseTemplate(Base, TimestampMixin):
    __tablename__ = "response_templates"

    __table_args__ = (
        UniqueConstraint(
            "api_version_id",
            name="uq_response_template_api_version",
        ),
    )

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    api_version_id: Mapped[int] = mapped_column(
        ForeignKey("api_versions.id"),
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

    description: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    api_version: Mapped["APIVersion"] = relationship(
        "APIVersion",
        back_populates="response_template",
    )