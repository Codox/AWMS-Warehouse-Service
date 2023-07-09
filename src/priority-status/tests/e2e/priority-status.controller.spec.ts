import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { PriorityStatusService } from '../../priority-status.service';
import { E2ETestingService } from '../../../shared/test/e2e/e2e-testing.service';
import { Test } from '@nestjs/testing';
import { PriorityStatusModule } from '../../priority-status.module';
import { HttpModule } from '@nestjs/axios';
import { faker } from '@faker-js/faker';
import { PriorityStatus } from '../../priority-status.entity';
import {
  expectEndpointCalledNotFound,
  expectEndpointCalledSuccessfully,
} from '../../../shared/test/e2e-test-utilities';

function createPriorityStatus() {
  return new PriorityStatus({
    uuid: faker.string.uuid(),
    name: 'Critical',
    description: faker.string.uuid(),
    value: 999,
  });
}

describe('PriorityStatusController', () => {
  let app: NestFastifyApplication;
  let service: PriorityStatusService;
  let e2eTestingService: E2ETestingService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PriorityStatusModule, HttpModule],
      providers: [E2ETestingService],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    service = moduleRef.get<PriorityStatusService>(PriorityStatusService);
    e2eTestingService = moduleRef.get<E2ETestingService>(E2ETestingService);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('/priority-status should require authentication - 401', async () => {
    return app
      .inject({
        method: 'GET',
        url: '/priority-status',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(401);
      });
  });

  it('GET /priority-status should resolve correctly - 200', async () => {
    return app
      .inject({
        method: 'GET',
        url: `/priority-status`,
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then((result) => {
        expectEndpointCalledSuccessfully(result);
        expect(result.json().data.length).toEqual(3);
      });
  });

  it('GET /priority-status/:uuid should resolve correctly - 200', async () => {
    const priorityStatus = (await service.getRepository().find())[0];

    return app
      .inject({
        method: 'GET',
        url: `/priority-status/${priorityStatus.uuid}`,
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then((result) => {
        expectEndpointCalledSuccessfully(result);
        expect(result.json().data.uuid);
      });
  });

  it('GET /priority-status/:uuid should not resolve correctly - 404', async () => {
    const uuid = faker.string.uuid();

    return app
      .inject({
        method: 'GET',
        url: `/priority-status/${uuid}`,
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then((result) => {
        expectEndpointCalledNotFound(
          result,
          `Priority Status ${uuid} not found`,
        );
      });
  });

  it('POST /priority-status should resolve correctly - 201', async () => {
    const priorityStatusData = createPriorityStatus();

    return app
      .inject({
        method: 'POST',
        url: `/priority-status`,
        payload: priorityStatusData,
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then(async (result) => {
        expectEndpointCalledSuccessfully(result, 201);
        expect(result.json().data.uuid).toEqual(priorityStatusData.uuid);

        const priorityStatus = await service.getRepository().findOne({
          where: {
            uuid: result.json().data.uuid,
          },
        });

        expect(priorityStatus).not.toBeNull();
      });
  });

  it('PUT /priority-status/:uuid should resolve correctly - 200', async () => {
    const priorityStatusToUpdate = (await service.getRepository().find())[0];

    const priorityStatusData = {
      value: 500,
      name: priorityStatusToUpdate.name + ' Updated',
    };

    return app
      .inject({
        method: 'PUT',
        url: `/priority-status/${priorityStatusToUpdate.uuid}`,
        payload: priorityStatusData,
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then(async (result) => {
        expectEndpointCalledSuccessfully(result);

        expect(result.json().data.value).toEqual(500);
        expect(result.json().data.name).toEqual(
          priorityStatusToUpdate.name + ' Updated',
        );

        const priorityStatus = await service.getRepository().findOne({
          where: {
            uuid: result.json().data.uuid,
          },
        });

        expect(priorityStatus).not.toBeNull();
        expect(priorityStatus.value).toEqual(500);
        expect(priorityStatus.name).toEqual(
          priorityStatusToUpdate.name + ' Updated',
        );
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
