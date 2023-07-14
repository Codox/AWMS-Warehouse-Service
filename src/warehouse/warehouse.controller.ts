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
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, Roles } from 'nest-keycloak-connect';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WarehouseService } from './warehouse.service';
import { Filterable } from '../shared/filterable.decorator';
import { FilterableData } from '../shared/filterable-data';
import { BaseResponse } from '../shared/base.response';
import { Warehouse } from './warehouse.entity';
import { WarehouseDTO } from './dto/warehouse.dto';
import { KeycloakUser } from '../user/keycloak-user';
import { WarehouseCreatedEvent } from './events/warehouse-created.event';
import { WarehouseUpdatedEvent } from './events/warehouse-updated.event';

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
        field: 'town',
        type: 'string',
      },
      {
        field: 'city',
        type: 'string',
      },
      {
        field: 'region',
        type: 'string',
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

  @Put('/:uuid')
  @Roles({ roles: ['realm:super_admin'] })
  @HttpCode(HttpStatus.OK)
  async updateWarehouse(
    @Param('uuid') uuid: string,
    @Body() data: WarehouseDTO,
    @AuthenticatedUser() user: KeycloakUser,
  ): Promise<{ data: Warehouse }> {
    const warehouse = await this.warehouseService.updateWarehouse(uuid, data);

    this.eventEmitter.emit(
      'warehouse.updated',
      new WarehouseUpdatedEvent({
        warehouseUuid: warehouse.uuid,
        userUuid: user.sub,
      }),
    );

    return {
      data: warehouse,
    };
  }
}
