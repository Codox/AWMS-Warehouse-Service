import { Module } from '@nestjs/common';
import { ProductStatusService } from './product-status.service';
import { ProductStatusRepository } from './product-status.repository';
import { ProductStatusController } from './product-status.controller';
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
  controllers: [ProductStatusController],
  providers: [
    ProductStatusService,
    ProductStatusRepository,
    ...getEndpointProtectionProviders(),
  ],
  exports: [ProductStatusService],
})
export class ProductStatusModule {}
