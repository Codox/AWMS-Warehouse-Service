import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { DangerousGoodsClassification } from './dangerous-goods-classification.entity';
import { DangerousGoodsClassificationRepository } from './dangerous-goods-classification.repository';

@Injectable()
export class DangerousGoodsClassificationService extends BaseService<DangerousGoodsClassification> {
  constructor(
    private readonly dangerousGoodsClassificationRepository: DangerousGoodsClassificationRepository,
  ) {
    super(dangerousGoodsClassificationRepository);
  }
}
