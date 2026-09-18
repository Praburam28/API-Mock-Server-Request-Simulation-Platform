from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.request_schema import (
    CreateRequestSchemaRequest,
    RequestSchemaResponse,
    UpdateRequestSchemaRequest,
)
from app.services.request_schema_service import (
    RequestSchemaService,
)
from app.core.exceptions import NotFoundException



router = APIRouter(
    prefix="/mock-apis/{mock_api_id}/versions/{version_id}/request-schema",
    tags=["Request Schemas"],
)

request_schema_service = RequestSchemaService()


@router.post(
    "",
    response_model=RequestSchemaResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_request_schema(
    mock_api_id: int,
    version_id: int,
    data: CreateRequestSchemaRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        request_schema = request_schema_service.create(
            db=db,
            owner_id=current_user.id,
            mock_api_id=mock_api_id,
            version_id=version_id,
            body_schema=data.body_schema,
            query_schema=data.query_schema,
            path_schema=data.path_schema,
            header_schema=data.header_schema,
            description=data.description,
        )

        db.commit()
        db.refresh(request_schema)

        return request_schema

    except ValueError:
        db.rollback()
        raise


@router.get(
    "",
    response_model=RequestSchemaResponse,
)
def get_request_schema(
    mock_api_id: int,
    version_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    request_schema = request_schema_service.get_by_version(
        db=db,
        owner_id=current_user.id,
        mock_api_id=mock_api_id,
        version_id=version_id,
    )

    if request_schema is None:
        
        raise NotFoundException(
            "Request schema not found"
        )

    return request_schema


@router.put(
    "",
    response_model=RequestSchemaResponse,
)
def update_request_schema(
    mock_api_id: int,
    version_id: int,
    data: UpdateRequestSchemaRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        request_schema = request_schema_service.update(
            db=db,
            owner_id=current_user.id,
            mock_api_id=mock_api_id,
            version_id=version_id,
            body_schema=data.body_schema,
            query_schema=data.query_schema,
            path_schema=data.path_schema,
            header_schema=data.header_schema,
            description=data.description,
            update_fields=set(
                data.model_dump(
                    exclude_unset=True,
                ).keys()
            ),
        )

        db.commit()
        db.refresh(request_schema)

        return request_schema

    except ValueError:
        db.rollback()
        raise


@router.delete(
    "",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_request_schema(
    mock_api_id: int,
    version_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        request_schema_service.delete(
            db=db,
            owner_id=current_user.id,
            mock_api_id=mock_api_id,
            version_id=version_id,
        )

        db.commit()

    except ValueError:
        db.rollback()
        raise