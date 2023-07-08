import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { OrderStatusService } from './order-status.service';
import { Roles } from 'nest-keycloak-connect';
import { OrderStatus } from './order-status.entity';

@Controller('order-status')
@ApiTags('order-status')
@UseInterceptors(ClassSerializerInterceptor)
export class OrderStatusController {
  constructor(private readonly orderStatusService: OrderStatusService) {}

  @Get('/')
  @Roles({ roles: ['realm:super_admin'] })
  @HttpCode(HttpStatus.OK)
  async getOrderStatuses(): Promise<{ data: OrderStatus[] }> {
    return { data: await this.orderStatusService.getAll() };
  }

  @Get('/:uuid')
  @Roles({ roles: ['realm:super_admin'] })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'uuid',
    type: String,
    required: true,

    description: 'Order Status UUID',
  })
  async getOrderStatus(@Param('uuid') uuid: string) {
    const orderStatus = await this.orderStatusService.getRepository().findOne({
      where: { uuid },
    });

    if (!orderStatus) {
      throw new NotFoundException(`Order Status ${uuid} not found`);
    }

    return {
      data: orderStatus,
    };
  }
}
