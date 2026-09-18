# 🚀 API Mock Server & Request Simulation Platform

<p align="center">
  <strong>A full-stack platform for creating, configuring, and testing mock APIs without implementing an actual backend service.</strong>
</p>

<p align="center">

![Python](https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge\&logo=python\&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge\&logo=fastapi\&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge\&logo=mysql\&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge\&logo=redis\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)

</p>

---

## 📌 Overview

The **API Mock Server & Request Simulation Platform** is a full-stack application that allows developers to create and test mock APIs without building an actual backend implementation.

Developers can define an API through the web interface and configure:

* HTTP method
* Endpoint path
* Request parameters
* Request headers
* Request body schema
* Response body
* Response headers
* HTTP status code
* Response delay
* Response scenarios
* Endpoint-level authentication

The platform dynamically exposes the configured endpoints and returns the corresponding mock responses when they are called.

---

## 🎯 Objective

The primary objective is to provide a flexible API simulation environment where frontend developers, QA engineers, and API consumers can test application integrations before the real backend service is available.

### Example

A developer can configure:

```text
GET  /mock/users
POST /mock/orders
GET  /mock/products/{id}
```

The platform dynamically exposes these endpoints and returns the configured responses.

---

# ✨ Features

## 🔐 Authentication & Authorization

* JWT-based authentication
* User registration
* User login
* Current-user endpoint
* Protected API access
* Endpoint-level authentication options
* API permissions
* Prevention of unauthorized access to private mock APIs

---

## 🧩 API Definition

Users can create mock APIs with:

| Configuration       | Supported |
| ------------------- | :-------: |
| HTTP Method         |     ✅     |
| Endpoint Path       |     ✅     |
| Request Parameters  |     ✅     |
| Request Headers     |     ✅     |
| Request Body Schema |     ✅     |
| Response Body       |     ✅     |
| Response Headers    |     ✅     |
| HTTP Status Code    |     ✅     |
| Response Delay      |     ✅     |

API definitions are stored in the database instead of being hardcoded.

---

## ⚡ Dynamic Endpoint Execution

Configured APIs are dynamically exposed by the platform.

### Example

```http
GET /mock/users
```

```http
POST /mock/orders
```

```http
GET /mock/products/{id}
```

When a request reaches a configured endpoint, the platform:

```text
Incoming Request
       ↓
Find API Definition
       ↓
Check API Version
       ↓
Check Authentication
       ↓
Validate Request
       ↓
Apply Response Scenario
       ↓
Apply Response Delay
       ↓
Return Configured Response
       ↓
Store Request History
```

---

# 🎭 Response Scenarios

The platform supports multiple response scenarios.

### ✅ Success Response

```http
200 OK
```

Example:

```json
{
  "message": "Request successful"
}
```

### ❌ Validation Error

```http
422 Unprocessable Content
```

### 🔒 Unauthorized Response

```http
401 Unauthorized
```

### 🔎 Not Found Response

```http
404 Not Found
```

### 💥 Server Error

```http
500 Internal Server Error
```

### 🛠️ Custom Response

Users can configure:

* Custom HTTP status code
* Custom response body
* Custom response headers
* Custom response delay

---

# 🛡️ Request Validation

Incoming requests are validated against the configured request schema.

The platform validates supported request components such as:

```text
Request Parameters
Request Headers
Request Body
```

If the request does not match the configured structure, the platform returns a meaningful validation error.

Example:

```json
{
  "detail": "Request validation failed"
}
```

---

# 🔄 API Versioning

The platform supports API versioning.

Example:

```text
/v1/users
/v2/users
```

Different API versions can maintain their own configurations.

Each version can define its own:

* Request schema
* Response template
* HTTP status code
* Response headers
* Authentication requirements

---

# 🔐 Endpoint-Level Authentication

Each mock API can have authentication requirements.

### Public API

```text
GET /mock/public-users
```

Accessible without authentication.

### Private API

```text
GET /mock/private-users
```

Requires valid authentication.

Unauthorized requests are rejected.

```http
401 Unauthorized
```

---

# 📊 Request History

The platform stores request execution information.

Each request log contains:

| Information        | Description                 |
| ------------------ | --------------------------- |
| Endpoint           | Requested mock endpoint     |
| HTTP Method        | GET, POST, etc.             |
| Request Parameters | Incoming parameters         |
| Request Body       | Incoming request payload    |
| Response Status    | Returned HTTP status        |
| Response Time      | Request execution time      |
| Timestamp          | Request execution timestamp |

This provides visibility into API usage and request behavior.

---

# 📈 Dashboard

The dashboard provides API usage statistics.

### Metrics

```text
Total Mock APIs
Active APIs
Total Requests
Error Requests
Most Used Endpoints
Average Response Time
```

Example:

```text
┌──────────────────────────────────────┐
│             API DASHBOARD            │
├──────────────────────────────────────┤
│                                      │
│  Total APIs        Active APIs       │
│      25                20            │
│                                      │
│  Total Requests    Error Requests    │
│     1,250              75            │
│                                      │
│  Average Response Time               │
│          42 ms                       │
│                                      │
└──────────────────────────────────────┘
```

---

# 📄 Pagination & Filtering

The platform supports pagination and filtering for applicable API management and request history operations.

Example:

```http
GET /mock-apis?page=1&limit=10
```

Filtering can be applied using supported query parameters.

---

# ⚡ Redis Caching

Redis is integrated into the platform for caching where appropriate.

Caching can reduce repeated database access for frequently requested mock API configuration data.

The application uses Redis alongside MySQL rather than replacing the primary database.

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │      React UI        │
                         │  Vite + TypeScript   │
                         │      Material UI     │
                         └──────────┬───────────┘
                                    │
                                    │ HTTP / Axios
                                    ▼
                         ┌──────────────────────┐
                         │      FastAPI         │
                         │       Backend        │
                         └──────────┬───────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
        ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
        │     MySQL      │ │     Redis      │ │      JWT       │
        │     8.0        │ │     Caching    │ │ Authentication │
        └────────────────┘ └────────────────┘ └────────────────┘
```

---

# 🧰 Technology Stack

## Backend

* Python 3.14
* FastAPI
* SQLAlchemy
* Alembic
* Pydantic
* Redis
* JWT Authentication

## Frontend

* React.js
* Vite
* TypeScript
* Material UI
* Axios
* React Router

## Database

* MySQL 8.0

## Development & Testing

* Visual Studio Code
* MySQL Workbench
* Postman
* Swagger / OpenAPI
* Docker
* Docker Compose

---

# 🗄️ Database Design

The platform uses the following database tables:

```text
users
mock_apis
api_versions
request_schemas
response_templates
request_logs
api_permissions
```

### Relationship Overview

```text
users
  │
  ├───────────────┐
  │               │
  ▼               ▼
mock_apis    api_permissions
  │
  ▼
api_versions
  │
  ├───────────────► request_schemas
  │
  └───────────────► response_templates
                         │
                         ▼
                    request_logs
```

---

# 📁 Project Structure

```text
api-mock-server/
│
├── backend/
│   │
│   ├── app/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── routers/
│   │   └── main.py
│   │
│   ├── alembic/
│   │   ├── versions/
│   │   └── env.py
│   │
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   │
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── docs/
│   └── SWAGGER_DOCUMENTATION.md
│
├── postman/
│   └── API-Mock-Server.postman_collection.json
│
├── tests/
│
├── docker-compose.yml
├── README.md
└── .env.example
```

---

# 🚀 Getting Started

## Prerequisites

Install the following:

```text
Python 3.14
Node.js
MySQL 8.0
Redis
Docker
Docker Compose
Git
```

---

# 1️⃣ Clone the Repository

```bash
git clone <repository-url>
```

Navigate into the project:

```bash
cd api-mock-server
```

---

# 2️⃣ Backend Setup

Navigate to the backend:

```powershell
cd backend
```

Create a virtual environment:

```powershell
python -m venv .venv
```

Activate it:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

---

# 3️⃣ Environment Configuration

Create the environment file from the example:

```powershell
copy .env.example .env
```

Configure the required database, Redis, and JWT settings in `.env`.

Example structure:

```env
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/api_mock_db

REDIS_URL=redis://localhost:6379/0

SECRET_KEY=your-secret-key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Do not commit the actual `.env` file to GitHub.

---

# 4️⃣ Database Migration

Run Alembic migrations:

```powershell
python -m alembic upgrade head
```

---

# 5️⃣ Start Backend

Run:

```powershell
python -m uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

---

# 6️⃣ Swagger Documentation

Open:

```text
http://127.0.0.1:8000/docs
```

Alternative documentation:

```text
http://127.0.0.1:8000/redoc
```

OpenAPI specification:

```text
http://127.0.0.1:8000/openapi.json
```

---

# 7️⃣ Frontend Setup

Open another terminal.

Navigate to:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

The Vite development server will display the frontend URL in the terminal.

---

# 🐳 Docker Setup

The project supports Docker and Docker Compose.

Start the services:

```powershell
docker compose up -d
```

Check running containers:

```powershell
docker compose ps
```

Stop the services:

```powershell
docker compose down
```

View logs:

```powershell
docker compose logs
```

---

# 🧪 API Testing

The project supports API testing through:

```text
Swagger / OpenAPI
Postman
```

---

# 📮 Postman Collection

A Postman collection is included in:

```text
postman/API-Mock-Server.postman_collection.json
```

## Import into Postman

1. Open **Postman**
2. Click **Import**
3. Select **File**
4. Select:

```text
API-Mock-Server.postman_collection.json
```

5. Click **Import**

---

## Postman Base URL

The collection uses:

```text
{{base_url}}
```

Default value:

```text
http://127.0.0.1:8000
```

---

## Authentication Flow

Run the requests in this order:

```text
Register
   ↓
Login
   ↓
Get Current User
```

The Login request stores the returned JWT access token in:

```text
{{access_token}}
```

Protected requests automatically use:

```http
Authorization: Bearer {{access_token}}
```

---

# 🔑 Authentication API

| Method | Endpoint         | Authentication |
| ------ | ---------------- | -------------- |
| POST   | `/auth/register` | Public         |
| POST   | `/auth/login`    | Public         |
| GET    | `/auth/me`       | JWT            |

---

# 🧩 Mock API Management

| Method | Endpoint              | Authentication |
| ------ | --------------------- | -------------- |
| POST   | `/mock-apis`          | JWT            |
| GET    | `/mock-apis`          | JWT            |
| GET    | `/mock-apis/{api_id}` | JWT            |
| PUT    | `/mock-apis/{api_id}` | JWT            |
| DELETE | `/mock-apis/{api_id}` | JWT            |

---

# 🔄 Dynamic Mock API Example

After creating a mock API definition:

```text
Method:
GET

Path:
/users
```

The platform dynamically exposes:

```http
GET /mock/users
```

For a product endpoint:

```text
GET /products/{id}
```

The resulting mock endpoint can be called as:

```http
GET /mock/products/101
```

The response is generated from the configured response template.

---

# 🧪 Testing Workflow

```text
Start MySQL
      ↓
Start Redis
      ↓
Start FastAPI
      ↓
Open Swagger / Postman
      ↓
Register User
      ↓
Login
      ↓
Authenticate
      ↓
Create Mock API
      ↓
Configure Request
      ↓
Configure Response
      ↓
Execute Dynamic Endpoint
      ↓
Verify Response
      ↓
Verify Request History
      ↓
Verify Dashboard
```

---

# 🧱 Exception Handling

The backend implements proper exception handling for application-level failures.

The API can return appropriate HTTP responses such as:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Content
500 Internal Server Error
```

---

# 🔒 Security

The application uses JWT-based authentication to protect secured resources.

Security considerations include:

* Password hashing
* JWT access tokens
* Protected API endpoints
* Endpoint-level authentication
* API permissions
* Private mock API protection
* Environment-based configuration
* No hardcoded credentials

---

# 🧪 Unit Testing

Unit tests are included for validating backend functionality.

Run tests with:

```powershell
pytest
```

For detailed output:

```powershell
pytest -v
```

---

# 📚 Documentation

Project documentation is available in the `docs` directory.

```text
docs/
└── SWAGGER_DOCUMENTATION.md
```

Swagger UI:

```text
http://127.0.0.1:8000/docs
```

ReDoc:

```text
http://127.0.0.1:8000/redoc
```

---

# 🌐 API Flow

```text
                    CLIENT
                      │
                      ▼
              ┌───────────────┐
              │   FastAPI     │
              └───────┬───────┘
                      │
              Authenticate
                      │
                      ▼
              ┌───────────────┐
              │  API Lookup   │
              └───────┬───────┘
                      │
                      ▼
             ┌─────────────────┐
             │ Request         │
             │ Validation      │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │ Response        │
             │ Configuration   │
             └────────┬────────┘
                      │
                      ▼
                Mock Response
                      │
                      ▼
             ┌─────────────────┐
             │ Request History │
             └─────────────────┘
```

---

# 📊 Core Functional Flow

```text
Create API
     │
     ▼
Define Endpoint
     │
     ├── HTTP Method
     ├── Endpoint Path
     ├── Request Parameters
     ├── Request Headers
     ├── Request Body Schema
     ├── Response Body
     ├── Response Headers
     ├── HTTP Status
     └── Response Delay
             │
             ▼
       Save Configuration
             │
             ▼
     Dynamic Endpoint
             │
             ▼
      Incoming Request
             │
             ▼
       Validate Request
             │
             ▼
       Execute Scenario
             │
             ▼
       Return Response
             │
             ▼
       Store Request Log
```

---

# 🎯 Use Cases

The platform can be used to:

* Test frontend applications before backend completion
* Simulate REST API responses
* Test different HTTP status codes
* Test validation failures
* Test authentication failures
* Simulate server errors
* Test API integrations
* Simulate response delays
* Test different API versions
* Verify application behavior against different response scenarios

---

# 📦 Deliverables

The project includes:

```text
✅ FastAPI Backend
✅ React Frontend
✅ MySQL Database
✅ SQLAlchemy ORM
✅ Alembic Migrations
✅ Redis Integration
✅ JWT Authentication
✅ Docker Configuration
✅ Swagger / OpenAPI Documentation
✅ Postman Collection
✅ Unit Tests
✅ README
✅ .env.example
```

---

# 🔮 Project Structure Summary

```text
API Mock Server
│
├── Authentication
│
├── API Definition
│
├── Dynamic Endpoint Execution
│
├── Response Scenarios
│
├── Request Validation
│
├── API Versioning
│
├── Endpoint Authentication
│
├── API Permissions
│
├── Request History
│
├── Pagination & Filtering
│
├── Dashboard
│
└── Redis Caching
```

---

# 👨‍💻 Development Tools

| Tool               | Purpose                     |
| ------------------ | --------------------------- |
| Visual Studio Code | Development                 |
| MySQL Workbench    | Database Management         |
| Postman            | API Testing                 |
| Swagger            | API Documentation & Testing |
| Docker             | Containerization            |
| Git                | Version Control             |

---

# 📌 Important

The platform is designed around **database-driven API definitions**.

Mock endpoints should not be hardcoded into the application source code.

Instead:

```text
Database Configuration
        ↓
API Definition
        ↓
Dynamic Route Resolution
        ↓
Request Validation
        ↓
Configured Response
```

This allows users to create and modify mock APIs through the platform without modifying backend source code.

---
## 👨‍💻 Author

**Prabu Ram**

### API Mock Server & Request Simulation Platform

Built with Python, FastAPI, React, TypeScript, MySQL, Redis, and Docker.

# 📄 License

This project is developed for learning, development, API testing, and request simulation purposes.
