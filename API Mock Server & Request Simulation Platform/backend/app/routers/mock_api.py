from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user, require_admin
from app.models.user import User
from app.schemas.mock_api import (
    CreateMockAPIRequest,
    MockAPIResponse,
    UpdateMockAPIRequest,
)
from app.services.mock_api_service import MockAPIService


router = APIRouter(
    prefix="/mock-apis",
    tags=["Mock APIs"],
)

mock_api_service = MockAPIService()


@router.post(
    "",
    response_model=MockAPIResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_mock_api(
    data: CreateMockAPIRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        mock_api = mock_api_service.create(
            db=db,
            owner_id=current_user.id,
            data=data,
        )

        db.commit()
        db.refresh(mock_api)

        return mock_api

    except ValueError:
        db.rollback()
        raise


@router.get(
    "",
    response_model=list[MockAPIResponse],
)
def get_mock_apis(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return mock_api_service.get_all(
        db=db,
        owner_id=current_user.id,
    )


@router.get(
    "/{mock_api_id}",
    response_model=MockAPIResponse,
)
def get_mock_api(
    mock_api_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return mock_api_service.get_by_id(
        db=db,
        owner_id=current_user.id,
        mock_api_id=mock_api_id,
    )


@router.put(
    "/{mock_api_id}",
    response_model=MockAPIResponse,
)
def update_mock_api(
    mock_api_id: int,
    data: UpdateMockAPIRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        mock_api = mock_api_service.update(
            db=db,
            owner_id=current_user.id,
            mock_api_id=mock_api_id,
            data=data,
        )

        db.commit()
        db.refresh(mock_api)

        return mock_api

    except ValueError:
        db.rollback()
        raise


@router.delete(
    "/{mock_api_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_mock_api(
    mock_api_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    try:
        mock_api_service.delete(
            db=db,
            owner_id=current_user.id,
            mock_api_id=mock_api_id,
        )

        db.commit()

    except ValueError:
        db.rollback()
        raise