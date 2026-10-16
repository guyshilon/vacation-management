import { VacationRequest } from "../entities/VacationRequest";

export function toPublicVacationRequest(request: VacationRequest) {
  return {
    id: request.id,
    user_id: request.user_id,
    user: request.user
      ? {
          id: request.user.id,
          name: request.user.name,
          email: request.user.email,
          role: request.user.role,
        }
      : undefined,
    start_date: request.start_date,
    end_date: request.end_date,
    reason: request.reason,
    status: request.status,
    comments: request.comments,
    created_at: request.created_at,
    updated_at: request.updated_at,
  };
}
