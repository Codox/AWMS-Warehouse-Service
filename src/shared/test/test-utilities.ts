import { Company } from '../../company/company.entity';
import { faker } from '@faker-js/faker';
import { KeycloakUser } from '../../user/keycloak-user';
import { BaseRepository } from '../base.repository';
import { FilterableData } from '../filterable-data';

export function buildTestModule() {}

export function createCompany(): Company {
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

export function createKeycloakUser(): KeycloakUser {
  return {
    sub: faker.string.uuid(),
    email: faker.internet.email(),
  };
}

export function mockQueryWithFilterable(
  repository: BaseRepository<any>,
  data: any[],
  page: number,
  limit: number,
) {
  jest.spyOn(repository, 'queryWithFilterable').mockImplementation(async () => {
    return {
      data,
      count: data.length,
      page,
      limit,
    };
  });
}

export function mockFindOne(repository: BaseRepository<any>, data: any) {
  jest.spyOn(repository, 'findOne').mockImplementation(async () => {
    return data;
  });
}

export function expectFilterableCalledCorrectly(
  result: any,
  repository: BaseRepository<any>,
  expectedResponse: {
    data: any[];
    count: number;
    page: number;
    limit: number;
  },
  expectedFilterableData: FilterableData,
) {
  expect(result).toEqual(expectedResponse);
  expect(repository.queryWithFilterable).toHaveBeenCalledWith(
    expectedFilterableData,
  );
}

export function responseToBeCorrect(result: any, data: any) {
  expect(result).toEqual({ data: data });
}


export function expectFindOneCalledWithUUID(
  repository: BaseRepository<any>,
  
) {

}
