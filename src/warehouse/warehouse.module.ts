import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseRepository } from './warehouse.repository';
import { WarehouseController } from './warehouse.controller';

@Module({
  controllers: [WarehouseController],
  providers: [WarehouseService, WarehouseRepository],
  exports: [WarehouseService],
})
export class WarehouseModule {}
