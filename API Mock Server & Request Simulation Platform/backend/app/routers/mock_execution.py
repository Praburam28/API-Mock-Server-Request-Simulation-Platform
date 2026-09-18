from fastapi import APIRouter, Body, Depends, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.mock_execution_service import MockExecutionService


router = APIRouter(
    prefix="/mock",
    tags=["Mock Execution"],
)

mock_execution_service = MockExecutionService()


async def _execute_mock_api(
    full_path: str,
    request: Request,
    db: Session,
    body: dict | None = None,
):
    """
    Common execution logic used by all HTTP method routes.
    """

    # Remove leading/trailing whitespace and leading slash.
    clean_path = full_path.strip()
    clean_path = clean_path.lstrip("/")

    # The router already has /mock as its prefix.
    #
    # Support:
    #   users
    #   private/users
    #   /mock/users
    #   /mock/private/users

    if clean_path == "mock":
        incoming_path = "/mock"

    elif clean_path.startswith("mock/"):
        incoming_path = f"/{clean_path}"

    else:
        incoming_path = f"/mock/{clean_path}"

    print(
        f"MOCK EXECUTION DEBUG | "
        f"method={request.method} | "
        f"full_path={full_path!r} | "
        f"incoming_path={incoming_path!r}"
    )

    # For GET requests, there is normally no request body.
    #
    # For POST/PUT/PATCH/DELETE, the body is supplied by
    # the FastAPI endpoint when available.
    #
    # This keeps the body dynamic because mock APIs can
    # have completely different request schemas.

    query_params = dict(request.query_params)
    headers = dict(request.headers)

    scenario, execution_data = await mock_execution_service.execute(
        db=db,
        method=request.method,
        path=incoming_path,
        query_params=query_params,
        headers=headers,
        body=body,
    )

    print(
        f"MOCK EXECUTION DEBUG | "
        f"execution_data={execution_data}"
    )

    response_headers = (
        scenario.response_headers
        if scenario.response_headers
        else {}
    )

    response_body = (
        scenario.response_body
        if scenario.response_body is not None
        else {}
    )

    return JSONResponse(
        content=response_body,
        status_code=scenario.status_code,
        headers=response_headers,
    )


@router.get(
    "/{full_path:path}",
    operation_id="execute_mock_api_get",
)
async def execute_mock_api_get(
    full_path: str,
    request: Request,
    db: Session = Depends(get_db),
):
    return await _execute_mock_api(
        full_path=full_path,
        request=request,
        db=db,
    )


@router.post(
    "/{full_path:path}",
    operation_id="execute_mock_api_post",
)
async def execute_mock_api_post(
    full_path: str,
    request: Request,
    body: dict | None = Body(default=None),
    db: Session = Depends(get_db),
):
    return await _execute_mock_api(
        full_path=full_path,
        request=request,
        db=db,
        body=body,
    )


@router.put(
    "/{full_path:path}",
    operation_id="execute_mock_api_put",
)
async def execute_mock_api_put(
    full_path: str,
    request: Request,
    body: dict | None = Body(default=None),
    db: Session = Depends(get_db),
):
    return await _execute_mock_api(
        full_path=full_path,
        request=request,
        db=db,
        body=body,
    )


@router.patch(
    "/{full_path:path}",
    operation_id="execute_mock_api_patch",
)
async def execute_mock_api_patch(
    full_path: str,
    request: Request,
    body: dict | None = Body(default=None),
    db: Session = Depends(get_db),
):
    return await _execute_mock_api(
        full_path=full_path,
        request=request,
        db=db,
        body=body,
    )


@router.delete(
    "/{full_path:path}",
    operation_id="execute_mock_api_delete",
)
async def execute_mock_api_delete(
    full_path: str,
    request: Request,
    db: Session = Depends(get_db),
):
    return await _execute_mock_api(
        full_path=full_path,
        request=request,
        db=db,
    )
