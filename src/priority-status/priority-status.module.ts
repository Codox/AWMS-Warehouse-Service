import { Module } from '@nestjs/common';
import { PriorityStatusRepository } from './priority-status.repository';
import { PriorityStatusService } from './priority-status.service';
import { PriorityStatusController } from './priority-status.controller';

@Module({
  controllers: [PriorityStatusController],
  providers: [PriorityStatusService, PriorityStatusRepository],
  exports: [PriorityStatusService],
})
export class PriorityStatusModule {}
