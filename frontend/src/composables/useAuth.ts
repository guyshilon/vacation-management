import { computed, ref } from "vue";
import { loginRequest } from "../api/auth";
import type { User, UserRole } from "../types";

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
  const isLoggedIn = computed(() => Boolean(token.value && user.value));

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
