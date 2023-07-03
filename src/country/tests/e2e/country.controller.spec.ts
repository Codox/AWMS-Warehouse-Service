import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { CountryModule } from '../../country.module';
import { has, get, forEach, endsWith, split, find } from 'lodash';

describe('CountryController', () => {
  let app: NestFastifyApplication;

  const testData = {
    name: 'Ukraine',
    nativeName: 'Україна',
    emoji: '🇺🇦',
    callingCode: '380',
    capital: 'Kyiv',
    currency: 'UAH',
    languages: ['uk'],
    alpha: {
      '2': 'UA',
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CountryModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('GET /country should resolve correctly - 200', async () => {
    return app
      .inject({
        method: 'GET',
        url: '/country',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body)).toHaveProperty('data');

        const existingCountry = find(JSON.parse(result.body).data, {
          name: 'Ukraine',
        });

        expect(existingCountry).toEqual(testData);
      });
  });

  it('GET /country/alpha/2/:code should resolve correctly (Lowercase) - 200', async () => {
    return app
      .inject({
        method: 'GET',
        url: '/country/alpha/2/ua',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body)).toHaveProperty('data');
        expect(JSON.parse(result.body).data).toEqual(testData);
      });
  });

  it('GET /country/alpha/2/:code should resolve correctly (Uppercase) - 200', async () => {
    return app
      .inject({
        method: 'GET',
        url: '/country/alpha/2/UA',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body)).toHaveProperty('data');
        expect(JSON.parse(result.body).data).toEqual(testData);
      });
  });

  it('GET /country/alpha/2/:code should not resolve correctly (Not found) - 404', async () => {
    return app
      .inject({
        method: 'GET',
        url: '/country/alpha/2/ZZ',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(404);
        expect(JSON.parse(result.body)).toHaveProperty('message');
        expect(JSON.parse(result.body)).toEqual({
          statusCode: 404,
          message: 'Country ZZ not found',
          error: 'Not Found',
        });
      });
  });

  it('GET /country/:name should resolve correctly - 200', async () => {
    return app
      .inject({
        method: 'GET',
        url: '/country/Ukraine',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body)).toHaveProperty('data');
        expect(JSON.parse(result.body).data).toEqual(testData);
      });
  });

  it('GET /country/:name should not resolve correctly (Not found) - 404', async () => {
    return app
      .inject({
        method: 'GET',
        url: '/country/Rexchoppers Kingdom',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(404);
        expect(JSON.parse(result.body)).toHaveProperty('message');
        expect(JSON.parse(result.body)).toEqual({
          statusCode: 404,
          message: 'Country Rexchoppers Kingdom not found',
          error: 'Not Found',
        });
      });
  });
});
