import { apiFetch } from "@/lib/api";

const TOKEN_KEY = "geo_token";

export type UserRole = "admin" | "enterprise_user";

export interface CurrentUser {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  company_id: string | null;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

export async function login(email: string, password: string): Promise<void> {
  const res = await apiFetch<TokenResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem(TOKEN_KEY, res.access_token);
}

export async function register(payload: {
  email: string;
  password: string;
  full_name: string;
  company_name: string;
}): Promise<void> {
  await apiFetch("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await login(payload.email, payload.password);
}

export async function getCurrentUser(): Promise<CurrentUser> {
  return apiFetch<CurrentUser>("/api/v1/auth/me");
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
