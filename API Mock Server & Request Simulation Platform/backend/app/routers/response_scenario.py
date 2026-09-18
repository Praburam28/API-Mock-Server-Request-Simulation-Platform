from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.response_scenario import (
    CreateResponseScenarioRequest,
    ResponseScenarioResponse,
    UpdateResponseScenarioRequest,
)
from app.services.response_scenario_service import ResponseScenarioService


router = APIRouter(
    prefix="/mock-apis/{mock_api_id}/versions/{version_id}/response-scenarios",
    tags=["Response Scenarios"],
)

response_scenario_service = ResponseScenarioService()


@router.post(
    "",
    response_model=ResponseScenarioResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_response_scenario(
    mock_api_id: int,
    version_id: int,
    data: CreateResponseScenarioRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    response_scenario = response_scenario_service.create(
        db=db,
        owner_id=current_user.id,
        mock_api_id=mock_api_id,
        version_id=version_id,
        name=data.name,
        scenario_type=data.scenario_type,
        response_body=data.response_body,
        response_headers=data.response_headers,
        status_code=data.status_code,
        delay_ms=data.delay_ms,
        is_default=data.is_default,
        is_active=data.is_active,
        description=data.description,
    )

    db.commit()
    db.refresh(response_scenario)

    return response_scenario


@router.get(
    "",
    response_model=list[ResponseScenarioResponse],
)
def get_response_scenarios(
    mock_api_id: int,
    version_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return response_scenario_service.get_by_version(
        db=db,
        owner_id=current_user.id,
        mock_api_id=mock_api_id,
        version_id=version_id,
    )


@router.get(
    "/{scenario_id}",
    response_model=ResponseScenarioResponse,
)
def get_response_scenario(
    mock_api_id: int,
    version_id: int,
    scenario_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return response_scenario_service.get_by_id(
        db=db,
        owner_id=current_user.id,
        mock_api_id=mock_api_id,
        version_id=version_id,
        scenario_id=scenario_id,
    )


@router.put(
    "/{scenario_id}",
    response_model=ResponseScenarioResponse,
)
def update_response_scenario(
    mock_api_id: int,
    version_id: int,
    scenario_id: int,
    data: UpdateResponseScenarioRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    update_fields = set(
        data.model_dump(exclude_unset=True).keys()
    )

    response_scenario = response_scenario_service.update(
        db=db,
        owner_id=current_user.id,
        mock_api_id=mock_api_id,
        version_id=version_id,
        scenario_id=scenario_id,
        name=data.name,
        scenario_type=data.scenario_type,
        response_body=data.response_body,
        response_headers=data.response_headers,
        status_code=data.status_code,
        delay_ms=data.delay_ms,
        is_default=data.is_default,
        is_active=data.is_active,
        description=data.description,
        update_fields=update_fields,
    )

    db.commit()
    db.refresh(response_scenario)

    return response_scenario


@router.delete(
    "/{scenario_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_response_scenario(
    mock_api_id: int,
    version_id: int,
    scenario_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    response_scenario_service.delete(
        db=db,
        owner_id=current_user.id,
        mock_api_id=mock_api_id,
        version_id=version_id,
        scenario_id=scenario_id,
    )

    db.commit()

    return None