import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { DangerousGoodsRepository } from './dangerous-goods.repository';
import { DangerousGoods } from './dangerous-goods.entity';

@Injectable()
export class DangerousGoodsService extends BaseService<DangerousGoods> {
  constructor(
    private readonly dangerousGoodsRepository: DangerousGoodsRepository,
  ) {
    super(dangerousGoodsRepository);
  }
}
