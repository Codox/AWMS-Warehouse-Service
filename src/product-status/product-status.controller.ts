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
import { ProductStatusService } from './product-status.service';
import { Roles } from 'nest-keycloak-connect';
import { ProductStatus } from './product-status.entity';

@Controller('product-status')
@ApiTags('product-status')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductStatusController {
  constructor(private readonly productStatusService: ProductStatusService) {}

  @Get('/')
  @Roles({ roles: ['realm:super_admin'] })
  @HttpCode(HttpStatus.OK)
  async getProductStatuses(): Promise<ProductStatus[]> {
    return await this.productStatusService.getRepository().find();
  }

  @Get('/:uuid')
  @Roles({ roles: ['realm:super_admin'] })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'uuid',
    type: String,
    required: true,

    description: 'Product Status UUID',
  })
  async getProductStatus(@Param('uuid') uuid: string) {
    const productStatus = await this.productStatusService
      .getRepository()
      .findOne({
        where: { uuid },
      });

    if (!productStatus) {
      throw new NotFoundException(`Product Status ${uuid} not found`);
    }

    return {
      data: productStatus,
    };
  }
}
