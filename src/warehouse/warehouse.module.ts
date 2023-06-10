import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseRepository } from './warehouse.repository';

@Module({
  providers: [WarehouseService, WarehouseRepository],
  exports: [WarehouseService],
})
export class WarehouseModule {}
