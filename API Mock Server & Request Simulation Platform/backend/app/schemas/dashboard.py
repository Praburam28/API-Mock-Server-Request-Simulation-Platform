from pydantic import BaseModel


class MostUsedEndpointResponse(BaseModel):
    method: str
    path: str
    request_count: int


class DashboardResponse(BaseModel):
    total_mock_apis: int
    active_mock_apis: int
    total_requests: int
    error_requests: int
    average_response_time_ms: float
    most_used_endpoints: list[MostUsedEndpointResponse]