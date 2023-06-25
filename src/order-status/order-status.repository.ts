import { BaseRepository } from '../shared/base.repository';
import { OrderStatus } from './order-status.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class OrderStatusRepository extends BaseRepository<OrderStatus> {
  constructor(private dataSource: DataSource) {
    super(OrderStatus, dataSource.createEntityManager());
  }
}
