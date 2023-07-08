import { Module } from '@nestjs/common';
import { PriorityStatusRepository } from './priority-status.repository';
import { PriorityStatusService } from './priority-status.service';
import { PriorityStatusController } from './priority-status.controller';
import { DatabaseModule } from '../database/database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import {
  getEndpointProtectionProviders,
  getKeycloakConfiguration,
} from '../shared/endpoint-protection';

@Module({
  imports: [
    DatabaseModule,
    EventEmitterModule.forRoot(),
    getKeycloakConfiguration(),
  ],
  controllers: [PriorityStatusController],
  providers: [
    PriorityStatusService,
    PriorityStatusRepository,
    ...getEndpointProtectionProviders(),
  ],
  exports: [PriorityStatusService],
})
export class PriorityStatusModule {}
