// Vue
import { computed, ref } from "vue";

// Types
import type { User, UserRole } from "../types";

// API
import { loginRequest } from "../api/auth";

function isTokenExpired(token: string | null): boolean {
  if (!token) {
    return true;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" && payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

const user = ref<User | null>(readUser());
const token = ref<string | null>(localStorage.getItem("token"));

function readUser(): User | null {
  const raw = localStorage.getItem("user");
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function homePathForRole(role: UserRole): string {
  return role === "Validator" ? "/review" : "/requests";
}

export function useAuth() {
  const isLoggedIn = computed(
    () => Boolean(token.value && user.value) && !isTokenExpired(token.value)
  );

  async function login(email: string, password: string) {
    const { data } = await loginRequest(email, password);
    token.value = data.token;
    user.value = data.user;
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return { user, token, isLoggedIn, login, logout };
}
