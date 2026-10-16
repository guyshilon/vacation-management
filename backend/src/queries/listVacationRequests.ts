import { FindOptionsWhere, In } from "typeorm";
import { AppDataSource } from "../config/database";
import {
  VacationRequest,
  VacationRequestStatus,
} from "../entities/VacationRequest";
import { AppError } from "../errors/AppError";
import { AuthUser } from "../http/authFromEvent";
import { toPublicVacationRequest } from "../utils/vacationRequestPublic";

const STATUSES: VacationRequestStatus[] = ["Pending", "Approved", "Rejected"];

export async function listVacationRequests(options: {
  authUser: AuthUser;
  page: number;
  limit: number;
  status?: string;
  userId?: string;
}) {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(50, Math.max(1, options.limit || 10));

  if (options.status && !STATUSES.includes(options.status as VacationRequestStatus)) {
    throw new AppError(400, "status must be Pending, Approved, or Rejected.");
  }

  const where: FindOptionsWhere<VacationRequest> = {};

  if (options.authUser.role === "Requester") {
    where.user_id = options.authUser.userId;
  } else if (options.userId) {
    where.user_id = options.userId;
  }

  if (options.status) {
    where.status = options.status as VacationRequestStatus;
  }

  const [vacationRequests, total] = await AppDataSource.getRepository(
    VacationRequest
  ).findAndCount({
    where,
    relations: { user: true },
    order: { created_at: "DESC" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    vacationRequests: vacationRequests.map(toPublicVacationRequest),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function listTeamVacationRequests() {
  const vacationRequests = await AppDataSource.getRepository(VacationRequest).find({
    where: { status: In(["Pending", "Approved"]) },
    relations: { user: true },
    order: { start_date: "ASC" },
  });

  return {
    vacationRequests: vacationRequests.map(toPublicVacationRequest),
  };
}
