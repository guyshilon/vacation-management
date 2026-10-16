export class ApproveVacationRequestCommand {
  constructor(
    public readonly vacationRequestId: string,
    public readonly validatorId: string
  ) {}
}
