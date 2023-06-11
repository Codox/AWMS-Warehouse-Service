import { CreatedEvent } from '../../shared/created.event';

export class CompanyCreatedEvent extends CreatedEvent {
  public readonly companyUuid: string;
  public readonly userUuid: string;

  constructor(data: { companyUuid: string; userUuid: string }) {
    super();

    this.companyUuid = data.companyUuid;
    this.userUuid = data.userUuid;
  }
}
