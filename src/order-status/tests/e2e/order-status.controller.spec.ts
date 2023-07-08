import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { OrderStatusModule } from '../../order-status.module';
import { OrderStatusService } from '../../order-status.service';
import { HttpModule } from '@nestjs/axios';
import { E2ETestingService } from '../../../shared/test/e2e/e2e-testing.service';
import { faker } from '@faker-js/faker';

describe('OrderStatusController', () => {
  let app: NestFastifyApplication;
  let service: OrderStatusService;
  let e2eTestingService: E2ETestingService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [OrderStatusModule, HttpModule],
      providers: [E2ETestingService],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    service = moduleRef.get<OrderStatusService>(OrderStatusService);
    e2eTestingService = moduleRef.get<E2ETestingService>(E2ETestingService);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('/order-status should require authentication - 401', async () => {
    return app
      .inject({
        method: 'GET',
        url: '/order-status',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(401);
      });
  });

  it('GET /order-status should resolve correctly - 200', async () => {
    return app
      .inject({
        method: 'GET',
        url: '/order-status',
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result.body).toContain('data');

        expect(JSON.parse(result.body).data.length).toEqual(14);
      });
  });

  it('GET /order-status/:uuid should resolve correctly - 200', async () => {
    const orderStatus = (await service.getRepository().find({}))[0];

    return app
      .inject({
        method: 'GET',
        url: `/order-status/${orderStatus.uuid}`,
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result.body).toContain('data');
        expect(result.json().data.uuid).toEqual(orderStatus.uuid);
      });
  });

  it('GET /order-status/:uuid should resolve correctly - 404', async () => {
    const uuid = faker.string.uuid();
    return app
      .inject({
        method: 'GET',
        url: `/order-status/${uuid}`,
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then((result) => {
        expect(result.statusCode).toEqual(404);
        expect(result.json()).toHaveProperty('message');
        expect(result.json()).toEqual({
          statusCode: 404,
          message: `Order Status ${uuid} not found`,
          error: 'Not Found',
        });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
