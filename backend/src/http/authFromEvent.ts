import { CommonEvent } from "commoneventframework/dist/types/commonEvent";
import { UserRole } from "../entities/User";
import { AppError } from "../errors/AppError";
import { JwtPayload, verifyToken } from "../utils/jwt";

export type AuthUser = JwtPayload;

export function getAuthUser(event: CommonEvent): AuthUser {
  const header =
    event.headers?.authorization ?? event.headers?.Authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    throw new AppError(401, "Missing token. Log in first.");
  }

  try {
    return verifyToken(token);
  } catch {
    throw new AppError(401, "Invalid or expired token.");
  }
}

export function requireRole(user: AuthUser, ...roles: UserRole[]): void {
  if (!roles.includes(user.role)) {
    throw new AppError(403, "You do not have permission for this action.");
  }
}
