from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CreateResponseScenarioRequest(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=150,
    )

    scenario_type: str = Field(
        min_length=1,
        max_length=50,
    )

    response_body: dict | None = None

    response_headers: dict | None = None

    status_code: int = Field(
        default=200,
        ge=100,
        le=599,
    )

    delay_ms: int = Field(
        default=0,
        ge=0,
    )

    is_default: bool = False

    is_active: bool = True

    description: str | None = Field(
        default=None,
        max_length=500,
    )


class UpdateResponseScenarioRequest(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=150,
    )

    scenario_type: str | None = Field(
        default=None,
        min_length=1,
        max_length=50,
    )

    response_body: dict | None = None

    response_headers: dict | None = None

    status_code: int | None = Field(
        default=None,
        ge=100,
        le=599,
    )

    delay_ms: int | None = Field(
        default=None,
        ge=0,
    )

    is_default: bool | None = None

    is_active: bool | None = None

    description: str | None = Field(
        default=None,
        max_length=500,
    )


class ResponseScenarioResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int

    api_version_id: int

    name: str

    scenario_type: str

    response_body: dict | None

    response_headers: dict | None

    status_code: int

    delay_ms: int

    is_default: bool

    is_active: bool

    description: str | None

    created_at: datetime

    updated_at: datetime