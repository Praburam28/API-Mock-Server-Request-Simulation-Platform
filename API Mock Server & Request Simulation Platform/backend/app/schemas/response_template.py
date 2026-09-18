from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CreateResponseTemplateRequest(BaseModel):
    response_body: dict | None = None

    response_headers: dict | None = None

    status_code: int = Field(
        default=200,
        ge=100,
        le=599,
    )

    description: str | None = Field(
        default=None,
        max_length=500,
    )


class UpdateResponseTemplateRequest(BaseModel):
    response_body: dict | None = None

    response_headers: dict | None = None

    status_code: int | None = Field(
        default=None,
        ge=100,
        le=599,
    )

    description: str | None = Field(
        default=None,
        max_length=500,
    )


class ResponseTemplateResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    api_version_id: int

    response_body: dict | None
    response_headers: dict | None

    status_code: int

    description: str | None

    created_at: datetime
    updated_at: datetime