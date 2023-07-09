import {
  expectEndpointCalledNotFound,
  expectEndpointCalledSuccessfully,
} from '../../../shared/test/e2e-test-utilities';
import { ProductStatusService } from '../../product-status.service';
import { E2ETestingService } from '../../../shared/test/e2e/e2e-testing.service';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ProductStatusModule } from '../../product-status.module';
import { faker } from '@faker-js/faker';

describe('ProductStatusController', () => {
  let app: NestFastifyApplication;
  let service: ProductStatusService;
  let e2eTestingService: E2ETestingService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProductStatusModule, HttpModule],
      providers: [E2ETestingService],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    service = moduleRef.get<ProductStatusService>(ProductStatusService);
    e2eTestingService = moduleRef.get<E2ETestingService>(E2ETestingService);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('/product-status should require authentication - 401', async () => {
    return app
      .inject({
        method: 'GET',
        url: '/product-status',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(401);
      });
  });

  it('GET /product-status should resolve correctly - 200', async () => {
    return app
      .inject({
        method: 'GET',
        url: `/product-status`,
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then((result) => {
        expectEndpointCalledSuccessfully(result);
        expect(result.json().data.length).toEqual(6);
      });
  });

  it('GET /product-status/:uuid should resolve correctly - 200', async () => {
    const productStatus = (await service.getRepository().find())[0];

    return app
      .inject({
        method: 'GET',
        url: `/product-status/${productStatus.uuid}`,
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then((result) => {
        expectEndpointCalledSuccessfully(result);
        expect(result.json().data.uuid).toEqual(productStatus.uuid);
      });
  });

  it('GET /product-status/:uuid should not resolve correctly - 404', async () => {
    const uuid = faker.string.uuid();

    return app
      .inject({
        method: 'GET',
        url: `/product-status/${uuid}`,
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then((result) => {
        expectEndpointCalledNotFound(
          result,
          `Product Status ${uuid} not found`,
        );
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
