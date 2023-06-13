import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CompanyService } from '../../company.service';
import { CompanyRepository } from '../../company.repository';
import { CompanyDTO } from '../../dto/company.dto';
import { Company } from '../../company.entity';
import { faker } from '@faker-js/faker';

describe('CompanyService', () => {
  let companyService: CompanyService;
  let companyRepository: CompanyRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: CompanyRepository,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    companyService = moduleRef.get<CompanyService>(CompanyService);
    companyRepository = moduleRef.get<CompanyRepository>(CompanyRepository);
  });

  describe('createCompany', () => {
    it('should create a new company', async () => {
      const companyData: CompanyDTO = {
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

      const existingCompany = null;
      jest
        .spyOn(companyRepository, 'findOne')
        .mockResolvedValue(existingCompany);

      const savedCompany = new Company(companyData);
      jest.spyOn(companyRepository, 'save').mockResolvedValue(savedCompany);

      const result = await companyService.createCompany(companyData);

      expect(companyRepository.findOne).toHaveBeenCalledWith({
        where: { code: companyData.code },
      });
      expect(companyRepository.save).toHaveBeenCalledWith(expect.any(Company));
      expect(result).toBe(savedCompany);
    });

    it('Should throw BadRequestException if company already exists with the same code', async () => {
      const companyData: CompanyDTO = {
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

      const existingCompany = new Company(companyData);
      jest
        .spyOn(companyRepository, 'findOne')
        .mockResolvedValue(existingCompany);

      await expect(
        companyService.createCompany(companyData),
      ).rejects.toThrowError(BadRequestException);
      expect(companyRepository.findOne).toHaveBeenCalledWith({
        where: { code: companyData.code },
      });
      expect(companyRepository.save).not.toHaveBeenCalled();
    });
  });
});
