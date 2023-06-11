import { Module } from '@nestjs/common';
import { AuditListener } from './audit.listener';
import { AuditRepository } from './audit.repository';
import { AuditService } from './audit.service';
import { WarehouseModule } from '../warehouse/warehouse.module';

@Module({
  imports: [WarehouseModule],
  providers: [AuditListener, AuditRepository, AuditService],
  exports: [AuditService],
})
export class AuditModule {}
