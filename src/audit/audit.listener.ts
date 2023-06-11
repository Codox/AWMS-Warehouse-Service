import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WarehouseCreatedEvent } from '../warehouse/events/warehouse-created.event';

@Injectable()
export class AuditListener {
  @OnEvent('warehouse.created', { async: true })
  async handleWarehouseCreatedEvent(data: WarehouseCreatedEvent) {

  }
}
