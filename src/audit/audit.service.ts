import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { Audit } from './audit.entity';
import { AuditRepository } from './audit.repository';

@Injectable()
export class AuditService extends BaseService<Audit> {
  constructor(private readonly auditRepository: AuditRepository) {
    super(auditRepository);
  }

  async createAuditEntry(data: Partial<Audit>): Promise<Audit> {
    const audit = new Audit(data);

    return await this.auditRepository.save(audit);
  }
}
