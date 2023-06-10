import { CreatedEvent } from '../../shared/created.event';

export class WarehouseCreatedEvent extends CreatedEvent {
  private readonly warehouseUuid: string;
  private readonly userId: string;

  constructor(data: { warehouseUuid: string; userId: string }) {
    super();

    this.warehouseUuid = data.warehouseUuid;
    this.userId = data.userId;
  }
}
