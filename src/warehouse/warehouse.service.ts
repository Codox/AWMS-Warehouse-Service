import { BadRequestException, Injectable } from '@nestjs/common';
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

  async updateWarehouse(uuid: string, data: WarehouseDTO): Promise<Warehouse> {
    const existingWarehouse = await this.warehouseRepository.findOne({
      where: { uuid },
    });

    if (!existingWarehouse) {
      throw new BadRequestException(`Warehouse ${uuid} not found`);
    }

    const updatedWarehouse = Object.assign(
      {},
      existingWarehouse,
      data,
    ) as Warehouse;

    return await this.warehouseRepository.save(updatedWarehouse);
  }
}
