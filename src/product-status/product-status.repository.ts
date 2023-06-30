import { BaseRepository } from '../shared/base.repository';
import { ProductStatus } from './product-status.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ProductStatusRepository extends BaseRepository<ProductStatus> {
  constructor(private dataSource: DataSource) {
    super(ProductStatus, dataSource.createEntityManager());
  }
}
