# API Mock Server & Request Simulation Platform

A backend platform for creating, configuring, and executing dynamic mock APIs without implementing a real backend service.

Developers can define mock endpoints with HTTP methods, paths, request schemas, response templates, response scenarios, authentication requirements, response delays, and more.

The platform dynamically executes these configurations through a FastAPI backend and records request history for monitoring and analytics.

---

## 1. Project Overview

The API Mock Server allows developers and frontend teams to create mock APIs for development and testing.

Instead of waiting for a real backend API to be completed, developers can configure an endpoint such as:

```text
GET /mock/users
POST /mock/orders
GET /mock/products/{id}
GET /mock/private/users
```

The server dynamically identifies the configured endpoint and returns the configured response.

### Example

A developer can configure:

```text
Method:
GET

Path:
/mock/users

Response Status:
200

Response Body:
{
    "users": [
        {
            "id": 1,
            "name": "John"
        }
    ]
}
```

Then calling:

```text
GET http://localhost:8000/mock/users
```

returns the configured mock response.

---

# 2. Main Features

## Authentication

* User registration
* User login
* JWT access tokens
* Current user endpoint
* Active/inactive user validation
* Endpoint-level authentication

## Role-Based Access Control

Two roles are currently supported:

* Admin
* User

Admin-only operations are protected using RBAC.

## User Management

Admins can:

* Create users
* View users
* Update users
* Change user roles
* Activate/deactivate users
* Delete users

## Mock API Management

Users can create and manage mock APIs with:

* API name
* HTTP method
* Endpoint path
* Description
* Active/inactive status
* Endpoint authentication requirement

## API Versioning

Mock APIs support multiple API versions.

Example:

```text
/mock/users
    v1
    v2
```

Each version can have its own request schema and response configuration.

## Request Schema Configuration

Request schemas can define:

* Query parameters
* Path parameters
* Request headers
* Request body

Incoming requests can be validated against the configured schema.

## Response Templates

Response templates define:

* HTTP status code
* Response body
* Response headers

## Response Scenarios

Multiple response scenarios can be configured for an API version.

Examples:

```text
Success
Validation Error
Unauthorized
Not Found
Server Error
Custom
```

Each scenario can define:

* Scenario name
* Scenario type
* Response body
* Response headers
* Status code
* Response delay
* Active/default status
* Description

## Dynamic Endpoint Execution

Configured APIs are executed dynamically.

Examples:

```text
GET /mock/users
GET /mock/products/10
POST /mock/orders
GET /mock/private/users
```

No individual FastAPI route needs to be created for every mock endpoint.

## Dynamic Path Parameters

Endpoints can contain dynamic path parameters.

Example:

```text
/mock/products/{id}
```

Request:

```text
GET /mock/products/25
```

The server identifies:

```text
id = 25
```

and validates the configured path schema.

## Endpoint-Level Authentication

A mock API can be configured with:

```text
requires_auth = true
```

When authentication is enabled, a valid JWT Bearer token is required.

Example:

```http
Authorization: Bearer <access_token>
```

Public endpoints do not require authentication.

## Response Delay

Mock responses can simulate network/server delays.

Example:

```text
delay_ms = 5000
```

The server waits approximately five seconds before returning the response.

This is useful for testing frontend loading states.

## Request History

Requests are logged with information such as:

* Mock API
* API version
* HTTP method
* Request path
* Query parameters
* Path parameters
* Request headers
* Request body
* Response status
* Response time
* Timestamp

## Pagination and Filtering

Request history supports pagination and filtering by:

* Mock API
* HTTP method
* Response status

## Dashboard

The backend provides dashboard statistics including:

* Total mock APIs
* Active mock APIs
* Total requests
* Error requests
* Average response time
* Most-used endpoints

## Redis Caching

Redis is used as a performance optimization.

Active mock API metadata is cached by HTTP method.

Example cache key:

```text
mock_apis:active:GET
```

Cached data has a configurable TTL.

Cache invalidation is performed when mock APIs are:

* Created
* Updated
* Deleted

If Redis becomes unavailable, the application continues using the database.

---

# 3. Technology Stack

## Backend

| Technology        | Purpose                     |
| ----------------- | --------------------------- |
| Python 3.12       | Programming language        |
| FastAPI           | REST API framework          |
| SQLAlchemy        | ORM and database operations |
| Pydantic          | Request/response validation |
| Pydantic Settings | Environment configuration   |
| Alembic           | Database migrations         |
| JWT               | Authentication              |
| pwdlib            | Password hashing            |
| Redis             | Caching                     |
| MySQL 8.0         | Relational database         |
| Uvicorn           | ASGI server                 |

## Development Tools

* Visual Studio Code
* Docker Desktop
* Docker Compose
* MySQL Workbench
* Postman
* Swagger / OpenAPI

---

# 4. Backend Architecture

The backend follows a layered architecture.

```text
Request
   |
   v
Router
   |
   v
Service
   |
   v
Repository
   |
   v
SQLAlchemy Model
   |
   v
MySQL
```

Redis is used as a caching layer where required.

```text
                +----------------+
                |    FastAPI     |
                +-------+--------+
                        |
                        v
                +---------------+
                |    Routers    |
                +-------+-------+
                        |
                        v
                +---------------+
                |   Services    |
                +-------+-------+
                        |
              +---------+---------+
              |                   |
              v                   v
       +-------------+      +-------------+
       | Repositories|      |    Redis    |
       +------+------+      +-------------+
              |
              v
       +-------------+
       |   MySQL     |
       +-------------+
```

---

# 5. Project Structure

```text
api-mock-server/
│
├── .dockerignore
├── .gitignore
├── .env
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── README.md
├── project_structure.txt
├── requirements.txt
├── alembic.ini
│
├── alembic/
│   ├── env.py
│   ├── README
│   ├── script.py.mako
│   └── versions/
│       ├── ...
│
└── app/
    │
    ├── main.py
    │
    ├── core/
    │   ├── __init__.py
    │   ├── config.py
    │   ├── exceptions.py
    │   ├── logging.py
    │   ├── redis.py
    │   └── security.py
    │
    ├── db/
    │   ├── __init__.py
    │   ├── base.py
    │   ├── base_class.py
    │   └── session.py
    │
    ├── dependencies/
    │   ├── __init__.py
    │   └── auth.py
    │
    ├── models/
    │   ├── __init__.py
    │   ├── role.py
    │   ├── user.py
    │   ├── mock_api.py
    │   ├── api_version.py
    │   ├── request_schema.py
    │   ├── response_template.py
    │   ├── response_scenario.py
    │   └── request_log.py
    │
    ├── repositories/
    │   ├── __init__.py
    │   ├── user_repository.py
    │   ├── mock_api_repository.py
    │   ├── api_version_repository.py
    │   ├── request_schema_repository.py
    │   ├── response_template_repository.py
    │   ├── response_scenario_repository.py
    │   ├── request_log_repository.py
    │   └── ...
    │
    ├── schemas/
    │   ├── __init__.py
    │   ├── user.py
    │   ├── auth.py
    │   ├── mock_api.py
    │   ├── api_version.py
    │   ├── request_schema.py
    │   ├── response_template.py
    │   ├── response_scenario.py
    │   ├── request_log.py
    │   └── dashboard.py
    │
    ├── services/
    │   ├── __init__.py
    │   ├── user_service.py
    │   ├── mock_api_service.py
    │   ├── api_version_service.py
    │   ├── request_schema_service.py
    │   ├── response_template_service.py
    │   ├── response_scenario_service.py
    │   ├── request_log_service.py
    │   ├── dashboard_service.py
    │   ├── mock_execution_service.py
    │   └── cache_service.py
    │
    └── routers/
        ├── __init__.py
        ├── auth.py
        ├── users.py
        ├── mock_apis.py
        ├── api_versions.py
        ├── request_schemas.py
        ├── response_templates.py
        ├── response_scenarios.py
        ├── request_logs.py
        ├── dashboard.py
        └── mock_execution.py
```

---

# 6. Configuration

Application configuration is managed using environment variables.

The application uses:

```text
.env
```

for local configuration.

Do not commit the real `.env` file to Git.

Use:

```text
.env.example
```

as the configuration template.

Example:

```env
APP_NAME=API Mock Server
APP_VERSION=1.0.0
DEBUG=False

MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_DATABASE=api_mock_db
MYSQL_USER=mock_user
MYSQL_PASSWORD=your_password
MYSQL_ROOT_PASSWORD=your_root_password

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0
REDIS_URL=redis://redis:6379/0
REDIS_CACHE_TTL=300

JWT_SECRET_KEY=change-this-secret
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

DATABASE_URL=mysql+pymysql://mock_user:your_password@mysql:3306/api_mock_db
```

---

# 7. Docker Setup

The backend runs inside Docker.

The project uses three services:

```text
backend
mysql
redis
```

## Backend

```text
Container:
api_mock_backend

Port:
8000
```

## MySQL

```text
Container:
api_mock_mysql

Host Port:
3307

Container Port:
3306
```

## Redis

```text
Container:
api_mock_redis

Port:
6379
```

---

# 8. Docker Compose

The main Docker services are:

```yaml
services:

  backend:
    build:
      context: .
      dockerfile: Dockerfile

  mysql:
    image: mysql:8.0

  redis:
    image: redis:7-alpine
```

The backend waits for MySQL and Redis health checks before starting.

---

# 9. Start the Project

Open PowerShell in the project root:

```powershell
cd C:\Projects\api-mock-server
```

Start all containers:

```powershell
docker compose up -d
```

Check running containers:

```powershell
docker compose ps
```

Expected services:

```text
api_mock_backend
api_mock_mysql
api_mock_redis
```

---

# 10. View Backend Logs

```powershell
docker compose logs backend
```

Follow logs:

```powershell
docker compose logs -f backend
```

---

# 11. Stop the Project

Stop containers:

```powershell
docker compose down
```

Stop containers without deleting database volumes:

```powershell
docker compose down
```

The MySQL and Redis data volumes remain available.

---

# 12. Rebuild the Backend

After changing dependencies or the Dockerfile:

```powershell
docker compose build backend
```

Then:

```powershell
docker compose up -d
```

Or rebuild and start together:

```powershell
docker compose up -d --build
```

---

# 13. Database

The application uses:

```text
MySQL 8.0
```

Database:

```text
api_mock_db
```

The backend connects to MySQL using the Docker service name:

```text
mysql
```

Therefore, inside Docker:

```text
MYSQL_HOST=mysql
MYSQL_PORT=3306
```

The host machine accesses MySQL through:

```text
localhost:3307
```

---

# 14. Database Migrations

Alembic is used for database schema management.

Check the current migration:

```powershell
docker compose exec backend alembic current
```

Show migration history:

```powershell
docker compose exec backend alembic history
```

Run all pending migrations:

```powershell
docker compose exec backend alembic upgrade head
```

Create a migration after changing SQLAlchemy models:

```powershell
docker compose exec backend alembic revision --autogenerate -m "description"
```

Then apply it:

```powershell
docker compose exec backend alembic upgrade head
```

### Important

Migration files inside:

```text
alembic/versions/
```

must be committed to Git.

Do not delete migration files that have already been applied to a shared database.

---

# 15. Database Tables

The backend currently contains tables for:

```text
users
roles
mock_apis
api_versions
request_schemas
response_templates
response_scenarios
request_logs
```

Additional tables such as API permissions can be added as the platform evolves.

---

# 16. Model Layer

SQLAlchemy models represent database tables.

Example:

```text
User
Role
MockAPI
APIVersion
RequestSchema
ResponseTemplate
ResponseScenario
RequestLog
```

The central model import is maintained in:

```text
app/db/base.py
```

Alembic imports the central `Base`, allowing migrations to discover all registered models.

---

# 17. Repository Layer

Repositories contain database access logic.

Example:

```text
UserRepository
MockAPIRepository
RequestLogRepository
```

Responsibilities include:

* SELECT
* INSERT
* UPDATE
* DELETE
* Filtering
* Pagination
* Database queries

Repositories should not contain API request/response logic.

---

# 18. Service Layer

Services contain application/business logic.

Examples:

```text
UserService
MockAPIService
APIVersionService
RequestSchemaService
ResponseTemplateService
ResponseScenarioService
MockExecutionService
RequestLogService
DashboardService
CacheService
```

Services coordinate:

```text
Router
   ↓
Service
   ↓
Repository
```

---

# 19. Schema Layer

Pydantic schemas define and validate API input/output structures.

Examples:

```text
UserRegister
UserLogin
TokenResponse
UserResponse
MockAPICreate
MockAPIUpdate
RequestSchemaCreate
ResponseTemplateCreate
ResponseScenarioCreate
```

Pydantic is responsible for validating API data before it reaches the business logic.

---

# 20. Authentication

The application uses JWT authentication.

## Register

```http
POST /auth/register
```

Example:

```json
{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "Password@123"
}
```

## Login

```http
POST /auth/login
```

The login response contains an access token.

Example:

```json
{
    "access_token": "eyJ...",
    "token_type": "bearer"
}
```

Use the token in authenticated requests:

```http
Authorization: Bearer <access_token>
```

## Current User

```http
GET /auth/me
```

This endpoint is useful for verifying authentication.

---

# 21. RBAC

The application supports role-based authorization.

Current roles:

```text
Admin
User
```

Admin-only endpoints use the admin dependency.

A normal User attempting an Admin-only operation receives:

```text
403 Forbidden
```

---

# 22. Mock API Creation

Example mock API:

```http
POST /mock-apis
```

Example configuration:

```json
{
    "name": "Get Users",
    "method": "GET",
    "path": "/mock/users",
    "description": "Mock endpoint for getting users",
    "is_active": true,
    "requires_auth": false
}
```

After configuration, the dynamic endpoint becomes:

```http
GET /mock/users
```

---

# 23. Dynamic Endpoint Execution

Dynamic execution is handled by:

```text
app/routers/mock_execution.py
```

and:

```text
app/services/mock_execution_service.py
```

The router catches supported HTTP methods and passes the request to the execution service.

Supported methods:

```text
GET
POST
PUT
PATCH
DELETE
```

The execution service:

1. Finds the configured mock API
2. Checks whether it is active
3. Checks endpoint authentication
4. Finds the active API version
5. Loads request schema
6. Validates the incoming request
7. Finds the default response scenario
8. Applies response delay
9. Creates request history
10. Returns the configured response

---

# 24. Dynamic Path Parameters

Example configuration:

```text
GET /mock/products/{id}
```

Request:

```http
GET /mock/products/10
```

The execution engine extracts:

```json
{
    "id": "10"
}
```

and can validate it against the configured path schema.

---

# 25. Endpoint Authentication

Mock APIs can be public or private.

Public:

```text
requires_auth = false
```

Private:

```text
requires_auth = true
```

A private mock endpoint requires:

```http
Authorization: Bearer <access_token>
```

Without a valid token:

```text
401 Unauthorized
```

With an inactive authenticated user:

```text
403 Forbidden
```

---

# 26. Request Validation

Configured request schemas can validate:

```text
Query parameters
Path parameters
Headers
Request body
```

Example:

```text
GET /mock/products/{id}
```

with a configured path schema.

If an incoming request does not satisfy the configured schema, the request is rejected with an appropriate validation error.

---

# 27. Response Templates

A response template defines the default API response.

Example:

```json
{
    "status_code": 200,
    "response_body": {
        "message": "Success"
    },
    "response_headers": {
        "X-Mock-Server": "API-Mock-Server"
    }
}
```

---

# 28. Response Scenarios

Multiple response scenarios can be configured.

Example:

```text
Success
Unauthorized
Not Found
Validation Error
Server Error
Custom
```

A scenario can contain:

```text
name
scenario_type
response_body
response_headers
status_code
delay_ms
is_default
is_active
description
```

---

# 29. Response Delay

Response delay is configured in milliseconds.

Example:

```text
delay_ms = 5000
```

The API will wait approximately five seconds before returning the response.

This is useful for testing:

* Loading indicators
* Timeout handling
* Slow network behaviour
* Retry logic
* Frontend error states

---

# 30. Request History

Every successfully processed mock request is recorded.

Stored information includes:

```text
Mock API
API version
HTTP method
Request path
Query parameters
Path parameters
Request headers
Request body
Response status
Response time
Timestamp
```

Sensitive headers such as authorization information are excluded from request logging.

---

# 31. Request History API

Request history supports:

```text
Pagination
Mock API filtering
HTTP method filtering
Response status filtering
```

Example parameters:

```text
?page=1&page_size=10
```

---

# 32. Dashboard

The dashboard provides API usage statistics.

Example response:

```json
{
    "total_mock_apis": 3,
    "active_mock_apis": 3,
    "total_requests": 10,
    "error_requests": 2,
    "average_response_time_ms": 105.4,
    "most_used_endpoints": [
        {
            "method": "GET",
            "path": "/mock/users",
            "request_count": 8
        }
    ]
}
```

---

# 33. Redis Cache

Redis is used for performance optimization.

The active Mock API list is cached by HTTP method.

Example:

```text
mock_apis:active:GET
mock_apis:active:POST
```

The cache contains mock API metadata used during dynamic endpoint discovery.

The cache has a configurable TTL:

```env
REDIS_CACHE_TTL=300
```

This means the cached data remains available for approximately:

```text
300 seconds
```

---

# 34. Cache Invalidation

When a Mock API changes, its method cache is invalidated.

Cache invalidation occurs when:

```text
Mock API is created
Mock API is updated
Mock API is deleted
```

This prevents stale API definitions from remaining in Redis after database changes.

---

# 35. Redis Failure Handling

Redis is treated as an optimization rather than a required data store.

If Redis becomes unavailable:

```text
Redis cache operation fails
        ↓
Application continues
        ↓
Database is used
```

This prevents a Redis outage from stopping the mock API service.

---

# 36. Swagger / OpenAPI

After starting the backend, open:

```text
http://localhost:8000/docs
```

Swagger UI can be used to:

* Register users
* Login
* Authenticate
* Create Mock APIs
* Configure versions
* Configure request schemas
* Configure response templates
* Configure response scenarios
* Execute mock APIs
* View request history
* View dashboard information

Alternative OpenAPI JSON:

```text
http://localhost:8000/openapi.json
```

---

# 37. Health Check

The application provides:

```http
GET /health
```

Example response:

```json
{
    "status": "healthy"
}
```

This can be used to verify that the FastAPI application is running.

---

# 38. Testing with Postman

The backend can also be tested using Postman.

Recommended testing order:

### Step 1 — Register

```http
POST /auth/register
```

### Step 2 — Login

```http
POST /auth/login
```

Copy the JWT access token.

### Step 3 — Authenticate

Use:

```text
Authorization → Bearer Token
```

Paste the JWT token.

### Step 4 — Create Mock API

Example:

```text
GET /mock/users
```

### Step 5 — Configure API Version

Create version:

```text
v1
```

### Step 6 — Configure Request Schema

Configure query/path/header/body validation if required.

### Step 7 — Configure Response Template

Configure:

```text
Status: 200
Body: desired JSON
```

### Step 8 — Execute

Call:

```http
GET http://localhost:8000/mock/users
```

### Step 9 — Verify Request History

Check the request log endpoint.

### Step 10 — Verify Dashboard

Check dashboard statistics.

---

# 39. Recommended Backend Testing Flow

Before considering the backend complete, verify:

```text
[ ] Health check
[ ] User registration
[ ] User login
[ ] JWT authentication
[ ] GET /auth/me
[ ] Admin RBAC
[ ] User management
[ ] Mock API CRUD
[ ] API versioning
[ ] Request schema
[ ] Response template
[ ] Response scenarios
[ ] Dynamic GET endpoint
[ ] Dynamic POST endpoint
[ ] Dynamic path parameter
[ ] Request validation
[ ] Endpoint authentication
[ ] Response delay
[ ] Request history
[ ] Pagination
[ ] Filtering
[ ] Dashboard
[ ] Redis caching
[ ] Redis TTL
[ ] Cache invalidation
```

---

# 40. Useful Docker Commands

Start:

```powershell
docker compose up -d
```

Stop:

```powershell
docker compose down
```

Rebuild:

```powershell
docker compose up -d --build
```

Check containers:

```powershell
docker compose ps
```

Backend logs:

```powershell
docker compose logs -f backend
```

Enter backend container:

```powershell
docker compose exec backend sh
```

Run Alembic:

```powershell
docker compose exec backend alembic upgrade head
```

Open MySQL:

```powershell
docker compose exec mysql mysql -u mock_user -p api_mock_db
```

Open Redis CLI:

```powershell
docker compose exec redis redis-cli
```

---

# 41. Redis Testing Commands

Check a cache key:

```text
EXISTS mock_apis:active:GET
```

View cached data:

```text
GET mock_apis:active:GET
```

Check remaining TTL:

```text
TTL mock_apis:active:GET
```

Delete a cache key manually:

```text
DEL mock_apis:active:GET
```

---

# 42. Git Safety

The following files must not contain production secrets:

```text
.env
```

The real `.env` file should not be committed.

The project contains:

```text
.env.example
```

which provides a safe configuration template.

The following should also be ignored:

```text
__pycache__/
*.pyc
.venv/
.pytest_cache/
.vscode/
.idea/
*.log
```

Database migration files must remain tracked:

```text
alembic/versions/
```

---

# 43. Security Practices

The backend follows these security principles:

* Passwords are stored as hashes rather than plain text.
* JWT is used for authenticated requests.
* Protected endpoints require valid authentication.
* Admin operations use RBAC.
* Inactive users cannot authenticate normally.
* Authorization headers are excluded from request history logging.
* Environment variables are used for secrets and database credentials.
* Real `.env` files should not be committed to source control.

For production deployment, use a strong randomly generated JWT secret and secure database credentials.

---

# 44. Error Handling

The application uses centralized exception handling.

Common HTTP errors include:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

Application-specific exceptions are defined separately from services and repositories.

This keeps business logic cleaner and makes error responses consistent.

---

# 45. Development Workflow

Recommended development workflow:

```text
1. Update SQLAlchemy model
          ↓
2. Create Alembic migration
          ↓
3. Apply migration
          ↓
4. Update repository
          ↓
5. Update service
          ↓
6. Update Pydantic schema
          ↓
7. Update router
          ↓
8. Test using Swagger/Postman
          ↓
9. Verify MySQL/Redis
```

---

# 46. Current Backend Status

The main backend functionality is implemented:

```text
Authentication                 ✅
JWT                            ✅
RBAC                           ✅
User Management                ✅
Mock API CRUD                  ✅
API Versioning                 ✅
Request Schemas                ✅
Response Templates             ✅
Response Scenarios             ✅
Dynamic Endpoint Execution     ✅
Dynamic Path Parameters        ✅
Request Validation             ✅
Endpoint Authentication        ✅
Response Delay                 ✅
Request History                ✅
Pagination / Filtering         ✅
Dashboard                      ✅
Redis Cache                    ✅
Cache Invalidation             ✅
Docker                         ✅
MySQL                          ✅
Alembic                        ✅
Swagger                        ✅
```

---

# 47. Future Development

The next major phase is the frontend application.

Planned frontend stack:

```text
React
Vite
TypeScript
Material UI
Axios
React Router
```

The frontend will provide UI screens for:

```text
Login
Registration
Dashboard
Mock API Management
API Version Management
Request Schema Configuration
Response Template Configuration
Response Scenario Management
Request History
User Management
```

The frontend will communicate with the FastAPI backend through REST APIs.

---

# 48. Project Goal

The final goal is to provide a developer-friendly platform where a developer can:

```text
Create Mock API
      ↓
Configure Request
      ↓
Configure Response
      ↓
Configure Scenarios
      ↓
Enable Authentication if required
      ↓
Expose Dynamic Endpoint
      ↓
Test from Postman / Frontend
      ↓
Store Request History
      ↓
View Dashboard Statistics
```

The platform removes the need to implement a real backend API when the main requirement is to test frontend applications, integrations, error handling, loading states, authentication flows, and different API response scenarios.
