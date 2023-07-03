import { Test } from '@nestjs/testing';
import { CompanyModule } from '../../company.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { CompanyService } from '../../company.service';
import { Company } from '../../company.entity';
import { faker } from '@faker-js/faker';

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

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CompanyModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    companyService = moduleRef.get<CompanyService>(CompanyService);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('GET /company should resolve correctly - 200', async () => {
    const companyData = createValidCompany();

    const company = await companyService.createCompany(companyData);

    return app
      .inject({
        method: 'GET',
        url: `/company`,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result.json()).toHaveProperty('data');
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
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result.json()).toHaveProperty('data');
        expect(result.json().data.uuid).toEqual(company.uuid);
      });
  });

  it('POST /company should resolve correctly - 201', async () => {
    const companyData = createValidCompany();

    return app
      .inject({
        method: 'POST',
        url: `/company`,
        payload: companyData,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(201);
        expect(result.json()).toHaveProperty('data');
        expect(result.json().data.uuid).toEqual(companyData.uuid);
      });
  });

  it('GET /company/:uuid should not resolve correctly - 404', async () => {
    const uuid = faker.string.uuid();
    return app
      .inject({
        method: 'GET',
        url: `/company/${uuid}`,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(404);
        expect(result.json()).toHaveProperty('message');
        expect(result.json()).toEqual({
          statusCode: 404,
          message: `Company ${uuid} not found`,
          error: 'Not Found',
        });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
