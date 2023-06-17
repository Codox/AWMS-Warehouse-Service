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
import { AuthenticatedUser, Roles } from 'nest-keycloak-connect';
import { Filterable } from '../../shared/filterable.decorator';
import { FilterableData } from '../../shared/filterable-data';
import { BaseResponse } from '../../shared/base.response';
import { Warehouse } from '../../warehouse/warehouse.entity';
import { WarehouseDTO } from '../../warehouse/dto/warehouse.dto';
import { KeycloakUser } from '../../user/keycloak-user';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WarehouseCreatedEvent } from '../../warehouse/events/warehouse-created.event';

@Controller('warehouse')
@ApiTags('warehouse')
@UseInterceptors(ClassSerializerInterceptor)
export class WarehouseController {
  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get('/')
  @Roles({ roles: ['realm:super_admin'] })
  @HttpCode(HttpStatus.OK)
  async getWarehouses(
    @Filterable([
      {
        field: 'name',
        type: 'string',
      },
      {
        field: 'contactTelephone',
        type: 'string',
      },
      {
        field: 'addressLines',
        type: 'array',
      },
      {
        field: 'zipCode',
        type: 'string',
      },
      {
        field: 'country',
        type: 'string',
      },
    ])
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
    @AuthenticatedUser() user: KeycloakUser,
  ): Promise<{ data: Warehouse }> {
    const warehouse = await this.warehouseService.createWarehouse(data);

    this.eventEmitter.emit(
      'warehouse.created',
      new WarehouseCreatedEvent({
        warehouseUuid: warehouse.uuid,
        userUuid: user.sub,
      }),
    );

    return {
      data: warehouse,
    };
  }
}
