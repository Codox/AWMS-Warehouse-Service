import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { PriorityStatus } from './priority-status.entity';
import { PriorityStatusRepository } from './priority-status.repository';

@Injectable()
export class PriorityStatusService extends BaseService<PriorityStatus> {
  constructor(
    private readonly priorityStatusRepository: PriorityStatusRepository,
  ) {
    super(priorityStatusRepository);
  }
}
