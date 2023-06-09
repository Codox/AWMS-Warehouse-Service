import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, Roles } from 'nest-keycloak-connect';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CompanyService } from './company.service';
import { Filterable } from '../shared/filterable.decorator';
import { FilterableData } from '../shared/filterable-data';
import { BaseResponse } from '../shared/base.response';
import { Company } from './company.entity';
import { CompanyDTO } from './dto/company.dto';
import { KeycloakUser } from '../user/keycloak-user';
import { CompanyCreatedEvent } from './events/company-created.event';

@Controller('company')
@ApiTags('company')
@UseInterceptors(ClassSerializerInterceptor)
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get('/')
  @Roles({ roles: ['realm:super_admin'] })
  @HttpCode(HttpStatus.OK)
  @ApiTags('company')
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,

    description: 'Company name',
  })
  @ApiQuery({
    name: 'code',
    type: String,
    required: false,
    description: 'Company code',
  })
  async getCompanies(
    @Filterable([
      {
        field: 'name',
        type: 'string',
      },
      {
        field: 'code',
        type: 'string',
      },
    ])
    filterable: FilterableData,
  ): Promise<BaseResponse<Company[]>> {
    return await this.companyService
      .getRepository()
      .queryWithFilterable(filterable);
  }

  @Get('/:uuid')
  @Roles({ roles: ['realm:super_admin'] })
  @HttpCode(HttpStatus.OK)
  @ApiTags('company')
  @ApiParam({
    name: 'uuid',
    type: String,
    required: true,

    description: 'Company UUID',
  })
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

  @Post('/')
  @Roles({ roles: ['realm:super_admin'] })
  @ApiTags('company')
  @HttpCode(HttpStatus.CREATED)
  async createCompany(
    @Body() data: CompanyDTO,
    @AuthenticatedUser() user: KeycloakUser,
  ) {
    const company: Company = await this.companyService.createCompany(data);

    this.eventEmitter.emit(
      'company.created',
      new CompanyCreatedEvent({
        companyUuid: company.uuid,
        userUuid: user.sub,
      }),
    );

    return {
      data: company,
    };
  }
}
