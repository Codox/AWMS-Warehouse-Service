import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { PriorityStatusService } from './priority-status.service';
import { Roles } from 'nest-keycloak-connect';
import { Filterable } from '../shared/filterable.decorator';
import { FilterableData } from '../shared/filterable-data';
import { BaseResponse } from '../shared/base.response';
import { PriorityStatus } from './priority-status.entity';

@Controller('priority-status')
@ApiTags('priority-status')
@UseInterceptors(ClassSerializerInterceptor)
export class PriorityStatusController {
  constructor(private readonly priorityStatusService: PriorityStatusService) {}

  @Get('/')
  @Roles({ roles: ['realm:super_admin'] })
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,

    description: 'Priority status name',
  })
  @ApiQuery({
    name: 'value',
    type: Number,
    required: false,

    description: 'Priority status value',
  })
  async getPriorityStatuses(
    @Filterable([
      {
        field: 'name',
        type: 'string',
      },
      {
        field: 'value',
        type: 'number',
      },
    ])
    filterable: FilterableData,
  ): Promise<BaseResponse<PriorityStatus[]>> {
    return await this.priorityStatusService
      .getRepository()
      .queryWithFilterable(filterable);
  }
}
