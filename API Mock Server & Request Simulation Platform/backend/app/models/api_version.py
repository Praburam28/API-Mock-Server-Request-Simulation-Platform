from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base, TimestampMixin


if TYPE_CHECKING:
    from app.models.request_schema import RequestSchema
    from app.models.response_template import ResponseTemplate
    from app.models.response_scenario import ResponseScenario
    from app.models.mock_api import MockAPI


class APIVersion(Base, TimestampMixin):
    __tablename__ = "api_versions"

    __table_args__ = (
        UniqueConstraint(
            "mock_api_id",
            "version",
            name="uq_api_version_mock_api_version",
        ),
    )

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    mock_api_id: Mapped[int] = mapped_column(
        ForeignKey("mock_apis.id"),
        nullable=False,
        index=True,
    )

    version: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    mock_api: Mapped["MockAPI"] = relationship(
        "MockAPI",
        back_populates="versions",
    )
    
    request_schema: Mapped["RequestSchema | None"] = relationship(
        "RequestSchema",
        back_populates="api_version",
        uselist=False,
        cascade="all, delete-orphan",
    )
    
    response_template: Mapped["ResponseTemplate | None"] = relationship(
        "ResponseTemplate",
        back_populates="api_version",
        uselist=False,
        cascade="all, delete-orphan",
    )
    
    response_scenarios: Mapped[list["ResponseScenario"]] = relationship(
        "ResponseScenario",
        back_populates="api_version",
        cascade="all, delete-orphan",
    )