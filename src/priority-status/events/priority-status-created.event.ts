import { CreatedEvent } from '../../shared/created.event';

export class PriorityStatusCreatedEvent extends CreatedEvent {
  public readonly priorityStatusUuid: string;
  public readonly userUuid: string;

  constructor(data: { priorityStatusUuid: string; userUuid: string }) {
    super();

    this.priorityStatusUuid = data.priorityStatusUuid;
    this.userUuid = data.userUuid;
  }
}
