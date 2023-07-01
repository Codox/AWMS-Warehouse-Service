import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DangerousGoodsService } from './dangerous-goods.service';
import { DangerousGoodsClassificationService } from './dangerous-goods-classification.service';
import { Roles } from 'nest-keycloak-connect';

@Controller('dangerous-goods')
@ApiTags('dangerous-goods')
@UseInterceptors(ClassSerializerInterceptor)
export class DangerousGoodsController {
  constructor(
    private readonly dangerousGoodsService: DangerousGoodsService,
    private readonly dangerousGoodsClassificationService: DangerousGoodsClassificationService,
  ) {}

  @Get('/')
  @Roles({ roles: ['realm:super_admin'] })
  @HttpCode(HttpStatus.OK)
  async getDangerousGoodsList() {
    return await this.dangerousGoodsService.getRepository().find({
      relations: ['classifications'],
    });
  }
}
