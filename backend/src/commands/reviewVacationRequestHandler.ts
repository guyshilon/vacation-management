import { AppDataSource } from "../config/database";
import { VacationRequest } from "../entities/VacationRequest";
import { AppError } from "../errors/AppError";
import { eventBus } from "../events/EventBus";
import {
  VACATION_REQUEST_APPROVED,
  VACATION_REQUEST_REJECTED,
  VacationRequestApprovedEvent,
  VacationRequestRejectedEvent,
} from "../events/vacationRequestEvents";
import { ApproveVacationRequestCommand } from "./ApproveVacationRequestCommand";
import { RejectVacationRequestCommand } from "./RejectVacationRequestCommand";

async function getPendingRequest(id: string): Promise<VacationRequest> {
  const repository = AppDataSource.getRepository(VacationRequest);
  const request = await repository.findOne({
    where: { id },
    relations: { user: true },
  });

  if (!request) {
    throw new AppError(404, "Vacation request not found.");
  }

  if (request.status === "Approved") {
    throw new AppError(400, "Approved requests cannot be modified.");
  }

  if (request.status !== "Pending") {
    throw new AppError(400, "Only pending requests can be reviewed.");
  }

  return request;
}

export async function handleApproveVacationRequest(
  command: ApproveVacationRequestCommand
): Promise<VacationRequest> {
  const request = await getPendingRequest(command.vacationRequestId);
  request.status = "Approved";
  const saved = await AppDataSource.getRepository(VacationRequest).save(request);

  await eventBus.emit(
    VACATION_REQUEST_APPROVED,
    new VacationRequestApprovedEvent(saved, command.validatorId)
  );

  return saved;
}

export async function handleRejectVacationRequest(
  command: RejectVacationRequestCommand
): Promise<VacationRequest> {
  const comments = command.comments.trim();
  if (!comments) {
    throw new AppError(400, "A rejection comment is required.");
  }

  const request = await getPendingRequest(command.vacationRequestId);
  request.status = "Rejected";
  request.comments = comments;
  const saved = await AppDataSource.getRepository(VacationRequest).save(request);

  await eventBus.emit(
    VACATION_REQUEST_REJECTED,
    new VacationRequestRejectedEvent(saved, command.validatorId)
  );

  return saved;
}
