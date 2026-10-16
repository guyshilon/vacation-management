import type { User } from "../types";
import { api } from "./client";

export function fetchUsers() {
  return api.get<{ users: User[] }>("/users");
}
