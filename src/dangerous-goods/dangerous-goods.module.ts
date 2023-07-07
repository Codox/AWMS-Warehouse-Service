import { Module } from '@nestjs/common';
import { DangerousGoodsRepository } from './dangerous-goods.repository';
import { DangerousGoodsClassificationRepository } from './dangerous-goods-classification.repository';
import { DangerousGoodsService } from './dangerous-goods.service';
import { DangerousGoodsClassificationService } from './dangerous-goods-classification.service';
import { DangerousGoodsController } from './dangerous-goods.controller';
import { DatabaseModule } from '../database/database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import {
  getEndpointProtectionProviders,
  getKeycloakConfiguration,
} from '../shared/endpoint-protection';

@Module({
  imports: [
    DatabaseModule,
    EventEmitterModule.forRoot(),
    getKeycloakConfiguration(),
  ],
  controllers: [DangerousGoodsController],
  providers: [
    DangerousGoodsRepository,
    DangerousGoodsClassificationRepository,
    DangerousGoodsService,
    DangerousGoodsClassificationService,
    ...getEndpointProtectionProviders(),
  ],
  exports: [DangerousGoodsService, DangerousGoodsClassificationService],
})
export class DangerousGoodsModule {}
