import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseLocationService } from './warehouse-location.service';
import { WarehouseLocationRepository } from './warehouse-location.repository';
import { WarehouseLocation } from './warehouse-location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseLocation])],
  providers: [WarehouseLocationService, WarehouseLocationRepository],
  exports: [WarehouseLocationService],
})
export class WarehouseLocationModule {}
