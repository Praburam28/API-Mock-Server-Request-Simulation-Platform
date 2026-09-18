import { apiClient } from "./client";
import type {
  RequestSchema,
  RequestSchemaPayload,
  ResponseTemplate,
  ResponseTemplatePayload,
  ResponseScenario,
  ResponseScenarioPayload,
} from "../types";

const base = (mockApiId: number, versionId: number) =>
  `/mock-apis/${mockApiId}/versions/${versionId}`;

export const requestSchemaApi = {
  get: (mockApiId: number, versionId: number) =>
    apiClient
      .get<RequestSchema>(`${base(mockApiId, versionId)}/request-schema`)
      .then((r) => r.data)
      .catch((err) => {
        if (err?.response?.status === 404) return null;
        throw err;
      }),

  create: (mockApiId: number, versionId: number, payload: RequestSchemaPayload) =>
    apiClient
      .post<RequestSchema>(`${base(mockApiId, versionId)}/request-schema`, payload)
      .then((r) => r.data),

  update: (mockApiId: number, versionId: number, payload: RequestSchemaPayload) =>
    apiClient
      .put<RequestSchema>(`${base(mockApiId, versionId)}/request-schema`, payload)
      .then((r) => r.data),

  remove: (mockApiId: number, versionId: number) =>
    apiClient.delete<void>(`${base(mockApiId, versionId)}/request-schema`).then((r) => r.data),
};

export const responseTemplateApi = {
  get: (mockApiId: number, versionId: number) =>
    apiClient
      .get<ResponseTemplate>(`${base(mockApiId, versionId)}/response-template`)
      .then((r) => r.data)
      .catch((err) => {
        if (err?.response?.status === 404) return null;
        throw err;
      }),

  create: (mockApiId: number, versionId: number, payload: ResponseTemplatePayload) =>
    apiClient
      .post<ResponseTemplate>(`${base(mockApiId, versionId)}/response-template`, payload)
      .then((r) => r.data),

  update: (mockApiId: number, versionId: number, payload: ResponseTemplatePayload) =>
    apiClient
      .put<ResponseTemplate>(`${base(mockApiId, versionId)}/response-template`, payload)
      .then((r) => r.data),

  remove: (mockApiId: number, versionId: number) =>
    apiClient.delete<void>(`${base(mockApiId, versionId)}/response-template`).then((r) => r.data),
};

export const responseScenarioApi = {
  list: (mockApiId: number, versionId: number) =>
    apiClient
      .get<ResponseScenario[]>(`${base(mockApiId, versionId)}/response-scenarios`)
      .then((r) => r.data),

  get: (mockApiId: number, versionId: number, scenarioId: number) =>
    apiClient
      .get<ResponseScenario>(`${base(mockApiId, versionId)}/response-scenarios/${scenarioId}`)
      .then((r) => r.data),

  create: (mockApiId: number, versionId: number, payload: ResponseScenarioPayload) =>
    apiClient
      .post<ResponseScenario>(`${base(mockApiId, versionId)}/response-scenarios`, payload)
      .then((r) => r.data),

  update: (
    mockApiId: number,
    versionId: number,
    scenarioId: number,
    payload: Partial<ResponseScenarioPayload>
  ) =>
    apiClient
      .put<ResponseScenario>(
        `${base(mockApiId, versionId)}/response-scenarios/${scenarioId}`,
        payload
      )
      .then((r) => r.data),

  remove: (mockApiId: number, versionId: number, scenarioId: number) =>
    apiClient
      .delete<void>(`${base(mockApiId, versionId)}/response-scenarios/${scenarioId}`)
      .then((r) => r.data),
};
