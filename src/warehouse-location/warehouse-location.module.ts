import { Module } from '@nestjs/common';
import { WarehouseLocationService } from './warehouse-location.service';
import { WarehouseLocationRepository } from './warehouse-location.repository';

@Module({
  imports: [],
  providers: [WarehouseLocationService, WarehouseLocationRepository],
  exports: [WarehouseLocationService],
})
export class WarehouseLocationModule {}
