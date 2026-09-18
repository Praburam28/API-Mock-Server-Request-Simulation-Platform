export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ---------- Auth / Users ----------

export interface UserResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  role_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserRegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface UserLoginPayload {
  email: string;
  password: string;
}

export interface UserCreatePayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role_id: number;
}

export interface UserUpdatePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
}

export type UserListResponse = PaginatedResponse<UserResponse>;

// ---------- Mock APIs ----------

export interface MockAPI {
  id: number;
  name: string;
  method: string;
  path: string;
  description: string | null;
  is_active: boolean;
  requires_auth: boolean;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateMockAPIPayload {
  name: string;
  method: string;
  path: string;
  description?: string | null;
  requires_auth: boolean;
}

export interface UpdateMockAPIPayload {
  name?: string;
  method?: string;
  path?: string;
  description?: string | null;
  is_active?: boolean;
  requires_auth?: boolean;
}

// ---------- API Versions ----------

export interface APIVersion {
  id: number;
  mock_api_id: number;
  version: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAPIVersionPayload {
  version: string;
  description?: string | null;
}

export interface UpdateAPIVersionPayload {
  version?: string;
  description?: string | null;
  is_active?: boolean;
}

// ---------- Request Schema ----------

export interface RequestSchema {
  id: number;
  api_version_id: number;
  body_schema: Record<string, string> | null;
  query_schema: Record<string, string> | null;
  path_schema: Record<string, string> | null;
  header_schema: Record<string, string> | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface RequestSchemaPayload {
  body_schema?: Record<string, string> | null;
  query_schema?: Record<string, string> | null;
  path_schema?: Record<string, string> | null;
  header_schema?: Record<string, string> | null;
  description?: string | null;
}

// ---------- Response Template ----------

export interface ResponseTemplate {
  id: number;
  api_version_id: number;
  response_body: Record<string, unknown> | null;
  response_headers: Record<string, string> | null;
  status_code: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResponseTemplatePayload {
  response_body?: Record<string, unknown> | null;
  response_headers?: Record<string, string> | null;
  status_code?: number;
  description?: string | null;
}

// ---------- Response Scenarios ----------

export const SCENARIO_TYPES = [
  "success",
  "validation_error",
  "unauthorized",
  "not_found",
  "server_error",
  "custom",
] as const;

export type ScenarioType = (typeof SCENARIO_TYPES)[number];

export interface ResponseScenario {
  id: number;
  api_version_id: number;
  name: string;
  scenario_type: string;
  response_body: Record<string, unknown> | null;
  response_headers: Record<string, string> | null;
  status_code: number;
  delay_ms: number;
  is_default: boolean;
  is_active: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResponseScenarioPayload {
  name: string;
  scenario_type: string;
  response_body?: Record<string, unknown> | null;
  response_headers?: Record<string, string> | null;
  status_code: number;
  delay_ms: number;
  is_default: boolean;
  is_active: boolean;
  description?: string | null;
}

// ---------- Request Logs ----------

export interface RequestLog {
  id: number;
  mock_api_id: number;
  api_version_id: number;
  method: string;
  path: string;
  query_params: Record<string, unknown> | null;
  path_params: Record<string, unknown> | null;
  request_headers: Record<string, unknown> | null;
  request_body: Record<string, unknown> | null;
  response_status: number;
  response_time_ms: number;
  created_at: string;
  updated_at: string;
}

export type RequestLogListResponse = PaginatedResponse<RequestLog>;

// ---------- Dashboard ----------

export interface MostUsedEndpoint {
  method: string;
  path: string;
  request_count: number;
}

export interface DashboardResponse {
  total_mock_apis: number;
  active_mock_apis: number;
  total_requests: number;
  error_requests: number;
  average_response_time_ms: number;
  most_used_endpoints: MostUsedEndpoint[];
}

// ---------- API errors ----------

export interface ValidationErrorItem {
  field: string;
  message: string;
  type: string;
}

export interface ApiErrorBody {
  detail?: string;
  errors?: ValidationErrorItem[];
}
