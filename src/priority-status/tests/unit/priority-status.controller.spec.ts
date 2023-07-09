import { PriorityStatusController } from '../../priority-status.controller';
import { PriorityStatusService } from '../../priority-status.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { PriorityStatusRepository } from '../../priority-status.repository';
import { PriorityStatus } from '../../priority-status.entity';
import { faker } from '@faker-js/faker';
import { KeycloakUser } from '../../../user/keycloak-user';
import {
  createKeycloakUser,
  expectEventEmitted,
  expectExceptionToBeThrown,
  expectFilterableCalledCorrectly,
  expectFilterableResponseToBeCorrect,
  expectFindOneCalledWithUUID,
  expectResponseToBeCorrect,
  mockFindOne,
  mockQueryWithFilterable,
} from '../../../shared/test/unit-test-utilities';
import { NotFoundException } from '@nestjs/common';

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

    mockQueryWithFilterable(
      priorityStatusService.getRepository(),
      defaultPriorityStatuses,
      5,
      10,
    );

    const result = await controller.getPriorityStatuses({
      fields: [],
      page: 5,
      limit: 10,
    });

    expectFilterableCalledCorrectly(
      result,
      priorityStatusService.getRepository(),
      {
        fields: [],
        page: 5,
        limit: 10,
      },
    );
    expectFilterableResponseToBeCorrect(result, defaultPriorityStatuses, 5, 10);
  });

  it('GET /priority-status/:uuid should resolve correctly - 200', async () => {
    const priorityStatus: PriorityStatus = new PriorityStatus({
      name: 'High',
      description:
        'This priority indicates that the task or issue requires immediate attention and should be addressed as soon as possible.',
      value: 3,
    });

    mockFindOne(priorityStatusService.getRepository(), priorityStatus);

    expectResponseToBeCorrect(
      await controller.getPriorityStatus(priorityStatus.uuid),
      priorityStatus,
    );
    expectFindOneCalledWithUUID(
      priorityStatusService.getRepository(),
      priorityStatus.uuid,
    );
  });

  it('GET /priority-status/:uuid should not resolve - 404', async () => {
    const uuid = faker.string.uuid();

    mockFindOne(priorityStatusService.getRepository(), undefined);

    await expectExceptionToBeThrown(
      controller.getPriorityStatus(uuid),
      new NotFoundException(`Priority Status ${uuid} not found`),
    );

    expectFindOneCalledWithUUID(priorityStatusService.getRepository(), uuid);
  });

  it('POST /priority-status should resolve correctly - 201', async () => {
    const priorityStatus = new PriorityStatus({
      name: 'High',
      description: 'Very high priority',
      value: 3,
    });

    const user: KeycloakUser = createKeycloakUser();

    jest
      .spyOn(priorityStatusService, 'createPriorityStatus')
      .mockImplementation(async () => priorityStatus);

    expectResponseToBeCorrect(
      await controller.createPriorityStatus(priorityStatus, user),
      priorityStatus,
    );

    expectEventEmitted(eventEmitter, 'priority-status.created', {
      priorityStatusUuid: priorityStatus.uuid,
      userUuid: user.sub,
    });
  });
});
