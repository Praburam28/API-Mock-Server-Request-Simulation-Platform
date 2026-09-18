# 🚀 API Mock Server & Request Simulation Platform

A full-stack platform that allows developers to create, configure, and test mock APIs without implementing an actual backend service.

Developers can define mock API endpoints, request structures, response templates, HTTP status codes, headers, response delays, authentication options, and error scenarios through the platform.

---

## 📌 Features

### 🔐 Authentication

* User registration
* User login
* JWT authentication
* Protected API management
* Current authenticated user
* Password hashing
* Active/inactive user validation

### 🧩 API Definition

Users can create mock APIs with:

* HTTP Method
* Endpoint Path
* Description
* Active/Inactive status
* Path parameters

Supported HTTP methods:

```text
GET
POST
PUT
PATCH
DELETE
```

### 🔄 Dynamic Endpoint Execution

Created mock APIs can be dynamically exposed and executed.

Example:

```text
GET    /mock/users
POST   /mock/orders
GET    /mock/products/{id}
```

The platform returns the configured mock response without requiring an actual backend implementation.

### 📋 Response Scenarios

The platform supports:

* Success Response
* Validation Error
* Unauthorized Response
* Not Found Response
* Server Error
* Custom Response

### ✅ Request Validation

Incoming requests can be validated against configured request schemas.

Meaningful validation errors are returned when requests do not match the expected structure.

### 📊 Request History

The platform records:

* Endpoint
* HTTP Method
* Request Parameters
* Request Body
* Response Status
* Response Time
* Timestamp

### 📈 Dashboard

Dashboard metrics include:

* Total Mock APIs
* Active APIs
* Total Requests
* Error Requests
* Most Used Endpoints
* Average Response Time

### 🔢 API Versioning

Support for multiple API versions allows developers to maintain different versions of mock endpoints.

Example:

```text
/v1/users
/v2/users
```

### 🔒 Endpoint-Level Authentication

Mock APIs can be configured with authentication requirements.

Private mock APIs prevent unauthorized users from accessing protected endpoints.

### 🔍 Pagination & Filtering

API lists and request history support pagination and filtering.

### ⚡ Redis Caching

Redis is used for appropriate caching and performance-related operations.

### 🛡️ Exception Handling

The backend provides centralized handling for application and API errors.

---

# 🛠️ Technology Stack

## Backend

* Python 3.14
* FastAPI
* SQLAlchemy
* Alembic
* Pydantic
* Redis
* JWT Authentication
* PyMySQL
* bcrypt

## Frontend

* React.js
* Vite
* TypeScript
* Material UI
* Axios
* React Router

## Database

* MySQL 8.0

## Tools

* Visual Studio Code
* MySQL Workbench
* Postman
* Swagger/OpenAPI
* Docker
* Docker Compose
* Git
* GitHub

---

# 📁 Project Structure

```text
api-mock-server/
│
├── backend/
│   │
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   │
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── mock_api.py
│   │   │   ├── api_version.py
│   │   │   ├── request_schema.py
│   │   │   ├── response_template.py
│   │   │   ├── request_log.py
│   │   │   └── api_permission.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   └── mock_api.py
│   │   │
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   └── mock_apis.py
│   │   │
│   │   ├── services/
│   │   │   ├── auth_service.py
│   │   │   └── mock_api_service.py
│   │   │
│   │   └── main.py
│   │
│   ├── alembic/
│   │   ├── versions/
│   │   ├── env.py
│   │   └── script.py.mako
│   │
│   ├── .env
│   ├── .env.example
│   ├── alembic.ini
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── postman/
│   └── API-Mock-Server.postman_collection.json
│
├── tests/
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# 🗄️ Database Structure

The application uses MySQL 8.0.

Required database tables:

```text
users
mock_apis
api_versions
request_schemas
response_templates
request_logs
api_permissions
```

Alembic is used to manage database migrations.

---

# 🐳 Docker Services

The project uses Docker Compose for infrastructure services.

```text
┌──────────────────────────────┐
│       API Mock Server        │
└──────────────┬───────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
   MySQL 8.0          Redis
    :3309              :6381
```

Start the services:

```powershell
docker compose up -d
```

Check the services:

```powershell
docker compose ps
```

Stop the services:

```powershell
docker compose down
```

---

# ⚙️ Backend Setup

## 1. Navigate to backend

```powershell
cd api-mock-server\backend
```

## 2. Create virtual environment

```powershell
python -m venv .venv
```

## 3. Activate virtual environment

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

## 4. Install dependencies

```powershell
python -m pip install --upgrade pip
```

```powershell
pip install -r requirements.txt
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
APP_NAME=API Mock Server
APP_ENV=development

DATABASE_URL=mysql+pymysql://mock_user:mock_password@localhost:3309/api_mock_db

REDIS_URL=redis://localhost:6381/0

JWT_SECRET_KEY=change-this-secret-key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Never commit the `.env` file to GitHub.

Use `.env.example` as the template.

---

# 🗃️ Database Migration

After MySQL is running:

```powershell
python -m alembic upgrade head
```

Check the migration:

```powershell
python -m alembic current
```

Check available heads:

```powershell
python -m alembic heads
```

---

# ▶️ Run Backend

From the `backend` directory:

```powershell
python -m uvicorn app.main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

Health check:

```text
http://127.0.0.1:8000/health
```

---

# 📖 Swagger / OpenAPI Documentation

FastAPI automatically provides interactive API documentation.

### Swagger UI

```text
http://127.0.0.1:8000/docs
```

### ReDoc

```text
http://127.0.0.1:8000/redoc
```

Swagger provides interactive testing for:

* API endpoints
* Request schemas
* Response schemas
* Authentication
* Validation errors
* HTTP status codes

---

# 📮 Postman Collection

A Postman collection is included for testing the backend APIs.

Collection location:

```text
postman/API-Mock-Server.postman_collection.json
```

The collection covers:

```text
Authentication
├── Register
├── Login
└── Get Current User

Mock APIs
├── Create Mock API
├── List Mock APIs
├── Get Mock API
├── Update Mock API
└── Delete Mock API
```

---

# 📥 Postman Import Instructions

## 1. Open Postman

Install and open Postman.

## 2. Import the Collection

In Postman:

```text
Import
   ↓
Select Files
   ↓
API-Mock-Server.postman_collection.json
   ↓
Import
```

The collection will appear in your Postman workspace.

## 3. Set the Base URL

The default backend URL is:

```text
http://127.0.0.1:8000
```

The collection can use:

```text
{{base_url}}
```

with:

```text
base_url = http://127.0.0.1:8000
```

## 4. Start the Backend

From the backend directory:

```powershell
python -m uvicorn app.main:app --reload
```

Verify:

```text
http://127.0.0.1:8000/health
```

## 5. Register a User

In Postman:

```text
Authentication
└── Register
```

Example:

```json
{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "Test@12345"
}
```

## 6. Login

Run:

```text
Authentication
└── Login
```

The login request uses OAuth2 form data:

```text
username=testuser
password=Test@12345
```

The response contains:

```json
{
  "access_token": "YOUR_JWT_TOKEN",
  "token_type": "bearer"
}
```

Copy the access token.

## 7. Configure JWT Authentication

For protected requests:

```text
Authorization
Type: Bearer Token
```

Set:

```text
Token: YOUR_JWT_TOKEN
```

If the collection uses an environment variable:

```text
{{access_token}}
```

set the variable to the JWT returned by login.

## 8. Test Current User

Run:

```text
Authentication
└── Get Current User
```

Expected response:

```json
{
  "id": 1,
  "username": "testuser",
  "email": "testuser@example.com",
  "is_active": true
}
```

## 9. Test Mock APIs

After authentication, run the requests in this order:

```text
Create Mock API
       ↓
List Mock APIs
       ↓
Get Mock API
       ↓
Update Mock API
       ↓
Delete Mock API
```

---

# 🔐 Authentication Flow

```text
Register
   │
   ▼
Password Hashing
   │
   ▼
MySQL users
   │
   ▼
Login
   │
   ▼
Verify Password
   │
   ▼
Generate JWT
   │
   ▼
Access Token
   │
   ▼
Authorization: Bearer
   │
   ▼
Protected Endpoint
```

---

# 🧪 Testing

Run unit tests with:

```powershell
pytest
```

Run with verbose output:

```powershell
pytest -v
```

The test suite covers application functionality such as:

* Authentication
* API definitions
* Validation
* Protected endpoints
* Error handling

---

# 🔄 API Workflow

The overall platform workflow is:

```text
User
 │
 ▼
React Frontend
 │
 │ Axios
 ▼
FastAPI
 │
 ├── JWT Authentication
 │
 ├── API Definition
 │
 ├── Request Validation
 │
 ├── Dynamic Endpoint Execution
 │
 ├── Response Scenarios
 │
 └── Request Logging
 │
 ├───────────────┐
 ▼               ▼
MySQL           Redis
```

---

# 🚨 Error Handling

The API uses HTTP status codes to communicate request results.

Examples:

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
500 Internal Server Error
```

Validation errors provide meaningful information about invalid requests.

---

# 🔒 Security

The application implements:

* JWT authentication
* Password hashing
* Protected endpoints
* Endpoint-level authentication options
* User ownership validation
* Unauthorized access prevention
* Environment-based secrets
* Input validation

Secrets and credentials should be stored in `.env` and should not be committed to source control.

---

# 📊 Platform Architecture

```text
                 ┌─────────────────┐
                 │   React + Vite  │
                 │   TypeScript    │
                 │   Material UI   │
                 └────────┬────────┘
                          │
                        Axios
                          │
                          ▼
                 ┌─────────────────┐
                 │     FastAPI     │
                 │      JWT        │
                 │    Pydantic     │
                 └────────┬────────┘
                          │
               ┌──────────┴──────────┐
               │                     │
               ▼                     ▼
        ┌──────────────┐      ┌──────────────┐
        │   MySQL 8.0  │      │    Redis     │
        └──────────────┘      └──────────────┘
               │
               ▼
        ┌──────────────┐
        │   Alembic    │
        │  Migrations  │
        └──────────────┘
```

---

# 📌 Current API Endpoints

## Authentication

```text
POST /auth/register
POST /auth/login
GET  /auth/me
```

## Mock API Management

```text
POST   /mock-apis
GET    /mock-apis
GET    /mock-apis/{api_id}
PUT    /mock-apis/{api_id}
DELETE /mock-apis/{api_id}
```

---

# 📝 Example Mock API

Create:

```json
{
  "name": "Users API",
  "http_method": "GET",
  "endpoint_path": "/users",
  "description": "Mock users endpoint",
  "is_active": true
}
```

Another example:

```json
{
  "name": "Product API",
  "http_method": "GET",
  "endpoint_path": "/products/{id}",
  "description": "Mock product endpoint",
  "is_active": true
}
```

---

# 🐳 Useful Docker Commands

Start containers:

```powershell
docker compose up -d
```

Check containers:

```powershell
docker compose ps
```

View logs:

```powershell
docker compose logs
```

MySQL logs:

```powershell
docker compose logs mysql
```

Redis logs:

```powershell
docker compose logs redis
```

Stop containers:

```powershell
docker compose down
```

Stop and remove volumes:

```powershell
docker compose down -v
```

---

# 🗂️ Git Commands

Initialize Git:

```powershell
git init
```

Check status:

```powershell
git status
```

Add files:

```powershell
git add .
```

Commit:

```powershell
git commit -m "Initial API Mock Server implementation"
```

Add GitHub repository:

```powershell
git remote add origin YOUR_GITHUB_REPOSITORY_URL
```

Push:

```powershell
git branch -M main
git push -u origin main
```

---

# ⚠️ Important

Do not commit:

```text
.env
.venv/
__pycache__/
node_modules/
*.pyc
```

These should be included in `.gitignore`.

---

# 📦 Deliverables

The project includes the following deliverables:

* ✅ FastAPI Backend
* ✅ React Frontend
* ✅ MySQL Database
* ✅ SQLAlchemy ORM
* ✅ Alembic Migrations
* ✅ Redis Integration
* ✅ JWT Authentication
* ✅ Docker Configuration
* ✅ Swagger/OpenAPI Documentation
* ✅ Postman Collection
* ✅ Unit Tests
* ✅ README
* ✅ `.env.example`

---

# 👨‍💻 Development

The project is designed as a full-stack API simulation platform where developers can define and test mock APIs without implementing separate backend services.

```text
Define API
    ↓
Configure Request
    ↓
Configure Response
    ↓
Configure Status Code
    ↓
Configure Headers
    ↓
Configure Delay
    ↓
Execute Mock API
    ↓
Validate Request
    ↓
Return Mock Response
    ↓
Store Request History
```

---

## 📄 License

This project is intended for development, testing, learning, and API simulation purposes.
