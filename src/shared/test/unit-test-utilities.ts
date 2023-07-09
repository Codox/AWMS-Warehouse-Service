import { Company } from '../../company/company.entity';
import { faker } from '@faker-js/faker';
import { KeycloakUser } from '../../user/keycloak-user';
import { BaseRepository } from '../base.repository';
import { FilterableData } from '../filterable-data';
import { CompanyDTO } from '../../company/dto/company.dto';
import { WarehouseDTO } from "../../warehouse/dto/warehouse.dto";

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

export function createCompanyDTO(): CompanyDTO {
  return {
    name: faker.company.name(),
    code: 'TEST',
    contactTelephone: faker.phone.number('+44##########'),
    addressLines: [
      faker.location.streetAddress(),
      faker.location.secondaryAddress(),
    ],
    town: faker.location.city(),
    region: faker.location.state(),
    city: faker.location.city(),
    zipCode: faker.location.zipCode(),
    country: faker.location.country(),
  };
}

export function createWarehouseDTO(): WarehouseDTO {
  return {
    name: faker.company.name(),
    contactTelephone: faker.phone.number('+44##########'),
    addressLines: [
      faker.location.streetAddress(),
      faker.location.secondaryAddress(),
    ],
    town: faker.location.city(),
    region: faker.location.state(),
    city: faker.location.city(),
    zipCode: faker.location.zipCode(),
    country: faker.location.country(),
  };
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

export function mockFindOne(
  repository: BaseRepository<any>,
  data: any | any[],
) {
  if (Array.isArray(data)) {
    for (const item of data) {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(item);
    }

    return;
  }

  jest.spyOn(repository, 'findOne').mockImplementation(async () => {
    return data;
  });
}

export function mockFind(repository: BaseRepository<any>, data: any) {
  jest.spyOn(repository, 'find').mockResolvedValueOnce(data);
}

export function mockSave(repository: BaseRepository<any>, data: any) {
  jest.spyOn(repository, 'save').mockResolvedValueOnce(data);
}

export function expectFilterableCalledCorrectly(
  result: any,
  repository: BaseRepository<any>,
  expectedFilterableData: FilterableData,
) {
  expect(repository.queryWithFilterable).toHaveBeenCalledWith(
    expectedFilterableData,
  );
}

export function expectResponseToBeCorrect(result: any, data: any) {
  expect(result).toEqual({ data: data });
}

export function expectFilterableResponseToBeCorrect(
  result: any,
  expectedData: any[],
  page: number,
  limit: number,
) {
  expect(result).toEqual({
    data: expectedData,
    count: expectedData.length,
    page,
    limit,
  });
}

export function expectFindOneCalledWithUUID(
  repository: BaseRepository<any>,
  uuid: string,
) {
  expect(repository.findOne).toHaveBeenCalledWith({
    where: { uuid },
  });
}

export async function expectExceptionToBeThrown(
  promise: Promise<any>,
  expectedException: any,
) {
  try {
    await promise;
    fail(
      'Expected an exception to be thrown, but the promise resolved successfully.',
    );
  } catch (error) {
    expect(error.constructor.name).toBe(expectedException.name);
    expect(error.message).toBe(expectedException.message);
  }
}

export function expectEventEmitted(
  emitter: any,
  eventName: string,
  expectedData: any,
) {
  expect(emitter.emit).toHaveBeenCalledWith(
    eventName,
    expect.objectContaining(expectedData),
  );
}
