import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.core.exceptions import BadRequestException, NotFoundException
from app.services.mock_execution_service import MockExecutionService


# ============================================================
# FIXTURES
# ============================================================


@pytest.fixture
def service():
    return MockExecutionService()


@pytest.fixture
def db():
    return MagicMock()


@pytest.fixture
def mock_api():
    return SimpleNamespace(
        id=1,
        method="GET",
        path="/mock/products/{id}",
        is_active=True,
        requires_auth=False,
        owner_id=1,
    )


@pytest.fixture
def api_version():
    return SimpleNamespace(
        id=10,
        version="v1",
        is_active=True,
    )


@pytest.fixture
def success_scenario():
    return SimpleNamespace(
        id=100,
        api_version_id=10,
        name="Product Success",
        scenario_type="SUCCESS",
        response_body={
            "message": "Product found",
            "product": {
                "id": 3,
                "name": "Laptop",
            },
        },
        response_headers={
            "Content-Type": "application/json",
        },
        status_code=200,
        delay_ms=0,
        is_default=True,
        is_active=True,
    )


@pytest.fixture
def request_schema():
    return SimpleNamespace(
        id=20,
        api_version_id=10,
        body_schema={},
        query_schema={},
        path_schema={
            "id": {
                "type": "integer",
            }
        },
        header_schema={},
    )


# ============================================================
# SUCCESSFUL EXECUTION
# ============================================================


@pytest.mark.asyncio
async def test_execute_success(
    service,
    db,
    mock_api,
    api_version,
    request_schema,
    success_scenario,
):
    service._find_mock_api = MagicMock(
        return_value=(
            mock_api,
            {"id": "3"},
        )
    )

    service.api_version_repository.get_active_by_mock_api_id = MagicMock(
        return_value=api_version
    )

    service.request_schema_repository.get_by_api_version_id = MagicMock(
        return_value=request_schema
    )

    service.response_scenario_repository.get_default_by_api_version_id = (
        MagicMock(
            return_value=success_scenario
        )
    )

    service._create_request_log = MagicMock()

    scenario, execution_data = await service.execute(
        db=db,
        method="GET",
        path="/mock/products/3",
        query_params={},
        headers={},
        body=None,
    )

    assert scenario == success_scenario

    assert execution_data == {
        "mock_api_id": 1,
        "api_version_id": 10,
        "path_parameters": {
            "id": "3",
        },
    }

    service._find_mock_api.assert_called_once()

    service.api_version_repository.get_active_by_mock_api_id.assert_called_once_with(
        db,
        1,
    )

    service.request_schema_repository.get_by_api_version_id.assert_called_once_with(
        db,
        10,
    )

    service.response_scenario_repository.get_default_by_api_version_id.assert_called_once_with(
        db,
        10,
    )

    service._create_request_log.assert_called_once()


# ============================================================
# POST EXECUTION
# ============================================================


@pytest.mark.asyncio
async def test_execute_post_request(
    service,
    db,
    mock_api,
    api_version,
    success_scenario,
):
    mock_api.method = "POST"
    mock_api.path = "/mock/products"

    service._find_mock_api = MagicMock(
        return_value=(
            mock_api,
            {},
        )
    )

    service.api_version_repository.get_active_by_mock_api_id = MagicMock(
        return_value=api_version
    )

    service.request_schema_repository.get_by_api_version_id = MagicMock(
        return_value=None
    )

    service.response_scenario_repository.get_default_by_api_version_id = (
        MagicMock(
            return_value=success_scenario
        )
    )

    service._create_request_log = MagicMock()

    body = {
        "name": "Laptop",
        "price": 55000,
    }

    scenario, execution_data = await service.execute(
        db=db,
        method="POST",
        path="/mock/products",
        query_params={},
        headers={
            "content-type": "application/json",
        },
        body=body,
    )

    assert scenario == success_scenario
    assert execution_data["mock_api_id"] == 1
    assert execution_data["api_version_id"] == 10

    service._create_request_log.assert_called_once()


# ============================================================
# PUT EXECUTION
# ============================================================


@pytest.mark.asyncio
async def test_execute_put_request(
    service,
    db,
    mock_api,
    api_version,
    success_scenario,
):
    mock_api.method = "PUT"
    mock_api.path = "/mock/products/{id}"

    service._find_mock_api = MagicMock(
        return_value=(
            mock_api,
            {"id": "3"},
        )
    )

    service.api_version_repository.get_active_by_mock_api_id = MagicMock(
        return_value=api_version
    )

    service.request_schema_repository.get_by_api_version_id = MagicMock(
        return_value=None
    )

    service.response_scenario_repository.get_default_by_api_version_id = (
        MagicMock(
            return_value=success_scenario
        )
    )

    service._create_request_log = MagicMock()

    body = {
        "name": "Updated Laptop",
        "price": 55000,
        "stock": 25,
        "category": "Electronics",
    }

    scenario, execution_data = await service.execute(
        db=db,
        method="PUT",
        path="/mock/products/3",
        query_params={},
        headers={},
        body=body,
    )

    assert scenario == success_scenario
    assert execution_data["path_parameters"] == {
        "id": "3",
    }


# ============================================================
# PATCH EXECUTION
# ============================================================


@pytest.mark.asyncio
async def test_execute_patch_request(
    service,
    db,
    mock_api,
    api_version,
    success_scenario,
):
    mock_api.method = "PATCH"
    mock_api.path = "/mock/products/{id}"

    service._find_mock_api = MagicMock(
        return_value=(
            mock_api,
            {"id": "3"},
        )
    )

    service.api_version_repository.get_active_by_mock_api_id = MagicMock(
        return_value=api_version
    )

    service.request_schema_repository.get_by_api_version_id = MagicMock(
        return_value=None
    )

    service.response_scenario_repository.get_default_by_api_version_id = (
        MagicMock(
            return_value=success_scenario
        )
    )

    service._create_request_log = MagicMock()

    body = {
        "price": 60000,
    }

    scenario, execution_data = await service.execute(
        db=db,
        method="PATCH",
        path="/mock/products/3",
        query_params={},
        headers={},
        body=body,
    )

    assert scenario == success_scenario
    assert execution_data["path_parameters"] == {
        "id": "3",
    }


# ============================================================
# DELETE EXECUTION
# ============================================================


@pytest.mark.asyncio
async def test_execute_delete_request(
    service,
    db,
    mock_api,
    api_version,
    success_scenario,
):
    mock_api.method = "DELETE"
    mock_api.path = "/mock/products/{id}"

    service._find_mock_api = MagicMock(
        return_value=(
            mock_api,
            {"id": "3"},
        )
    )

    service.api_version_repository.get_active_by_mock_api_id = MagicMock(
        return_value=api_version
    )

    service.request_schema_repository.get_by_api_version_id = MagicMock(
        return_value=None
    )

    service.response_scenario_repository.get_default_by_api_version_id = (
        MagicMock(
            return_value=success_scenario
        )
    )

    service._create_request_log = MagicMock()

    scenario, execution_data = await service.execute(
        db=db,
        method="DELETE",
        path="/mock/products/3",
        query_params={},
        headers={},
        body=None,
    )

    assert scenario == success_scenario
    assert execution_data["path_parameters"] == {
        "id": "3",
    }


# ============================================================
# MOCK API NOT FOUND
# ============================================================


@pytest.mark.asyncio
async def test_execute_mock_api_not_found(
    service,
    db,
):
    service._find_mock_api = MagicMock(
        side_effect=NotFoundException(
            "Mock API endpoint not found"
        )
    )

    service._create_request_log = MagicMock()

    with pytest.raises(NotFoundException):
        await service.execute(
            db=db,
            method="GET",
            path="/mock/unknown",
            query_params={},
            headers={},
            body=None,
        )

    service._create_request_log.assert_called_once()

    call_args = service._create_request_log.call_args.kwargs

    assert call_args["mock_api_id"] is None
    assert call_args["api_version_id"] is None
    assert call_args["response_status"] == 404


# ============================================================
# NO ACTIVE API VERSION
# ============================================================


@pytest.mark.asyncio
async def test_execute_no_active_api_version(
    service,
    db,
    mock_api,
):
    service._find_mock_api = MagicMock(
        return_value=(
            mock_api,
            {"id": "3"},
        )
    )

    service.api_version_repository.get_active_by_mock_api_id = MagicMock(
        return_value=None
    )

    service._create_request_log = MagicMock()

    with pytest.raises(NotFoundException):
        await service.execute(
            db=db,
            method="GET",
            path="/mock/products/3",
            query_params={},
            headers={},
            body=None,
        )

    service._create_request_log.assert_called_once()

    call_args = service._create_request_log.call_args.kwargs

    assert call_args["mock_api_id"] == 1
    assert call_args["api_version_id"] is None
    assert call_args["response_status"] == 404


# ============================================================
# REQUEST SCHEMA VALIDATION
# ============================================================


@pytest.mark.asyncio
async def test_execute_invalid_path_parameter(
    service,
    db,
    mock_api,
    api_version,
    request_schema,
):
    service._find_mock_api = MagicMock(
        return_value=(
            mock_api,
            {"id": "abc"},
        )
    )

    service.api_version_repository.get_active_by_mock_api_id = MagicMock(
        return_value=api_version
    )

    service.request_schema_repository.get_by_api_version_id = MagicMock(
        return_value=request_schema
    )

    service._create_request_log = MagicMock()

    with pytest.raises(BadRequestException):
        await service.execute(
            db=db,
            method="GET",
            path="/mock/products/abc",
            query_params={},
            headers={},
            body=None,
        )

    service._create_request_log.assert_called_once()

    call_args = service._create_request_log.call_args.kwargs

    assert call_args["response_status"] == 400
    assert call_args["mock_api_id"] == 1
    assert call_args["api_version_id"] == 10


@pytest.mark.asyncio
async def test_execute_missing_required_query_parameter(
    service,
    db,
    mock_api,
    api_version,
    success_scenario,
):
    query_schema = {
        "page": {
            "type": "integer",
        }
    }

    request_schema = SimpleNamespace(
        id=20,
        api_version_id=10,
        body_schema={},
        query_schema=query_schema,
        path_schema={},
        header_schema={},
    )

    service._find_mock_api = MagicMock(
        return_value=(
            mock_api,
            {},
        )
    )

    service.api_version_repository.get_active_by_mock_api_id = MagicMock(
        return_value=api_version
    )

    service.request_schema_repository.get_by_api_version_id = MagicMock(
        return_value=request_schema
    )

    service._create_request_log = MagicMock()

    with pytest.raises(BadRequestException):
        await service.execute(
            db=db,
            method="GET",
            path="/mock/products",
            query_params={},
            headers={},
            body=None,
        )

    service._create_request_log.assert_called_once()

    call_args = service._create_request_log.call_args.kwargs

    assert call_args["response_status"] == 400


@pytest.mark.asyncio
async def test_execute_invalid_query_parameter(
    service,
    db,
    mock_api,
    api_version,
):
    request_schema = SimpleNamespace(
        id=20,
        api_version_id=10,
        body_schema={},
        query_schema={
            "page": {
                "type": "integer",
            }
        },
        path_schema={},
        header_schema={},
    )

    service._find_mock_api = MagicMock(
        return_value=(
            mock_api,
            {},
        )
    )

    service.api_version_repository.get_active_by_mock_api_id = MagicMock(
        return_value=api_version
    )

    service.request_schema_repository.get_by_api_version_id = MagicMock(
        return_value=request_schema
    )

    service._create_request_log = MagicMock()

    with pytest.raises(BadRequestException):
        await service.execute(
            db=db,
            method="GET",
            path="/mock/products",
            query_params={
                "page": "abc",
            },
            headers={},
            body=None,
        )

    call_args = service._create_request_log.call_args.kwargs

    assert call_args["response_status"] == 400


# ============================================================
# BODY VALIDATION
# ============================================================


@pytest.mark.asyncio
async def test_execute_missing_required_body_field(
    service,
    db,
    mock_api,
    api_version,
):
    mock_api.method = "POST"
    mock_api.path = "/mock/products"

    request_schema = SimpleNamespace(
        id=20,
        api_version_id=10,
        body_schema={
            "type": "object",
            "required": [
                "name",
                "price",
            ],
            "properties": {
                "name": {
                    "type": "string",
                },
                "price": {
                    "type": "number",
                },
            },
        },
        query_schema={},
        path_schema={},
        header_schema={},
    )

    service._find_mock_api = MagicMock(
        return_value=(
            mock_api,
            {},
        )
    )

    service.api_version_repository.get_active_by_mock_api_id = MagicMock(
        return_value=api_version
    )

    service.request_schema_repository.get_by_api_version_id = MagicMock(
        return_value=request_schema
    )

    service._create_request_log = MagicMock()

    with pytest.raises(BadRequestException):
        await service.execute(
            db=db,
            method="POST",
            path="/mock/products",
            query_params={},
            headers={},
            body={
                "name": "Laptop",
            },
        )

    call_args = service._create_request_log.call_args.kwargs

    assert call_args["response_status"] == 400


@pytest.mark.asyncio
async def test_execute_invalid_body_field_type(
    service,
    db,
    mock_api,
    api_version,
):
    mock_api.method = "POST"
    mock_api.path = "/mock/products"

    request_schema = SimpleNamespace(
        id=20,
        api_version_id=10,
        body_schema={
            "type": "object",
            "required": [
                "price",
            ],
            "properties": {
                "price": {
                    "type": "number",
                },
            },
        },
        query_schema={},
        path_schema={},
        header_schema={},
    )

    service._find_mock_api = MagicMock(
        return_value=(
            mock_api,
            {},
        )
    )

    service.api_version_repository.get_active_by_mock_api_id = MagicMock(
        return_value=api_version
    )

    service.request_schema_repository.get_by_api_version_id = MagicMock(
        return_value=request_schema
    )

    service._create_request_log = MagicMock()

    with pytest.raises(BadRequestException):
        await service.execute(
            db=db,
            method="POST",
            path="/mock/products",
            query_params={},
            headers={},
            body={
                "price": "55000",
            },
        )

    call_args = service._create_request_log.call_args.kwargs

    assert call_args["response_status"] == 400


# ============================================================
# HEADER VALIDATION
# ============================================================


@pytest.mark.asyncio
async def test_execute_missing_required_header(
    service,
    db,
    mock_api,
    api_version,
):
    request_schema = SimpleNamespace(
        id=20,
        api_version_id=10,
        body_schema={},
        query_schema={},
        path_schema={},
        header_schema={
            "X-Request-Id": {
                "type": "integer",
            }
        },
    )

    service._find_mock_api = MagicMock(
        return_value=(
            mock_api,
            {},
        )
    )

    service.api_version_repository.get_active_by_mock_api_id = MagicMock(
        return_value=api_version
    )

    service.request_schema_repository.get_by_api_version_id = MagicMock(
        return_value=request_schema
    )

    service._create_request_log = MagicMock()

    with pytest.raises(BadRequestException):
        await service.execute(
            db=db,
            method="GET",
            path="/mock/products",
            query_params={},
            headers={},
            body=None,
        )

    call_args = service._create_request_log.call_args.kwargs

    assert call_args["response_status"] == 400


# ============================================================
# NO DEFAULT RESPONSE SCENARIO
# ============================================================


@pytest.mark.asyncio
async def test_execute_no_default_response_scenario(
    service,
    db,
    mock_api,
    api_version,
):
    service._find_mock_api = MagicMock(
        return_value=(
            mock_api,
            {"id": "3"},
        )
    )

    service.api_version_repository.get_active_by_mock_api_id = MagicMock(
        return_value=api_version
    )

    service.request_schema_repository.get_by_api_version_id = MagicMock(
        return_value=None
    )

    service.response_scenario_repository.get_default_by_api_version_id = (
        MagicMock(
            return_value=None
        )
    )

    service._create_request_log = MagicMock()

    with pytest.raises(NotFoundException):
        await service.execute(
            db=db,
            method="GET",
            path="/mock/products/3",
            query_params={},
            headers={},
            body=None,
        )

    call_args = service._create_request_log.call_args.kwargs

    assert call_args["response_status"] == 404
    assert call_args["mock_api_id"] == 1
    assert call_args["api_version_id"] == 10


# ============================================================
# INACTIVE DEFAULT RESPONSE SCENARIO
# ============================================================


@pytest.mark.asyncio
async def test_execute_inactive_default_response_scenario(
    service,
    db,
    mock_api,
    api_version,
    success_scenario,
):
    success_scenario.is_active = False

    service._find_mock_api = MagicMock(
        return_value=(
            mock_api,
            {"id": "3"},
        )
    )

    service.api_version_repository.get_active_by_mock_api_id = MagicMock(
        return_value=api_version
    )

    service.request_schema_repository.get_by_api_version_id = MagicMock(
        return_value=None
    )

    service.response_scenario_repository.get_default_by_api_version_id = (
        MagicMock(
            return_value=success_scenario
        )
    )

    service._create_request_log = MagicMock()

    with pytest.raises(NotFoundException):
        await service.execute(
            db=db,
            method="GET",
            path="/mock/products/3",
            query_params={},
            headers={},
            body=None,
        )

    call_args = service._create_request_log.call_args.kwargs

    assert call_args["response_status"] == 404


# ============================================================
# RESPONSE DELAY
# ============================================================

@pytest.mark.asyncio
async def test_execute_applies_response_delay(
    service,
    db,
    mock_api,
    api_version,
    success_scenario,
):
    success_scenario.delay_ms = 300

    service._find_mock_api = MagicMock(
        return_value=(
            mock_api,
            {"id": "3"},
        )
    )

    service.api_version_repository.get_active_by_mock_api_id = MagicMock(
        return_value=api_version
    )

    service.request_schema_repository.get_by_api_version_id = MagicMock(
        return_value=None
    )

    service.response_scenario_repository.get_default_by_api_version_id = (
        MagicMock(
            return_value=success_scenario
        )
    )

    service._create_request_log = MagicMock()

    with patch(
        "app.services.mock_execution_service.asyncio.sleep",
        new_callable=AsyncMock,
    ) as mock_sleep:

        scenario, _ = await service.execute(
            db=db,
            method="GET",
            path="/mock/products/3",
            query_params={},
            headers={},
            body=None,
        )

    assert scenario == success_scenario

    mock_sleep.assert_awaited_once_with(0.3)



# ============================================================
# REQUEST LOGGING
# ============================================================


@pytest.mark.asyncio
async def test_execute_creates_request_log_on_success(
    service,
    db,
    mock_api,
    api_version,
    success_scenario,
):
    service._find_mock_api = MagicMock(
        return_value=(
            mock_api,
            {"id": "3"},
        )
    )

    service.api_version_repository.get_active_by_mock_api_id = MagicMock(
        return_value=api_version
    )

    service.request_schema_repository.get_by_api_version_id = MagicMock(
        return_value=None
    )

    service.response_scenario_repository.get_default_by_api_version_id = (
        MagicMock(
            return_value=success_scenario
        )
    )

    service._create_request_log = MagicMock()

    await service.execute(
        db=db,
        method="GET",
        path="/mock/products/3",
        query_params={
            "page": "1",
        },
        headers={
            "Authorization": "Bearer secret-token",
            "Content-Type": "application/json",
        },
        body=None,
    )

    service._create_request_log.assert_called_once()

    call_args = service._create_request_log.call_args.kwargs

    assert call_args["mock_api_id"] == 1
    assert call_args["api_version_id"] == 10
    assert call_args["method"] == "GET"
    assert call_args["path"] == "/mock/products/3"
    assert call_args["query_params"] == {
        "page": "1",
    }
    assert call_args["path_params"] == {
        "id": "3",
    }
    assert call_args["response_status"] == 200
    assert call_args["response_time_ms"] >= 0


# ============================================================
# ERROR REQUEST LOGGING
# ============================================================


@pytest.mark.asyncio
async def test_execute_logs_error_request(
    service,
    db,
):
    service._find_mock_api = MagicMock(
        side_effect=BadRequestException(
            "Invalid request"
        )
    )

    service._create_request_log = MagicMock()

    with pytest.raises(BadRequestException):
        await service.execute(
            db=db,
            method="GET",
            path="/mock/products/abc",
            query_params={},
            headers={},
            body=None,
        )

    service._create_request_log.assert_called_once()

    call_args = service._create_request_log.call_args.kwargs

    assert call_args["mock_api_id"] is None
    assert call_args["api_version_id"] is None
    assert call_args["response_status"] == 400
    assert call_args["response_time_ms"] >= 0


# ============================================================
# AUTHENTICATED MOCK API
# ============================================================


@pytest.mark.asyncio
async def test_execute_authenticated_mock_api(
    service,
    db,
    mock_api,
    api_version,
    success_scenario,
):
    mock_api.requires_auth = True

    service._find_mock_api = MagicMock(
        return_value=(
            mock_api,
            {"id": "3"},
        )
    )

    service.api_version_repository.get_active_by_mock_api_id = MagicMock(
        return_value=api_version
    )

    service.request_schema_repository.get_by_api_version_id = MagicMock(
        return_value=None
    )

    service.response_scenario_repository.get_default_by_api_version_id = (
        MagicMock(
            return_value=success_scenario
        )
    )

    service._create_request_log = MagicMock()

    with patch(
        "app.services.mock_execution_service.authenticate_request"
    ) as mock_auth:

        scenario, _ = await service.execute(
            db=db,
            method="GET",
            path="/mock/products/3",
            query_params={},
            headers={
                "authorization": "Bearer test-token",
            },
            body=None,
        )

    assert scenario == success_scenario

    mock_auth.assert_called_once_with(
        headers={
            "authorization": "Bearer test-token",
        },
        db=db,
    )


# ============================================================
# AUTHENTICATION FAILURE
# ============================================================


@pytest.mark.asyncio
async def test_execute_authentication_failure(
    service,
    db,
    mock_api,
):
    mock_api.requires_auth = True

    service._find_mock_api = MagicMock(
        return_value=(
            mock_api,
            {"id": "3"},
        )
    )

    service._create_request_log = MagicMock()

    with patch(
        "app.services.mock_execution_service.authenticate_request",
        side_effect=BadRequestException(
            "Authentication failed"
        ),
    ):

        with pytest.raises(BadRequestException):
            await service.execute(
                db=db,
                method="GET",
                path="/mock/products/3",
                query_params={},
                headers={},
                body=None,
            )

    service._create_request_log.assert_called_once()

    call_args = service._create_request_log.call_args.kwargs

    assert call_args["response_status"] == 400
