// Types
import type { PaginatedVacationRequests, VacationRequest } from "../types";

// API
import { api } from "./client";

export function fetchMyVacationRequests() {
  return api.get<PaginatedVacationRequests>("/vacation-requests", {
    params: { page: 1, limit: 50 },
  });
}

export function fetchTeamVacationRequests() {
  return api.get<{ vacationRequests: VacationRequest[] }>(
    "/vacation-requests/team"
  );
}

export function fetchVacationRequests(params: {
  page?: number;
  limit?: number;
  status?: string;
  user_id?: string;
  sort?: string;
  order?: string;
}) {
  return api.get<PaginatedVacationRequests>("/vacation-requests", { params });
}

export function createVacationRequest(payload: {
  start_date: string;
  end_date: string;
  reason?: string;
}) {
  return api.post<{ vacationRequest: VacationRequest }>(
    "/vacation-requests",
    payload
  );
}

export function approveVacationRequest(id: string) {
  return api.post<{ vacationRequest: VacationRequest }>(
    `/vacation-requests/${id}/approve`
  );
}

export function rejectVacationRequest(id: string, comments: string) {
  return api.post<{ vacationRequest: VacationRequest }>(
    `/vacation-requests/${id}/reject`,
    { comments }
  );
}
