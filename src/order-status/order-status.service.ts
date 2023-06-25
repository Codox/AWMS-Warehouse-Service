import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { OrderStatus } from './order-status.entity';
import { OrderStatusRepository } from './order-status.repository';

@Injectable()
export class OrderStatusService extends BaseService<OrderStatus> {
  constructor(private readonly orderStatusRepository: OrderStatusRepository) {
    super(orderStatusRepository);
  }
}
