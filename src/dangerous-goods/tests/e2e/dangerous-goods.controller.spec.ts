import { Test } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { faker } from '@faker-js/faker';
import { DangerousGoodsModule } from '../../dangerous-goods.module';
import { DangerousGoodsService } from '../../dangerous-goods.service';
import { E2ETestingService } from '../../../shared/test/e2e/e2e-testing.service';
import { HttpModule } from '@nestjs/axios';
import {
  expectEndpointCalledNotFound,
  expectEndpointCalledSuccessfully,
} from '../../../shared/test/e2e-test-utilities';

describe('DangerousGoodsController', () => {
  let app: NestFastifyApplication;
  let service: DangerousGoodsService;
  let e2eTestingService: E2ETestingService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DangerousGoodsModule, HttpModule],
      providers: [E2ETestingService],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    service = moduleRef.get<DangerousGoodsService>(DangerousGoodsService);
    e2eTestingService = moduleRef.get<E2ETestingService>(E2ETestingService);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('/dangerous-goods should require authentication - 401', async () => {
    return app
      .inject({
        method: 'GET',
        url: '/dangerous-goods',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(401);
      });
  });

  it('GET /dangerous-goods should resolve correctly - 200', async () => {
    return app
      .inject({
        method: 'GET',
        url: '/dangerous-goods',
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then((result) => {
        expectEndpointCalledSuccessfully(result);

        /**
         * Check if the length of the dangerous goods is set to a specific length
         */
        expect(JSON.parse(result.body).data.length).toEqual(9);

        /**
         * Check the classifications of the dangerous goods are loaded
         */
        expect(
          JSON.parse(result.body).data[0].classifications.length,
        ).toBeGreaterThan(0);
      });
  });

  it('GET /dangerous-goods/:uuid should resolve correctly - 200', async () => {
    // Get a random existing dangerous good
    const dangerousGood = (
      await service.getRepository().find({
        relations: ['classifications'],
      })
    )[0];

    return app
      .inject({
        method: 'GET',
        url: `/dangerous-goods/${dangerousGood.uuid}`,
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then((result) => {
        expectEndpointCalledSuccessfully(result);

        // Check if the dangerous good is the same as the one we fetched
        expect(JSON.parse(result.body).data.uuid).toEqual(dangerousGood.uuid);

        // Check if the classifications of the dangerous goods are loaded
        expect(
          JSON.parse(result.body).data.classifications.length,
        ).toBeGreaterThan(0);
      });
  });

  it('GET /dangerous-goods/:uuid should not resolve correctly - 404', async () => {
    const uuid = faker.string.uuid();

    return app
      .inject({
        method: 'GET',
        url: `/dangerous-goods/${uuid}`,
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then((result) => {
        expectEndpointCalledNotFound(
          result,
          `Dangerous Goods ${uuid} not found`,
        );
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
