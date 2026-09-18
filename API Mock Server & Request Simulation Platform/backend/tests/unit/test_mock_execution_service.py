import pytest

from app.core.exceptions import BadRequestException
from app.services.mock_execution_service import MockExecutionService


@pytest.fixture
def service():
    return MockExecutionService()


# ============================================================
# PATH TESTS
# ============================================================


def test_match_path_with_path_parameter(service):
    result = service._match_path(
        configured_path="/mock/products/{id}",
        incoming_path="/mock/products/3",
    )

    assert result == {
        "id": "3"
    }


def test_match_path_without_parameter(service):
    result = service._match_path(
        configured_path="/mock/users",
        incoming_path="/mock/users",
    )

    assert result == {}


def test_match_path_returns_none_for_wrong_path(service):
    result = service._match_path(
        configured_path="/mock/products/{id}",
        incoming_path="/mock/users/3",
    )

    assert result is None


def test_match_path_with_multiple_parameters(service):
    result = service._match_path(
        configured_path="/mock/users/{user_id}/orders/{order_id}",
        incoming_path="/mock/users/10/orders/25",
    )

    assert result == {
        "user_id": "10",
        "order_id": "25",
    }


def test_match_path_normalizes_trailing_slash(service):
    result = service._match_path(
        configured_path="/mock/products/{id}/",
        incoming_path="/mock/products/3/",
    )

    assert result == {
        "id": "3"
    }


# ============================================================
# VALUE CONVERSION TESTS
# ============================================================


def test_convert_value_to_string(service):
    result = service._convert_value(
        value="laptop",
        expected_type="string",
        field_name="name",
    )

    assert result == "laptop"
    assert isinstance(result, str)


def test_convert_value_to_integer(service):
    result = service._convert_value(
        value="3",
        expected_type="integer",
        field_name="id",
    )

    assert result == 3
    assert isinstance(result, int)


def test_convert_value_to_float(service):
    result = service._convert_value(
        value="55000.50",
        expected_type="float",
        field_name="price",
    )

    assert result == 55000.50
    assert isinstance(result, float)


def test_convert_value_to_number(service):
    result = service._convert_value(
        value="55000.50",
        expected_type="number",
        field_name="price",
    )

    assert result == 55000.50
    assert isinstance(result, float)


def test_convert_value_true_boolean(service):
    result = service._convert_value(
        value="true",
        expected_type="boolean",
        field_name="is_active",
    )

    assert result is True


def test_convert_value_false_boolean(service):
    result = service._convert_value(
        value="false",
        expected_type="boolean",
        field_name="is_active",
    )

    assert result is False


def test_convert_value_one_to_boolean(service):
    result = service._convert_value(
        value="1",
        expected_type="boolean",
        field_name="is_active",
    )

    assert result is True


def test_convert_value_zero_to_boolean(service):
    result = service._convert_value(
        value="0",
        expected_type="boolean",
        field_name="is_active",
    )

    assert result is False


def test_convert_invalid_integer_raises_error(service):
    with pytest.raises(BadRequestException):
        service._convert_value(
            value="abc",
            expected_type="integer",
            field_name="id",
        )


def test_convert_invalid_float_raises_error(service):
    with pytest.raises(BadRequestException):
        service._convert_value(
            value="abc",
            expected_type="float",
            field_name="price",
        )


def test_convert_invalid_boolean_raises_error(service):
    with pytest.raises(BadRequestException):
        service._convert_value(
            value="maybe",
            expected_type="boolean",
            field_name="is_active",
        )


def test_convert_unsupported_type_raises_error(service):
    with pytest.raises(BadRequestException):
        service._convert_value(
            value="abc",
            expected_type="date",
            field_name="created_at",
        )


# ============================================================
# QUERY / PATH PARAMETER VALIDATION TESTS
# ============================================================


def test_validate_parameters_success(service):
    result = service._validate_parameters(
        values={
            "id": "3",
            "page": "2",
        },
        schema={
            "id": {
                "type": "integer",
            },
            "page": {
                "type": "integer",
            },
        },
        source_name="query",
    )

    assert result == {
        "id": 3,
        "page": 2,
    }


def test_validate_parameters_missing_parameter_raises_error(service):
    with pytest.raises(BadRequestException):
        service._validate_parameters(
            values={
                "id": "3",
            },
            schema={
                "id": {
                    "type": "integer",
                },
                "page": {
                    "type": "integer",
                },
            },
            source_name="query",
        )


def test_validate_parameters_invalid_parameter_raises_error(service):
    with pytest.raises(BadRequestException):
        service._validate_parameters(
            values={
                "id": "abc",
            },
            schema={
                "id": {
                    "type": "integer",
                },
            },
            source_name="path",
        )


def test_validate_parameters_empty_schema_returns_values(service):
    result = service._validate_parameters(
        values={
            "page": "2",
        },
        schema={},
        source_name="query",
    )

    assert result == {
        "page": "2",
    }


# ============================================================
# BODY VALIDATION TESTS
# ============================================================


def test_validate_body_success(service):
    body = {
        "name": "Updated Laptop",
        "price": 55000,
        "stock": 25,
        "category": "Electronics",
    }

    schema = {
        "type": "object",
        "required": [
            "name",
            "price",
            "stock",
            "category",
        ],
        "properties": {
            "name": {
                "type": "string",
            },
            "price": {
                "type": "number",
            },
            "stock": {
                "type": "integer",
            },
            "category": {
                "type": "string",
            },
        },
    }

    result = service._validate_body(
        body=body,
        schema=schema,
    )

    assert result == body


def test_validate_body_missing_required_field_raises_error(service):
    body = {
        "name": "Updated Laptop",
        "price": 55000,
        "category": "Electronics",
    }

    schema = {
        "type": "object",
        "required": [
            "name",
            "price",
            "stock",
            "category",
        ],
        "properties": {
            "name": {
                "type": "string",
            },
            "price": {
                "type": "number",
            },
            "stock": {
                "type": "integer",
            },
            "category": {
                "type": "string",
            },
        },
    }

    with pytest.raises(BadRequestException):
        service._validate_body(
            body=body,
            schema=schema,
        )


def test_validate_body_invalid_string_raises_error(service):
    body = {
        "name": 123,
    }

    schema = {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
            },
        },
    }

    with pytest.raises(BadRequestException):
        service._validate_body(
            body=body,
            schema=schema,
        )


def test_validate_body_invalid_integer_raises_error(service):
    body = {
        "stock": "25",
    }

    schema = {
        "type": "object",
        "properties": {
            "stock": {
                "type": "integer",
            },
        },
    }

    with pytest.raises(BadRequestException):
        service._validate_body(
            body=body,
            schema=schema,
        )


def test_validate_body_invalid_number_raises_error(service):
    body = {
        "price": "55000",
    }

    schema = {
        "type": "object",
        "properties": {
            "price": {
                "type": "number",
            },
        },
    }

    with pytest.raises(BadRequestException):
        service._validate_body(
            body=body,
            schema=schema,
        )


def test_validate_body_invalid_boolean_raises_error(service):
    body = {
        "is_active": "true",
    }

    schema = {
        "type": "object",
        "properties": {
            "is_active": {
                "type": "boolean",
            },
        },
    }

    with pytest.raises(BadRequestException):
        service._validate_body(
            body=body,
            schema=schema,
        )


def test_validate_body_allows_additional_fields(service):
    body = {
        "name": "Laptop",
        "brand": "Dell",
    }

    schema = {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
            },
        },
    }

    result = service._validate_body(
        body=body,
        schema=schema,
    )

    assert result == body


def test_validate_body_without_required_fields_supports_partial_update(
    service,
):
    body = {
        "price": 60000,
    }

    schema = {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
            },
            "price": {
                "type": "number",
            },
            "stock": {
                "type": "integer",
            },
        },
    }

    result = service._validate_body(
        body=body,
        schema=schema,
    )

    assert result == {
        "price": 60000,
    }


def test_validate_body_none_raises_error(service):
    schema = {
        "type": "object",
        "required": [
            "name",
        ],
        "properties": {
            "name": {
                "type": "string",
            },
        },
    }

    with pytest.raises(BadRequestException):
        service._validate_body(
            body=None,
            schema=schema,
        )


def test_validate_body_non_object_raises_error(service):
    schema = {
        "type": "object",
        "properties": {},
    }

    with pytest.raises(BadRequestException):
        service._validate_body(
            body=["Laptop"],
            schema=schema,
        )


# ============================================================
# HEADER VALIDATION TESTS
# ============================================================


def test_validate_headers_success(service):
    result = service._validate_headers(
        headers={
            "Content-Type": "application/json",
            "X-Request-Id": "123",
        },
        schema={
            "content-type": {
                "type": "string",
            },
            "x-request-id": {
                "type": "integer",
            },
        },
    )

    assert result == {
        "content-type": "application/json",
        "x-request-id": 123,
    }


def test_validate_headers_is_case_insensitive(service):
    result = service._validate_headers(
        headers={
            "CONTENT-TYPE": "application/json",
        },
        schema={
            "Content-Type": {
                "type": "string",
            },
        },
    )

    assert result == {
        "Content-Type": "application/json",
    }


def test_validate_headers_missing_header_raises_error(service):
    with pytest.raises(BadRequestException):
        service._validate_headers(
            headers={},
            schema={
                "X-Request-Id": {
                    "type": "integer",
                },
            },
        )


def test_validate_headers_invalid_value_raises_error(service):
    with pytest.raises(BadRequestException):
        service._validate_headers(
            headers={
                "X-Request-Id": "abc",
            },
            schema={
                "X-Request-Id": {
                    "type": "integer",
                },
            },
        )


# ============================================================
# HEADER SANITIZATION TESTS
# ============================================================


def test_sanitize_headers_removes_sensitive_headers(service):
    headers = {
        "content-type": "application/json",
        "authorization": "Bearer secret-token",
        "cookie": "session=secret",
        "x-request-id": "123",
    }

    result = service._sanitize_headers(headers)

    assert result == {
        "content-type": "application/json",
        "x-request-id": "123",
    }


def test_sanitize_headers_keeps_normal_headers(service):
    headers = {
        "content-type": "application/json",
        "accept": "application/json",
    }

    result = service._sanitize_headers(headers)

    assert result == headers


# ============================================================
# STATUS CODE TESTS
# ============================================================


def test_get_error_status_code_for_app_exception(service):
    exception = BadRequestException(
        "Invalid request"
    )

    result = service._get_error_status_code(exception)

    assert result == exception.status_code


def test_get_error_status_code_for_generic_exception(service):
    exception = ValueError("Something went wrong")

    result = service._get_error_status_code(exception)

    assert result == 500
