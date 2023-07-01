import { BaseRepository } from '../shared/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DangerousGoods } from './dangerous-goods.entity';

@Injectable()
export class DangerousGoodsRepository extends BaseRepository<DangerousGoods> {
  constructor(private dataSource: DataSource) {
    super(DangerousGoods, dataSource.createEntityManager());
  }
}
