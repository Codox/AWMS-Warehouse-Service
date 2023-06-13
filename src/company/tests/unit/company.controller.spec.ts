import { CompanyController } from '../../../gateway/controllers/company.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from '../../company.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Company } from '../../company.entity';
import { faker } from '@faker-js/faker';
import { FilterableData } from '../../../shared/filterable-data';
import { CompanyRepository } from '../../company.repository';

describe('CompanyController', () => {
  let controller: CompanyController;
  let companyService: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        CompanyService,
        {
          provide: CompanyRepository,
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

    controller = module.get<CompanyController>(CompanyController);
    companyService = module.get<CompanyService>(CompanyService);
  });

  it('GET /company should resolve correctly - 200', async () => {
    const mockCompanies: Company[] = [
      new Company({
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
      }),
    ];

    const baseResponse = {
      data: mockCompanies,
      count: mockCompanies.length,
      page: 5,
      limit: 10,
    };

    jest
      .spyOn(companyService.getRepository(), 'queryWithFilterable')
      .mockImplementation(async () => baseResponse);

    const filterableData: FilterableData = {
      fields: [],
      page: 5,
      limit: 10,
    };

    const result = await controller.getCompanies(filterableData);

    expect(result).toEqual(baseResponse);
    expect(
      companyService.getRepository().queryWithFilterable,
    ).toHaveBeenCalledWith(filterableData);
  });

  it('GET /company/:uuid should resolve correctly - 200', async () => {
    const company = new Company({
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

    const baseResponse = {
      data: company,
    };

    jest
      .spyOn(companyService.getRepository(), 'findOne')
      .mockImplementation(async () => company);

    const result = await controller.getCompany(company.uuid);

    expect(result).toEqual(baseResponse);
    expect(companyService.getRepository().findOne).toHaveBeenCalledWith({
      where: { uuid: company.uuid },
    });
  });

  it('GET /company/:uuid should not resolve (Not found) - 404', async () => {
    const uuid = faker.string.uuid();

    jest
      .spyOn(companyService.getRepository(), 'findOne')
      .mockImplementation(async () => undefined);

    await expect(controller.getCompany(uuid)).rejects.toThrow(
      `Company ${uuid} not found`,
    );
    expect(companyService.getRepository().findOne).toHaveBeenCalledWith({
      where: { uuid },
    });
  });
});

/*
describe('MyController', () => {
  let controller: MyController;
  let service: MyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyController],
      providers: [MyService],
    }).compile();

    controller = module.get<MyController>(MyController);
    service = module.get<MyService>(MyService);
  });

  // Tests will go here
});
*/
