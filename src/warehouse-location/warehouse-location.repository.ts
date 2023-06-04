import { BaseRepository } from '../shared/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { WarehouseLocation } from './warehouse-location.entity';

@Injectable()
export class WarehouseLocationRepository extends BaseRepository<WarehouseLocation> {
  constructor(private dataSource: DataSource) {
    super(WarehouseLocation, dataSource.createEntityManager());
  }
}
