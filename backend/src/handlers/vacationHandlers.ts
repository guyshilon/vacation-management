import { Response } from "commoneventframework";
import { ApproveVacationRequestCommand } from "../commands/ApproveVacationRequestCommand";
import { CreateVacationRequestCommand } from "../commands/CreateVacationRequestCommand";
import { handleCreateVacationRequest } from "../commands/createVacationRequestHandler";
import { RejectVacationRequestCommand } from "../commands/RejectVacationRequestCommand";
import {
  handleApproveVacationRequest,
  handleRejectVacationRequest,
} from "../commands/reviewVacationRequestHandler";
import { AppError } from "../errors/AppError";
import { getAuthUser, requireRole } from "../http/authFromEvent";
import { asString, parseJsonBody } from "../http/parseBody";
import { wrapHandler } from "../http/wrapHandler";
import {
  listTeamVacationRequests as fetchTeamVacationRequests,
  listVacationRequests as fetchVacationRequests,
} from "../queries/listVacationRequests";
import { toPublicVacationRequest } from "../utils/vacationRequestPublic";
import { HandlerFn } from "./types";

export const createVacationRequest: HandlerFn = wrapHandler(async (_input, event) => {
  const authUser = getAuthUser(event);
  requireRole(authUser, "Requester");

  const body = parseJsonBody(event);
  const startDate = asString(body.start_date);
  const endDate = asString(body.end_date);
  const reason = asString(body.reason) || undefined;

  if (!startDate || !endDate) {
    throw new AppError(400, "start_date and end_date are required.");
  }

  const created = await handleCreateVacationRequest(
    new CreateVacationRequestCommand(authUser.userId, startDate, endDate, reason)
  );

  return new Response(201, {
    vacationRequest: toPublicVacationRequest(created),
  });
});

export const listVacationRequests: HandlerFn = wrapHandler(
  async (_input, event) => {
    const authUser = getAuthUser(event);
    const query = event.queryStringParameters ?? {};

    return fetchVacationRequests({
      authUser,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      status: query.status,
      userId: query.user_id,
    });
  }
);

export const listTeamVacationRequests: HandlerFn = wrapHandler(
  async (_input, event) => {
    getAuthUser(event);
    return fetchTeamVacationRequests();
  }
);

export const approveVacationRequest: HandlerFn = wrapHandler(async (_input, event) => {
  const authUser = getAuthUser(event);
  requireRole(authUser, "Validator");

  const id = event.pathParameters?.id;
  if (!id) {
    throw new AppError(400, "Missing request id.");
  }

  const updated = await handleApproveVacationRequest(
    new ApproveVacationRequestCommand(id, authUser.userId)
  );

  return { vacationRequest: toPublicVacationRequest(updated) };
});

export const rejectVacationRequest: HandlerFn = wrapHandler(async (_input, event) => {
  const authUser = getAuthUser(event);
  requireRole(authUser, "Validator");

  const id = event.pathParameters?.id;
  if (!id) {
    throw new AppError(400, "Missing request id.");
  }

  const comments = asString(parseJsonBody(event).comments);
  const updated = await handleRejectVacationRequest(
    new RejectVacationRequestCommand(id, authUser.userId, comments)
  );

  return { vacationRequest: toPublicVacationRequest(updated) };
});
