export class RejectVacationRequestCommand {
  constructor(
    public readonly vacationRequestId: string,
    public readonly validatorId: string,
    public readonly comments: string
  ) {}
}
