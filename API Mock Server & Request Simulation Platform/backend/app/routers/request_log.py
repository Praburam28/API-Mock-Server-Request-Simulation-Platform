from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.request_log import (
    RequestLogListResponse,
    RequestLogResponse,
)
from app.services.request_log_service import RequestLogService


router = APIRouter(
    prefix="/request-logs",
    tags=["Request History"],
)

request_log_service = RequestLogService()


@router.get(
    "",
    response_model=RequestLogListResponse,
)
def get_request_logs(
    page: int = Query(
        default=1,
        ge=1,
    ),
    page_size: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
    mock_api_id: int | None = Query(
        default=None,
        ge=1,
    ),
    method: str | None = Query(
        default=None,
        min_length=3,
        max_length=10,
    ),
    response_status: int | None = Query(
        default=None,
        ge=100,
        le=599,
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return request_log_service.get_history(
        db=db,
        owner_id=current_user.id,
        page=page,
        page_size=page_size,
        mock_api_id=mock_api_id,
        method=method,
        response_status=response_status,
    )


@router.get(
    "/{request_log_id}",
    response_model=RequestLogResponse,
)
def get_request_log(
    request_log_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return request_log_service.get_by_id(
        db=db,
        owner_id=current_user.id,
        request_log_id=request_log_id,
    )