// Types
import type { LoginResponse } from "../types";

// API
import { api } from "./client";

export function loginRequest(email: string, password: string) {
  return api.post<LoginResponse>("/auth/login", { email, password });
}
