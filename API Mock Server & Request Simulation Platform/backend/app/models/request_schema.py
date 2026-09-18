from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, JSON, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base, TimestampMixin


if TYPE_CHECKING:
    from app.models.api_version import APIVersion


class RequestSchema(Base, TimestampMixin):
    __tablename__ = "request_schemas"

    __table_args__ = (
        UniqueConstraint(
            "api_version_id",
            name="uq_request_schema_api_version",
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

    body_schema: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    query_schema: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    path_schema: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    header_schema: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    description: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    api_version: Mapped["APIVersion"] = relationship(
        "APIVersion",
        back_populates="request_schema",
    )