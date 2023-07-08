import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from '../../company.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Company } from '../../company.entity';
import { faker } from '@faker-js/faker';
import { CompanyRepository } from '../../company.repository';
import { KeycloakUser } from '../../../user/keycloak-user';
import { CompanyController } from '../../company.controller';
import {
  createCompany,
  createKeycloakUser,
  expectEventEmitted,
  expectExceptionToBeThrown,
  expectFilterableCalledCorrectly,
  expectFilterableResponseToBeCorrect,
  expectFindOneCalledWithUUID,
  expectResponseToBeCorrect,
  mockFindOne,
  mockQueryWithFilterable,
} from '../../../shared/test/unit-test-utilities';
import { NotFoundException } from '@nestjs/common';

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

    const result = await controller.getCompanies({
      fields: [],
      page: 5,
      limit: 10,
    });

    expectFilterableCalledCorrectly(result, companyService.getRepository(), {
      fields: [],
      page: 5,
      limit: 10,
    });
    expectFilterableResponseToBeCorrect(result, mockCompanies, 5, 10);
  });

  it('GET /company/:uuid should resolve correctly - 200', async () => {
    const company = createCompany();

    mockFindOne(companyService.getRepository(), company);

    expectResponseToBeCorrect(
      await controller.getCompany(company.uuid),
      company,
    );
    expectFindOneCalledWithUUID(companyService.getRepository(), company.uuid);
  });

  it('GET /company/:uuid should not resolve (Not found) - 404', async () => {
    const uuid = faker.string.uuid();

    mockFindOne(companyService.getRepository(), undefined);

    await expectExceptionToBeThrown(
      controller.getCompany(uuid),
      new NotFoundException(`Company ${uuid} not found`),
    );
    expectFindOneCalledWithUUID(companyService.getRepository(), uuid);
  });

  it('POST /company should resolve correctly - 201', async () => {
    const company = createCompany();
    const user: KeycloakUser = createKeycloakUser();

    jest
      .spyOn(companyService, 'createCompany')
      .mockImplementation(async () => company);

    expectResponseToBeCorrect(
      await controller.createCompany(company, user),
      company,
    );

    expectEventEmitted(eventEmitter, 'company.created', {
      companyUuid: company.uuid,
      userUuid: user.sub,
    });
  });
});
