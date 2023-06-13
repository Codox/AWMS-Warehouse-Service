import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { WarehouseLocationRepository } from './warehouse-location.repository';
import { WarehouseLocation } from './warehouse-location.entity';

@Injectable()
export class WarehouseLocationService extends BaseService<WarehouseLocation> {
  constructor(
    private readonly locationRepository: WarehouseLocationRepository,
  ) {
    super(locationRepository);
  }
}
