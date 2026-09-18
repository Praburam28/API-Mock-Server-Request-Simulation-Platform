from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.api_version import (
    APIVersionResponse,
    CreateAPIVersionRequest,
    UpdateAPIVersionRequest,
)
from app.services.api_version_service import APIVersionService


router = APIRouter(
    prefix="/mock-apis/{mock_api_id}/versions",
    tags=["API Versions"],
)

api_version_service = APIVersionService()


@router.post(
    "",
    response_model=APIVersionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_api_version(
    mock_api_id: int,
    data: CreateAPIVersionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        api_version = api_version_service.create(
            db=db,
            owner_id=current_user.id,
            mock_api_id=mock_api_id,
            version=data.version,
            description=data.description,
        )

        db.commit()
        db.refresh(api_version)

        return api_version

    except ValueError:
        db.rollback()
        raise


@router.get(
    "",
    response_model=list[APIVersionResponse],
)
def get_api_versions(
    mock_api_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return api_version_service.get_all(
        db=db,
        owner_id=current_user.id,
        mock_api_id=mock_api_id,
    )


@router.get(
    "/{version_id}",
    response_model=APIVersionResponse,
)
def get_api_version(
    mock_api_id: int,
    version_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return api_version_service.get_by_id(
        db=db,
        owner_id=current_user.id,
        mock_api_id=mock_api_id,
        version_id=version_id,
    )


@router.put(
    "/{version_id}",
    response_model=APIVersionResponse,
)
def update_api_version(
    mock_api_id: int,
    version_id: int,
    data: UpdateAPIVersionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        api_version = api_version_service.update(
            db=db,
            owner_id=current_user.id,
            mock_api_id=mock_api_id,
            version_id=version_id,
            version=data.version,
            description=data.description,
            is_active=data.is_active,
        )

        db.commit()
        db.refresh(api_version)

        return api_version

    except ValueError:
        db.rollback()
        raise


@router.delete(
    "/{version_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_api_version(
    mock_api_id: int,
    version_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        api_version_service.delete(
            db=db,
            owner_id=current_user.id,
            mock_api_id=mock_api_id,
            version_id=version_id,
        )

        db.commit()

    except ValueError:
        db.rollback()
        raise