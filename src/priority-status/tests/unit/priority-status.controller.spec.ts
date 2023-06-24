import { PriorityStatusController } from '../../priority-status.controller';
import { PriorityStatusService } from '../../priority-status.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { PriorityStatusRepository } from '../../priority-status.repository';
import { PriorityStatus } from '../../priority-status.entity';
import { FilterableData } from '../../../shared/filterable-data';
import { faker } from '@faker-js/faker';
import { KeycloakUser } from '../../../user/keycloak-user';

describe('PriorityStatusController', () => {
  let controller: PriorityStatusController;
  let priorityStatusService: PriorityStatusService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriorityStatusController],
      providers: [
        PriorityStatusService,
        {
          provide: PriorityStatusRepository,
          useValue: {
            queryWithFilterable: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PriorityStatusController>(PriorityStatusController);
    priorityStatusService = module.get<PriorityStatusService>(
      PriorityStatusService,
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('GET /priority-status should resolve correctly - 200', async () => {
    const defaultPriorityStatuses: PriorityStatus[] = [
      new PriorityStatus({
        name: 'High',
        description:
          'This priority indicates that the task or issue requires immediate attention and should be addressed as soon as possible.',
        value: 3,
      }),
      new PriorityStatus({
        name: 'Normal',
        description:
          'This priority indicates that the task or issue is of standard importance and should be addressed within a reasonable timeframe.',
        value: 2,
      }),
      new PriorityStatus({
        name: 'Low',
        description:
          'This priority indicates that the task or issue has lower importance and can be addressed at a later time, if resources allow.',
        value: 1,
      }),
    ];

    const baseResponse = {
      data: defaultPriorityStatuses,
      count: defaultPriorityStatuses.length,
      page: 1,
      limit: 10,
    };

    jest
      .spyOn(priorityStatusService.getRepository(), 'queryWithFilterable')
      .mockImplementation(async () => baseResponse);

    const filterableData: FilterableData = {
      fields: [],
      page: 1,
      limit: 10,
    };

    const result = await controller.getPriorityStatuses(filterableData);

    expect(result).toEqual(baseResponse);
    expect(
      priorityStatusService.getRepository().queryWithFilterable,
    ).toHaveBeenCalledWith(filterableData);
  });

  it('GET /priority-status/:uuid should resolve correctly - 200', async () => {
    const priorityStatus: PriorityStatus = new PriorityStatus({
      name: 'High',
      description:
        'This priority indicates that the task or issue requires immediate attention and should be addressed as soon as possible.',
      value: 3,
    });

    const baseResponse = {
      data: priorityStatus,
    };

    jest
      .spyOn(priorityStatusService.getRepository(), 'findOne')
      .mockImplementation(async () => priorityStatus);

    const result = await controller.getPriorityStatus(priorityStatus.uuid);

    expect(result).toEqual(baseResponse);
    expect(priorityStatusService.getRepository().findOne).toHaveBeenCalledWith({
      where: { uuid: priorityStatus.uuid },
    });
  });

  it('GET /company/:uuid should not resolve (Not found) - 404', async () => {
    const uuid = faker.string.uuid();

    jest
      .spyOn(priorityStatusService.getRepository(), 'findOne')
      .mockImplementation(async () => undefined);

    await expect(controller.getPriorityStatus(uuid)).rejects.toThrow(
      `Priority Status ${uuid} not found`,
    );
    expect(priorityStatusService.getRepository().findOne).toHaveBeenCalledWith({
      where: { uuid },
    });
  });

  it('POST /company should resolve correctly - 201', async () => {
    const priorityStatus = new PriorityStatus({
      name: 'High',
      description: 'Very high priority',
      value: 3,
    });

    const user: KeycloakUser = {
      sub: faker.string.uuid(),
      email: faker.internet.email(),
    };

    const baseResponse = {
      data: priorityStatus,
    };

    jest
      .spyOn(priorityStatusService, 'createPriorityStatus')
      .mockImplementation(async () => priorityStatus);

    const result = await controller.createPriorityStatus(priorityStatus, user);

    expect(result).toEqual(baseResponse);
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'priority-status.created',
      expect.objectContaining({
        priorityStatusUuid: priorityStatus.uuid,
        userUuid: user.sub,
      }),
    );
  });
});
