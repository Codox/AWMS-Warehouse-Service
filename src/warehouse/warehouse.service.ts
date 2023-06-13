import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { WarehouseRepository } from './warehouse.repository';
import { Warehouse } from './warehouse.entity';
import { WarehouseDTO } from './dto/warehouse.dto';

@Injectable()
export class WarehouseService extends BaseService<Warehouse> {
  constructor(private readonly warehouseRepository: WarehouseRepository) {
    super(warehouseRepository);
  }

  async createWarehouse(data: WarehouseDTO): Promise<Warehouse> {
    let warehouse = new Warehouse(data);

    warehouse = await this.warehouseRepository.save(warehouse);

    return warehouse;
  }
}
