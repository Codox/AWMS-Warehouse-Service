import { Module } from '@nestjs/common';
import { AuditListener } from './audit.listener';
import { AuditRepository } from './audit.repository';
import { AuditService } from './audit.service';

@Module({
  providers: [AuditListener, AuditRepository],
  exports: [AuditService],
})
export class AuditModule {}
