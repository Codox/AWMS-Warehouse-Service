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
import { PriorityStatusService } from './priority-status.service';
import { AuthenticatedUser, Roles } from 'nest-keycloak-connect';
import { Filterable } from '../shared/filterable.decorator';
import { FilterableData } from '../shared/filterable-data';
import { BaseResponse } from '../shared/base.response';
import { PriorityStatus } from './priority-status.entity';
import { PriorityStatusDTO } from './dto/priority-status.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PriorityStatusCreatedEvent } from './events/priority-status-created.event';
import { KeycloakUser } from '../user/keycloak-user';

@Controller('priority-status')
@ApiTags('priority-status')
@UseInterceptors(ClassSerializerInterceptor)
export class PriorityStatusController {
  constructor(
    private readonly priorityStatusService: PriorityStatusService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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

  @Get('/:uuid')
  @Roles({ roles: ['realm:super_admin'] })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'uuid',
    type: String,
    required: true,

    description: 'Priority Status UUID',
  })
  async getPriorityStatus(@Param('uuid') uuid: string) {
    const priorityStatus = await this.priorityStatusService
      .getRepository()
      .findOne({
        where: { uuid },
      });

    if (!priorityStatus) {
      throw new NotFoundException(`Priority Status ${uuid} not found`);
    }

    return {
      data: priorityStatus,
    };
  }

  @Post('/')
  @Roles({ roles: ['realm:super_admin'] })
  @HttpCode(HttpStatus.CREATED)
  async createPriorityStatus(
    @Body() data: PriorityStatusDTO,
    @AuthenticatedUser() user: KeycloakUser,
  ) {
    const priorityStatus: PriorityStatus =
      await this.priorityStatusService.createPriorityStatus(data);

    this.eventEmitter.emit(
      'priority-status.created',
      new PriorityStatusCreatedEvent({
        priorityStatusUuid: priorityStatus.uuid,
        userUuid: user.sub,
      }),
    );

    return {
      data: priorityStatus,
    };
  }
}
