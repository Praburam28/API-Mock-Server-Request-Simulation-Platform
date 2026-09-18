from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base, TimestampMixin


if TYPE_CHECKING:
    from app.models.api_version import APIVersion
    from app.models.mock_api import MockAPI


class RequestLog(Base, TimestampMixin):
    __tablename__ = "request_logs"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    mock_api_id: Mapped[int] = mapped_column(
        ForeignKey("mock_apis.id"),
        nullable=True,
        index=True,
    )

    api_version_id: Mapped[int] = mapped_column(
        ForeignKey("api_versions.id"),
        nullable=True,
        index=True,
    )

    method: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
    )

    path: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    query_params: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    path_params: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    request_headers: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    request_body: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    response_status: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    response_time_ms: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    mock_api: Mapped["MockAPI"] = relationship(
        "MockAPI",
    )

    api_version: Mapped["APIVersion"] = relationship(
        "APIVersion",
    )