import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { CountryModule } from '../../country.module';
import { find } from 'lodash';
import { HttpModule, HttpService } from "@nestjs/axios";
import { E2ETestingService } from '../../../shared/test/e2e/e2e-testing.service';

describe('CountryController', () => {
  let app: NestFastifyApplication;
  let e2eTestingService: E2ETestingService;

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
      imports: [CountryModule, HttpModule],
      providers: [E2ETestingService],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    e2eTestingService = moduleRef.get<E2ETestingService>(E2ETestingService);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('/country should require authentication - 401', async () => {
    return app
      .inject({
        method: 'GET',
        url: '/country',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(401);
      });
  });

  it('GET /country should resolve correctly - 200', async () => {
    return app
      .inject({
        method: 'GET',
        url: '/country',
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
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
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
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
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
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
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
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
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
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
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
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
