import { apiClient } from "./client";
import type { TokenResponse, UserLoginPayload, UserRegisterPayload, UserResponse } from "../types";

export const authApi = {
  login: (payload: UserLoginPayload) =>
    apiClient.post<TokenResponse>("/auth/login", payload).then((r) => r.data),

  register: (payload: UserRegisterPayload) =>
    apiClient.post<UserResponse>("/auth/register", payload).then((r) => r.data),

  me: () => apiClient.get<UserResponse>("/auth/me").then((r) => r.data),
};
