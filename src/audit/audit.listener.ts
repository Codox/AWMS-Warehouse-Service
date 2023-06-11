import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WarehouseCreatedEvent } from '../warehouse/events/warehouse-created.event';
import { WarehouseService } from '../warehouse/warehouse.service';
import { AuditService } from './audit.service';
import { Warehouse } from '../warehouse/warehouse.entity';

@Injectable()
export class AuditListener {
  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly auditService: AuditService,
  ) {}

  @OnEvent('warehouse.created', { async: true })
  async handleWarehouseCreatedEvent(data: WarehouseCreatedEvent) {
    const warehouse: Warehouse = await this.warehouseService.getOne(
      data.warehouseUuid,
    );

    await this.auditService.createAuditEntry({
      recordId: warehouse.id,
      type: Warehouse.name,
      action: data.type,
      oldData: null,
      newData: warehouse,
      userUuid: data.userUuid,
      timestamp: data.createdAt,
    });
  }
}
