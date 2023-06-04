import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { Roles } from 'nest-keycloak-connect';
import { Filterable } from '../../shared/filterable.decorator';
import { FilterableData } from '../../shared/filterable-data';
import { BaseResponse } from '../../shared/base.response';
import { Warehouse } from '../../warehouse/warehouse.entity';

@Controller('warehouse')
@ApiTags('warehouse')
@UseInterceptors(ClassSerializerInterceptor)
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get('/')
  @Roles({ roles: ['realm:super_admin'] })
  @HttpCode(HttpStatus.OK)
  async getWarehouses(
    @Filterable(['name'])
    filterable: FilterableData,
  ): Promise<BaseResponse<Warehouse[]>> {
    return await this.warehouseService
      .getRepository()
      .queryWithFilterable(filterable);
  }
}
