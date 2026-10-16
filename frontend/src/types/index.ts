export type UserRole = "Requester" | "Validator";

export type VacationRequestStatus = "Pending" | "Approved" | "Rejected";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type VacationRequest = {
  id: string;
  user_id: string;
  user?: Pick<User, "id" | "name" | "email" | "role">;
  start_date: string;
  end_date: string;
  reason?: string | null;
  status: VacationRequestStatus;
  comments?: string | null;
  created_at: string;
  updated_at: string;
};

export type PaginatedVacationRequests = {
  vacationRequests: VacationRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
