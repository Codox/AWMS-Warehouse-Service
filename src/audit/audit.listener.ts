import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WarehouseCreatedEvent } from '../warehouse/events/warehouse-created.event';
import { WarehouseService } from '../warehouse/warehouse.service';
import { AuditService } from './audit.service';
import { Warehouse } from '../warehouse/warehouse.entity';
import { CompanyCreatedEvent } from '../company/events/company-created.event';
import { CompanyService } from '../company/company.service';
import { Company } from '../company/company.entity';
import { PriorityStatusCreatedEvent } from '../priority-status/events/priority-status-created.event';
import { PriorityStatusService } from '../priority-status/priority-status.service';
import { PriorityStatus } from '../priority-status/priority-status.entity';
import { PriorityStatusUpdatedEvent } from '../priority-status/events/priority-status-updated.event';

@Injectable()
export class AuditListener {
  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly companyService: CompanyService,
    private readonly priorityStatusService: PriorityStatusService,
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

  @OnEvent('company.created', { async: true })
  async handleCompanyCreatedEvent(data: CompanyCreatedEvent) {
    const company: Company = await this.companyService.getOne(data.companyUuid);

    await this.auditService.createAuditEntry({
      recordId: company.id,
      type: Company.name,
      action: data.type,
      oldData: null,
      newData: company,
      userUuid: data.userUuid,
      timestamp: data.createdAt,
    });
  }

  @OnEvent('priority-status.created', { async: true })
  async handlePriorityStatusCreatedEvent(data: PriorityStatusCreatedEvent) {
    const priorityStatus = await this.priorityStatusService.getOne(
      data.priorityStatusUuid,
    );

    await this.auditService.createAuditEntry({
      recordId: priorityStatus.id,
      type: PriorityStatus.name,
      action: data.type,
      oldData: null,
      newData: priorityStatus,
      userUuid: data.userUuid,
      timestamp: data.createdAt,
    });
  }

  @OnEvent('priority-status.updated', { async: true })
  async handlePriorityStatusUpdatedEvent(data: PriorityStatusUpdatedEvent) {
    const oldData = data.oldPriorityStatus;
    const newData = data.newPriorityStatus;

    await this.auditService.createAuditEntry({
      recordId: newData.id,
      type: PriorityStatus.name,
      action: data.type,
      oldData,
      newData,
      userUuid: data.userUuid,
      timestamp: data.createdAt,
    });
  }
}
