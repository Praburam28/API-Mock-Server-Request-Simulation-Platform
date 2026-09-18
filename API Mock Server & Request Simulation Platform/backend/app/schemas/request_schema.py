from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CreateRequestSchemaRequest(BaseModel):
    body_schema: dict | None = None

    query_schema: dict | None = None

    path_schema: dict | None = None

    header_schema: dict | None = None

    description: str | None = Field(
        default=None,
        max_length=500,
    )


class UpdateRequestSchemaRequest(BaseModel):
    body_schema: dict | None = None

    query_schema: dict | None = None

    path_schema: dict | None = None

    header_schema: dict | None = None

    description: str | None = Field(
        default=None,
        max_length=500,
    )


class RequestSchemaResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    api_version_id: int

    body_schema: dict | None
    query_schema: dict | None
    path_schema: dict | None
    header_schema: dict | None

    description: str | None

    created_at: datetime
    updated_at: datetime