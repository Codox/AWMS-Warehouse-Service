import { DangerousGoodsService } from '../dangerous-goods.service';
import { DangerousGoodsModule } from '../dangerous-goods.module';
import { Test } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { faker } from '@faker-js/faker';

describe('DangerousGoodsController', () => {
  let app: NestFastifyApplication;
  let service: DangerousGoodsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DangerousGoodsModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    service = moduleRef.get<DangerousGoodsService>(DangerousGoodsService);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('GET /dangerous-goods should resolve correctly - 200', async () => {
    return app
      .inject({
        method: 'GET',
        url: '/dangerous-goods',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result.body).toContain('data');

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
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result.body).toContain('data');

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
      })
      .then((result) => {
        expect(result.statusCode).toEqual(404);
        expect(result.body).toContain('error');

        expect(JSON.parse(result.body)).toEqual({
          statusCode: 404,
          message: `Dangerous Goods ${uuid} not found`,
          error: 'Not Found',
        });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
