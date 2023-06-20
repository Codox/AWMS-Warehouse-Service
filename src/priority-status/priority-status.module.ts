import { Module } from '@nestjs/common';
import { PriorityStatusRepository } from './priority-status.repository';

@Module({
  providers: [PriorityStatusRepository],
  exports: [],
})
export class PriorityStatusModule {}
