import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { Location } from './location.entity';
import { LocationRepository } from './location.repository';

@Injectable()
export class LocationService extends BaseService<Location> {
  constructor(private readonly locationRepository: LocationRepository) {
    super(locationRepository);
  }

  getRepository() {
    return this.locationRepository;
  }
}
