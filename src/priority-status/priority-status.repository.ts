import { BaseRepository } from '../shared/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PriorityStatus } from "./priority-status.entity";

@Injectable()
export class PriorityStatusRepository extends BaseRepository<PriorityStatus> {
  constructor(private dataSource: DataSource) {
    super(PriorityStatus, dataSource.createEntityManager());
  }
}
