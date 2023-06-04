import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { WarehouseRepository } from './warehouse.repository';
import { Warehouse } from './warehouse.entity';

@Injectable()
export class WarehouseService extends BaseService<Warehouse> {
  constructor(private readonly warehouseRepository: WarehouseRepository) {
    super(warehouseRepository);
  }

  getRepository() {
    return this.warehouseRepository;
  }
}
