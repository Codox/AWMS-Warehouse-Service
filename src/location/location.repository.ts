import { BaseRepository } from '../shared/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Location } from './location.entity';

@Injectable()
export class LocationRepository extends BaseRepository<Location> {
  constructor(private dataSource: DataSource) {
    super(Location, dataSource.createEntityManager());
  }
}
