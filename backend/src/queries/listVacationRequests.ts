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

const SORT_FIELDS = ["start_date", "end_date", "created_at"] as const;

export async function listVacationRequests(options: {
  authUser: AuthUser;
  page: number;
  limit: number;
  status?: string;
  userId?: string;
  sort?: string;
  order?: string;
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

  const sortField = SORT_FIELDS.includes(options.sort as (typeof SORT_FIELDS)[number])
    ? options.sort
    : "created_at";
  const sortOrder = options.order === "ASC" ? "ASC" : "DESC";
  const defaultOrder = sortField === "created_at" && options.order !== "ASC" ? "DESC" : sortOrder;

  const [vacationRequests, total] = await AppDataSource.getRepository(
    VacationRequest
  ).findAndCount({
    where,
    relations: { user: true },
    order: { [sortField as string]: defaultOrder },
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
