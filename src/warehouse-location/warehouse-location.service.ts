import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { Location } from './warehouse-location.entity';
import { WarehouseLocationRepository } from './warehouse-location.repository';

@Injectable()
export class WarehouseLocationService extends BaseService<Location> {
  constructor(private readonly locationRepository: WarehouseLocationRepository) {
    super(locationRepository);
  }

  getRepository() {
    return this.locationRepository;
  }
}
