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
import { CompanyService } from '../../company/company.service';
import { FilterableData } from '../../shared/filterable-data';
import { Company } from '../../company/company.entity';
import { BaseResponse } from '../../shared/base.response';
import { Filterable } from '../../shared/filterable.decorator';
import { AuthenticatedUser, Roles } from 'nest-keycloak-connect';
import { CompanyDTO } from '../../company/dto/company.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CompanyCreatedEvent } from '../../company/events/company-created.event';
import { KeycloakUser } from '../../user/keycloak-user';

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
      },
      {
        field: 'code',
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
