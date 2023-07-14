import { Test } from '@nestjs/testing';
import { CompanyModule } from '../../company.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { CompanyService } from '../../company.service';
import { Company } from '../../company.entity';
import { faker } from '@faker-js/faker';
import { HttpModule } from '@nestjs/axios';
import { E2ETestingService } from '../../../shared/test/e2e/e2e-testing.service';
import {
  expectEndpointCalledNotFound,
  expectEndpointCalledSuccessfully,
} from '../../../shared/test/e2e-test-utilities';
import { ValidationPipe } from '@nestjs/common';
import { createCompanyDTO } from "../../../shared/test/unit-test-utilities";

function createValidCompany() {
  return new Company({
    uuid: faker.string.uuid(),
    name: faker.company.name(),
    code: faker.company.name().slice(0, 3).toUpperCase(),
    description: faker.lorem.paragraph(),
    vatNumber: faker.finance.accountNumber(),
    eoriNumber: faker.finance.accountNumber(),
    contactTelephone: faker.phone.number('+44##########'),

    addressLines: [faker.location.streetAddress({ useFullAddress: true })],
    town: faker.location.city(),
    region: faker.location.state(),
    city: faker.location.city(),
    zipCode: faker.location.zipCode(),
    country: faker.location.countryCode(),
  });
}
describe('CompanyController', () => {
  let app: NestFastifyApplication;
  let companyService: CompanyService;
  let e2eTestingService: E2ETestingService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CompanyModule, HttpModule],
      providers: [E2ETestingService],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.useGlobalPipes(new ValidationPipe());

    companyService = moduleRef.get<CompanyService>(CompanyService);
    e2eTestingService = moduleRef.get<E2ETestingService>(E2ETestingService);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('/company should require authentication - 401', async () => {
    return app
      .inject({
        method: 'GET',
        url: '/company',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(401);
      });
  });

  it('GET /company should resolve correctly - 200', async () => {
    const companyData = createValidCompany();

    const company = await companyService.createCompany(companyData);

    return app
      .inject({
        method: 'GET',
        url: `/company`,
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then((result) => {
        expectEndpointCalledSuccessfully(result);
        expect(result.json().data.length).toEqual(1);
        expect(result.json().data[0].uuid).toEqual(company.uuid);
      });
  });

  it('GET /company/:uuid should resolve correctly - 200', async () => {
    const companyData = createValidCompany();

    const company = await companyService.createCompany(companyData);

    return app
      .inject({
        method: 'GET',
        url: `/company/${company.uuid}`,
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then((result) => {
        expectEndpointCalledSuccessfully(result);
        expect(result.json().data.uuid).toEqual(company.uuid);
      });
  });

  it('POST /company should resolve correctly - 201', async () => {
    const companyData = createCompanyDTO();

    return app
      .inject({
        method: 'POST',
        url: `/company`,
        payload: companyData,
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then(async (result) => {
        expectEndpointCalledSuccessfully(result, 201);

        const company = await companyService.getRepository().findOne({
          where: {
            uuid: result.json().data.uuid,
          },
        });

        expect(company).not.toBeNull();
      });
  });

  it('POST /company should not resolve correctly - 400', async () => {
    const companyData = createValidCompany();
    delete companyData.name;

    return app
      .inject({
        method: 'POST',
        url: `/company`,
        payload: companyData,
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then(async (result) => {
        expect(result.statusCode).toEqual(400);
      });
  });

  it('GET /company/:uuid should not resolve correctly - 404', async () => {
    const uuid = faker.string.uuid();
    return app
      .inject({
        method: 'GET',
        url: `/company/${uuid}`,
        headers: {
          Authorization: 'Bearer ' + (await e2eTestingService.getAccessToken()),
        },
      })
      .then((result) => {
        expectEndpointCalledNotFound(result, `Company ${uuid} not found`);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
