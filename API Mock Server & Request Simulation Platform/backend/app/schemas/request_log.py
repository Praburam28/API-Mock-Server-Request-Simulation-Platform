from datetime import datetime

from pydantic import BaseModel, ConfigDict


class RequestLogResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    mock_api_id: int
    api_version_id: int
    method: str
    path: str

    query_params: dict | None
    path_params: dict | None
    request_headers: dict | None
    request_body: dict | None

    response_status: int
    response_time_ms: int

    created_at: datetime
    updated_at: datetime


class RequestLogListResponse(BaseModel):
    items: list[RequestLogResponse]
    total: int
    page: int
    page_size: int
    total_pages: int