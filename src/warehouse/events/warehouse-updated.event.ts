import { UpdatedEvent } from '../../shared/updated.event';

export class WarehouseUpdatedEvent extends UpdatedEvent {
  public readonly warehouseUuid: string;
  public readonly userUuid: string;

  constructor(data: { warehouseUuid: string; userUuid: string }) {
    super();

    this.warehouseUuid = data.warehouseUuid;
    this.userUuid = data.userUuid;
  }
}
