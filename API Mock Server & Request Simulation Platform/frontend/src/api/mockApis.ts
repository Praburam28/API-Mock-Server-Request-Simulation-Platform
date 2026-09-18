import { apiClient } from "./client";
import type { CreateMockAPIPayload, MockAPI, UpdateMockAPIPayload } from "../types";

export const mockApiApi = {
  list: () => apiClient.get<MockAPI[]>("/mock-apis").then((r) => r.data),

  get: (id: number) => apiClient.get<MockAPI>(`/mock-apis/${id}`).then((r) => r.data),

  create: (payload: CreateMockAPIPayload) =>
    apiClient.post<MockAPI>("/mock-apis", payload).then((r) => r.data),

  update: (id: number, payload: UpdateMockAPIPayload) =>
    apiClient.put<MockAPI>(`/mock-apis/${id}`, payload).then((r) => r.data),

  remove: (id: number) => apiClient.delete<void>(`/mock-apis/${id}`).then((r) => r.data),
};
