import { Module } from '@nestjs/common';
import { AuditListener } from './audit.listener';
import { AuditRepository } from './audit.repository';
import { AuditService } from './audit.service';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { CompanyModule } from '../company/company.module';
import { PriorityStatusModule } from '../priority-status/priority-status.module';

@Module({
  imports: [WarehouseModule, CompanyModule, PriorityStatusModule],
  providers: [AuditListener, AuditRepository, AuditService],
  exports: [AuditService],
})
export class AuditModule {}
