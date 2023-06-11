import { CreatedEvent } from '../../shared/created.event';

export class WarehouseCreatedEvent extends CreatedEvent {
  public readonly warehouseUuid: string;
  public readonly userUuid: string;

  constructor(data: { warehouseUuid: string; userUuid: string }) {
    super();

    this.warehouseUuid = data.warehouseUuid;
    this.userUuid = data.userUuid;
  }
}
