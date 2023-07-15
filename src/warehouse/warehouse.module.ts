import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseRepository } from './warehouse.repository';
import { WarehouseController } from './warehouse.controller';
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
  controllers: [WarehouseController],
  providers: [
    WarehouseService,
    WarehouseRepository,
    ...getEndpointProtectionProviders(),
  ],
  exports: [WarehouseService],
})
export class WarehouseModule {}
