import { AppDataSource } from "../config/database";
import { VacationRequest } from "../entities/VacationRequest";
import { AppError } from "../errors/AppError";
import { eventBus } from "../events/EventBus";
import {
  VACATION_REQUEST_CREATED,
  VacationRequestCreatedEvent,
} from "../events/vacationRequestEvents";
import { isIsoDate, todayIsoDate } from "../utils/dates";
import { CreateVacationRequestCommand } from "./CreateVacationRequestCommand";

export async function handleCreateVacationRequest(
  command: CreateVacationRequestCommand
): Promise<VacationRequest> {
  const { userId, startDate, endDate, reason } = command;

  if (!isIsoDate(startDate) || !isIsoDate(endDate)) {
    throw new AppError(400, "Dates must be in YYYY-MM-DD format.");
  }

  if (endDate < startDate) {
    throw new AppError(400, "End date must be after start date.");
  }

  if (startDate < todayIsoDate()) {
    throw new AppError(400, "Vacation requests in the past are not allowed.");
  }

  const repository = AppDataSource.getRepository(VacationRequest);
  const overlap = await repository
    .createQueryBuilder("request")
    .where("request.user_id = :userId", { userId })
    .andWhere("request.status IN (:...statuses)", {
      statuses: ["Pending", "Approved"],
    })
    .andWhere("request.start_date <= :endDate", { endDate })
    .andWhere("request.end_date >= :startDate", { startDate })
    .getOne();

  if (overlap) {
    throw new AppError(
      400,
      "This vacation overlaps another pending or approved request."
    );
  }

  const vacationRequest = repository.create({
    user_id: userId,
    start_date: startDate,
    end_date: endDate,
    reason: reason?.trim() ? reason.trim() : null,
    status: "Pending",
  });

  const saved = await repository.save(vacationRequest);
  await eventBus.emit(
    VACATION_REQUEST_CREATED,
    new VacationRequestCreatedEvent(saved)
  );

  return saved;
}
