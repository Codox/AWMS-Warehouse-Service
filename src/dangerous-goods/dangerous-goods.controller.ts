import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
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

  @Get('/:uuid')
  @Roles({ roles: ['realm:super_admin'] })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'uuid',
    type: String,
    required: true,

    description: 'Dangerous Goods UUID',
  })
  async getDangerousGoods(@Param('uuid') uuid: string) {
    const dangerousGoods = await this.dangerousGoodsService
      .getRepository()
      .findOne({
        where: { uuid },
        relations: ['classifications'],
      });

    if (!dangerousGoods) {
      throw new NotFoundException(`Dangerous Goods ${uuid} not found`);
    }

    return {
      data: dangerousGoods,
    };
  }
}
