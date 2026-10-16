import { VacationRequest } from "../entities/VacationRequest";

export class VacationRequestCreatedEvent {
  readonly occurredAt = new Date();

  constructor(public readonly vacationRequest: VacationRequest) {}
}

export const VACATION_REQUEST_CREATED = "VacationRequestCreated";

export class VacationRequestApprovedEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly vacationRequest: VacationRequest,
    public readonly validatorId: string
  ) {}
}

export class VacationRequestRejectedEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly vacationRequest: VacationRequest,
    public readonly validatorId: string
  ) {}
}

export const VACATION_REQUEST_APPROVED = "VacationRequestApproved";
export const VACATION_REQUEST_REJECTED = "VacationRequestRejected";
