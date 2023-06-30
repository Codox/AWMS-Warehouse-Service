import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { ProductStatusRepository } from './product-status.repository';
import { ProductStatus } from './product-status.entity';

@Injectable()
export class ProductStatusService extends BaseService<ProductStatus> {
  constructor(
    private readonly productStatusRepository: ProductStatusRepository,
  ) {
    super(productStatusRepository);
  }
}
