import { registerHandlerRefs } from "commoneventframework";
import * as authHandlers from "../handlers/authHandlers";
import * as healthHandlers from "../handlers/healthHandlers";
import * as userHandlers from "../handlers/userHandlers";
import * as vacationHandlers from "../handlers/vacationHandlers";

export class HandlerRegistry {
  static register(): void {
    registerHandlerRefs({
      "handlers/healthHandlers#getHealth": healthHandlers.getHealth,
      "handlers/authHandlers#login": authHandlers.login,
      "handlers/authHandlers#me": authHandlers.me,
      "handlers/userHandlers#listUsers": userHandlers.listUsers,
      "handlers/vacationHandlers#listVacationRequests":
        vacationHandlers.listVacationRequests,
      "handlers/vacationHandlers#createVacationRequest":
        vacationHandlers.createVacationRequest,
      "handlers/vacationHandlers#listTeamVacationRequests":
        vacationHandlers.listTeamVacationRequests,
      "handlers/vacationHandlers#approveVacationRequest":
        vacationHandlers.approveVacationRequest,
      "handlers/vacationHandlers#rejectVacationRequest":
        vacationHandlers.rejectVacationRequest,
    });
  }
}

HandlerRegistry.register();
