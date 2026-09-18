from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CreateAPIVersionRequest(BaseModel):
    version: str = Field(
        min_length=2,
        max_length=20,
    )

    description: str | None = Field(
        default=None,
        max_length=500,
    )


class UpdateAPIVersionRequest(BaseModel):
    version: str | None = Field(
        default=None,
        min_length=2,
        max_length=20,
    )

    description: str | None = Field(
        default=None,
        max_length=500,
    )

    is_active: bool | None = None


class APIVersionResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    mock_api_id: int
    version: str
    description: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime