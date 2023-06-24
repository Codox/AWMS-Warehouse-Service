import { UpdatedEvent } from '../../shared/updated.event';
import { PriorityStatus } from '../priority-status.entity';

export class PriorityStatusUpdatedEvent extends UpdatedEvent {
  public readonly priorityStatusUuid: string;
  public readonly userUuid: string;
  public readonly oldPriorityStatus: PriorityStatus;
  public readonly newPriorityStatus: PriorityStatus;

  constructor(data: {
    priorityStatusUuid: string;
    userUuid: string;
    oldPriorityStatus: PriorityStatus;
    newPriorityStatus: PriorityStatus;
  }) {
    super();

    this.priorityStatusUuid = data.priorityStatusUuid;
    this.userUuid = data.userUuid;
    this.oldPriorityStatus = data.oldPriorityStatus;
    this.newPriorityStatus = data.newPriorityStatus;
  }
}
