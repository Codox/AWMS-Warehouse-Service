import { BaseRepository } from '../shared/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Audit } from './audit.entity';

@Injectable()
export class AuditRepository extends BaseRepository<Audit> {
  constructor(private dataSource: DataSource) {
    super(Audit, dataSource.createEntityManager());
  }
}
