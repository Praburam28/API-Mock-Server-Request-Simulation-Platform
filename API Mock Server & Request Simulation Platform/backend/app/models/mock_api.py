from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base, TimestampMixin


if TYPE_CHECKING:
    from app.models.api_version import APIVersion
    from app.models.user import User


class MockAPI(Base, TimestampMixin):
    __tablename__ = "mock_apis"

    __table_args__ = (
        UniqueConstraint(
            "owner_id",
            "method",
            "path",
            name="uq_mock_api_owner_method_path",
        ),
    )

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    method: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
    )

    path: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    requires_auth: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    owner: Mapped["User"] = relationship(
        "User",
        back_populates="mock_apis",
    )

    versions: Mapped[list["APIVersion"]] = relationship(
        "APIVersion",
        back_populates="mock_api",
        cascade="all, delete-orphan",
    )

