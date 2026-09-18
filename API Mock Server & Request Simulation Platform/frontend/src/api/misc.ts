import { apiClient } from "./client";
import type {
  DashboardResponse,
  RequestLog,
  RequestLogListResponse,
  UserCreatePayload,
  UserListResponse,
  UserResponse,
  UserUpdatePayload,
} from "../types";

export interface RequestLogFilters {
  page?: number;
  page_size?: number;
  mock_api_id?: number;
  method?: string;
  response_status?: number;
}

export const requestLogApi = {
  list: (filters: RequestLogFilters = {}) =>
    apiClient
      .get<RequestLogListResponse>("/request-logs", { params: filters })
      .then((r) => r.data),

  get: (id: number) => apiClient.get<RequestLog>(`/request-logs/${id}`).then((r) => r.data),
};

export const dashboardApi = {
  get: () => apiClient.get<DashboardResponse>("/dashboard").then((r) => r.data),
};

export interface UserFilters {
  page?: number;
  page_size?: number;
  search?: string;
  role_id?: number;
  is_active?: boolean;
}

export const userApi = {
  list: (filters: UserFilters = {}) =>
    apiClient.get<UserListResponse>("/users", { params: filters }).then((r) => r.data),

  get: (id: number) => apiClient.get<UserResponse>(`/users/${id}`).then((r) => r.data),

  create: (payload: UserCreatePayload) =>
    apiClient.post<UserResponse>("/users", payload).then((r) => r.data),

  update: (id: number, payload: UserUpdatePayload) =>
    apiClient.put<UserResponse>(`/users/${id}`, payload).then((r) => r.data),

  changeRole: (id: number, roleId: number) =>
    apiClient.patch<UserResponse>(`/users/${id}/role`, { role_id: roleId }).then((r) => r.data),

  activate: (id: number) =>
    apiClient.patch<UserResponse>(`/users/${id}/activate`).then((r) => r.data),

  deactivate: (id: number) =>
    apiClient.patch<UserResponse>(`/users/${id}/deactivate`).then((r) => r.data),

  remove: (id: number) => apiClient.delete<void>(`/users/${id}`).then((r) => r.data),
};
