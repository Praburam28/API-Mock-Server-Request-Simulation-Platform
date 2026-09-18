import { apiClient } from "./client";
import type { APIVersion, CreateAPIVersionPayload, UpdateAPIVersionPayload } from "../types";

export const apiVersionApi = {
  list: (mockApiId: number) =>
    apiClient.get<APIVersion[]>(`/mock-apis/${mockApiId}/versions`).then((r) => r.data),

  get: (mockApiId: number, versionId: number) =>
    apiClient.get<APIVersion>(`/mock-apis/${mockApiId}/versions/${versionId}`).then((r) => r.data),

  create: (mockApiId: number, payload: CreateAPIVersionPayload) =>
    apiClient.post<APIVersion>(`/mock-apis/${mockApiId}/versions`, payload).then((r) => r.data),

  update: (mockApiId: number, versionId: number, payload: UpdateAPIVersionPayload) =>
    apiClient
      .put<APIVersion>(`/mock-apis/${mockApiId}/versions/${versionId}`, payload)
      .then((r) => r.data),

  remove: (mockApiId: number, versionId: number) =>
    apiClient.delete<void>(`/mock-apis/${mockApiId}/versions/${versionId}`).then((r) => r.data),
};
