import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from '../../company.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Company } from '../../company.entity';
import { faker } from '@faker-js/faker';
import { FilterableData } from '../../../shared/filterable-data';
import { CompanyRepository } from '../../company.repository';
import { KeycloakUser } from '../../../user/keycloak-user';
import { CompanyController } from '../../company.controller';
import {
  createCompany,
  createKeycloakUser,
  expectFilterableCalledCorrectly,
  mockFindOne,
  mockQueryWithFilterable,
  responseToBeCorrect,
} from '../../../shared/test/test-utilities';

describe('CompanyController', () => {
  let controller: CompanyController;
  let companyService: CompanyService;
  let eventEmitter: EventEmitter2;

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
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('GET /company should resolve correctly - 200', async () => {
    const mockCompanies: Company[] = [createCompany()];

    mockQueryWithFilterable(
      companyService.getRepository(),
      mockCompanies,
      5,
      10,
    );

    const filterableData: FilterableData = {
      fields: [],
      page: 5,
      limit: 10,
    };

    const result = await controller.getCompanies(filterableData);

    expectFilterableCalledCorrectly(
      result,
      companyService.getRepository(),
      {
        data: mockCompanies,
        count: mockCompanies.length,
        page: 5,
        limit: 10,
      },
      filterableData,
    );
  });

  it('GET /company/:uuid should resolve correctly - 200', async () => {
    const company = createCompany();

    mockFindOne(companyService.getRepository(), company);

    const result = await controller.getCompany(company.uuid);

    responseToBeCorrect(result, company);

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

  it('POST /company should resolve correctly - 201', async () => {
    const company = createCompany();

    const user: KeycloakUser = createKeycloakUser();

    const baseResponse = {
      data: company,
    };

    jest
      .spyOn(companyService, 'createCompany')
      .mockImplementation(async () => company);

    const result = await controller.createCompany(company, user);

    expect(result).toEqual(baseResponse);
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'company.created',
      expect.objectContaining({
        companyUuid: company.uuid,
        userUuid: user.sub,
      }),
    );
  });
});
