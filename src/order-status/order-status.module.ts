import { Module } from '@nestjs/common';
import { OrderStatusService } from './order-status.service';
import { OrderStatusRepository } from './order-status.repository';
import { OrderStatusController } from './order-status.controller';
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
  controllers: [OrderStatusController],
  providers: [
    OrderStatusService,
    OrderStatusRepository,
    ...getEndpointProtectionProviders(),
  ],
  exports: [OrderStatusService],
})
export class OrderStatusModule {}
