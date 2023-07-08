import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CompanyService } from '../../company.service';
import { CompanyRepository } from '../../company.repository';
import { CompanyDTO } from '../../dto/company.dto';
import { Company } from '../../company.entity';
import {
  createCompanyDTO,
  expectExceptionToBeThrown,
  mockFindOne,
  mockSave,
} from '../../../shared/test/unit-test-utilities';

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
    it('Should create a new company', async () => {
      const companyData: CompanyDTO = createCompanyDTO();

      const existingCompany = null;
      mockFindOne(companyRepository, existingCompany);

      const savedCompany = new Company(companyData);
      mockSave(companyRepository, savedCompany);

      const result = await companyService.createCompany(companyData);

      expect(companyRepository.findOne).toHaveBeenCalledWith({
        where: { code: companyData.code },
      });
      expect(companyRepository.save).toHaveBeenCalledWith(expect.any(Company));
      expect(result).toEqual(savedCompany);
    });

    it('Should throw BadRequestException if company already exists with the same code', async () => {
      const companyData: CompanyDTO = createCompanyDTO();

      const existingCompany = new Company(companyData);
      mockFindOne(companyRepository, existingCompany);

      await expectExceptionToBeThrown(
        companyService.createCompany(companyData),
        new BadRequestException(
          `Company already exists with code ${existingCompany.code}`,
        ),
      );

      expect(companyRepository.findOne).toHaveBeenCalledWith({
        where: { code: companyData.code },
      });
      expect(companyRepository.save).not.toHaveBeenCalled();
    });
  });
});
