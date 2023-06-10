import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { Roles } from 'nest-keycloak-connect';
import { Filterable } from '../../shared/filterable.decorator';
import { FilterableData } from '../../shared/filterable-data';
import { BaseResponse } from '../../shared/base.response';
import { Warehouse } from '../../warehouse/warehouse.entity';
import { WarehouseDTO } from '../../warehouse/warehouse.dto';

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

  @Get('/:uuid')
  @Roles({ roles: ['realm:super_admin'] })
  @HttpCode(HttpStatus.OK)
  @ApiTags('warehouse')
  @ApiParam({
    name: 'uuid',
    type: String,
    required: true,

    description: 'Warehouse UUID',
  })
  async getWarehouse(@Param('uuid') uuid: string) {
    const warehouse = await this.warehouseService.getRepository().findOne({
      where: { uuid },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse ${uuid} not found`);
    }

    return {
      data: warehouse,
    };
  }

  @Post('/')
  @Roles({ roles: ['realm:super_admin'] })
  @HttpCode(HttpStatus.CREATED)
  async createWarehouse(
    @Body() data: WarehouseDTO,
  ): Promise<{ data: Warehouse }> {
    return {
      data: await this.warehouseService.createWarehouse(data),
    };
  }
}
