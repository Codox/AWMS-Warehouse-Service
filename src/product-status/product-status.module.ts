import { Module } from '@nestjs/common';
import { ProductStatusService } from './product-status.service';
import { ProductStatusRepository } from './product-status.repository';
import { ProductStatusController } from './product-status.controller';

@Module({
  controllers: [ProductStatusController],
  providers: [ProductStatusService, ProductStatusRepository],
  exports: [ProductStatusService],
})
export class ProductStatusModule {}
