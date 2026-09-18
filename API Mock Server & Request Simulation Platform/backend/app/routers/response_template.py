from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.response_template import (
    CreateResponseTemplateRequest,
    ResponseTemplateResponse,
    UpdateResponseTemplateRequest,
)
from app.services.response_template_service import ResponseTemplateService


router = APIRouter(
    prefix="/mock-apis/{mock_api_id}/versions/{version_id}/response-template",
    tags=["Response Templates"],
)

response_template_service = ResponseTemplateService()


@router.post(
    "",
    response_model=ResponseTemplateResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_response_template(
    mock_api_id: int,
    version_id: int,
    data: CreateResponseTemplateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    response_template = response_template_service.create(
        db=db,
        owner_id=current_user.id,
        mock_api_id=mock_api_id,
        version_id=version_id,
        response_body=data.response_body,
        response_headers=data.response_headers,
        status_code=data.status_code,
        description=data.description,
    )

    db.commit()
    db.refresh(response_template)

    return response_template


@router.get(
    "",
    response_model=ResponseTemplateResponse,
)
def get_response_template(
    mock_api_id: int,
    version_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    response_template = response_template_service.get_by_version(
        db=db,
        owner_id=current_user.id,
        mock_api_id=mock_api_id,
        version_id=version_id,
    )

    if response_template is None:
        raise NotFoundException("Response template not found")

    return response_template


@router.put(
    "",
    response_model=ResponseTemplateResponse,
)
def update_response_template(
    mock_api_id: int,
    version_id: int,
    data: UpdateResponseTemplateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    update_fields = set(
        data.model_dump(exclude_unset=True).keys()
    )

    response_template = response_template_service.update(
        db=db,
        owner_id=current_user.id,
        mock_api_id=mock_api_id,
        version_id=version_id,
        response_body=data.response_body,
        response_headers=data.response_headers,
        status_code=data.status_code,
        description=data.description,
        update_fields=update_fields,
    )

    db.commit()
    db.refresh(response_template)

    return response_template


@router.delete(
    "",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_response_template(
    mock_api_id: int,
    version_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    response_template_service.delete(
        db=db,
        owner_id=current_user.id,
        mock_api_id=mock_api_id,
        version_id=version_id,
    )

    db.commit()

    return None