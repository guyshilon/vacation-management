import { eventBus } from "./EventBus";
import {
  VACATION_REQUEST_APPROVED,
  VACATION_REQUEST_CREATED,
  VACATION_REQUEST_REJECTED,
  VacationRequestApprovedEvent,
  VacationRequestCreatedEvent,
  VacationRequestRejectedEvent,
} from "./vacationRequestEvents";

export function registerEventHandlers(): void {
  eventBus.on(VACATION_REQUEST_CREATED, (event) => {
    const { vacationRequest } = event as VacationRequestCreatedEvent;
    console.log(
      `[event] VacationRequestCreated id=${vacationRequest.id} user=${vacationRequest.user_id}`
    );
  });

  eventBus.on(VACATION_REQUEST_APPROVED, (event) => {
    const { vacationRequest, validatorId } = event as VacationRequestApprovedEvent;
    console.log(
      `[event] VacationRequestApproved id=${vacationRequest.id} by=${validatorId}`
    );
  });

  eventBus.on(VACATION_REQUEST_REJECTED, (event) => {
    const { vacationRequest, validatorId } = event as VacationRequestRejectedEvent;
    console.log(
      `[event] VacationRequestRejected id=${vacationRequest.id} by=${validatorId}`
    );
  });
}
