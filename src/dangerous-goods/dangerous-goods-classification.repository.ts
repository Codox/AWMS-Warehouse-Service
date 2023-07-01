import { BaseRepository } from '../shared/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DangerousGoodsClassification } from './dangerous-goods-classification.entity';

@Injectable()
export class DangerousGoodsClassificationRepository extends BaseRepository<DangerousGoodsClassification> {
  constructor(private dataSource: DataSource) {
    super(DangerousGoodsClassification, dataSource.createEntityManager());
  }
}
