import { Module } from '@nestjs/common';
import { OrderStatusService } from './order-status.service';
import { OrderStatusRepository } from './order-status.repository';
import { OrderStatusController } from './order-status.controller';

@Module({
  controllers: [OrderStatusController],
  providers: [OrderStatusService, OrderStatusRepository],
  exports: [OrderStatusService],
})
export class OrderStatusModule {}
