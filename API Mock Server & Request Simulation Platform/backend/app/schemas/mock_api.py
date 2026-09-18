from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CreateMockAPIRequest(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=150,
    )

    method: str = Field(
        min_length=3,
        max_length=10,
    )

    path: str = Field(
        min_length=1,
        max_length=255,
    )

    description: str | None = Field(
        default=None,
        max_length=1000,
    )

    requires_auth: bool = False


class UpdateMockAPIRequest(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    method: str | None = Field(
        default=None,
        min_length=3,
        max_length=10,
    )

    path: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    description: str | None = Field(
        default=None,
        max_length=1000,
    )

    is_active: bool | None = None

    requires_auth: bool | None = None


class MockAPIResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    name: str
    method: str
    path: str
    description: str | None
    is_active: bool
    requires_auth: bool
    owner_id: int
    created_at: datetime
    updated_at: datetime
