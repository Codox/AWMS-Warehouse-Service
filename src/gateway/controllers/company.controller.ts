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
import { ApiTags } from '@nestjs/swagger';
import { CompanyService } from '../../company/company.service';
import { FilterableData } from '../../shared/filterable-data';
import { Company } from '../../company/company.entity';
import { BaseResponse } from '../../shared/base.response';
import { Filterable } from '../../shared/filterable.decorator';
import { Roles } from 'nest-keycloak-connect';

@Controller('company')
@ApiTags('company')
@UseInterceptors(ClassSerializerInterceptor)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('/')
  @Roles({ roles: ['realm:super_admin'] })
  @HttpCode(HttpStatus.OK)
  async getCompanies(
    @Filterable(['name', 'code'])
    filterable: FilterableData,
  ): Promise<BaseResponse<Company[]>> {
    return await this.companyService
      .getRepository()
      .queryWithFilterable(filterable);
  }

  @Get('/:uuid')
  @Roles({ roles: ['realm:super_admin'] })
  @HttpCode(HttpStatus.OK)
  async getCompany(@Param('uuid') uuid: string) {
    const company = await this.companyService.getRepository().findOne({
      where: { uuid },
    });

    if (!company) {
      throw new NotFoundException(`Company ${uuid} not found`);
    }

    return {
      data: company,
    };
  }
}
