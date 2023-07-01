import { Module } from '@nestjs/common';
import { DangerousGoodsRepository } from './dangerous-goods.repository';
import { DangerousGoodsClassificationRepository } from './dangerous-goods-classification.repository';
import { DangerousGoodsService } from './dangerous-goods.service';
import { DangerousGoodsClassificationService } from './dangerous-goods-classification.service';

@Module({
  controllers: [],
  providers: [
    DangerousGoodsRepository,
    DangerousGoodsClassificationRepository,
    DangerousGoodsService,
    DangerousGoodsClassificationService,
  ],
  exports: [DangerousGoodsService, DangerousGoodsClassificationService],
})
export class DangerousGoodsModule {}
