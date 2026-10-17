// Types
import type { User } from "../types";

// API
import { api } from "./client";

export function fetchUsers() {
  return api.get<{ users: User[] }>("/users");
}
