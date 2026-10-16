import type { LoginResponse } from "../types";
import { api } from "./client";

export function loginRequest(email: string, password: string) {
  return api.post<LoginResponse>("/auth/login", { email, password });
}
