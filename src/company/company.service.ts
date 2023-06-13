import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { CompanyRepository } from './company.repository';
import { Company } from './company.entity';
import { CompanyDTO } from './dto/company.dto';
import { parsePhoneNumber } from 'libphonenumber-js';

@Injectable()
export class CompanyService extends BaseService<Company> {
  constructor(private readonly companyRepository: CompanyRepository) {
    super(companyRepository);
  }

  async createCompany(data: CompanyDTO): Promise<Company> {
    // TODO - Add this check as a decorator at some point
    const existingCompany = await this.getRepository().findOne({
      where: {
        code: data.code,
      },
    });

    if (existingCompany) {
      throw new BadRequestException(
        `Company already exists with code ${data.code}`,
      );
    }

    let company = new Company(data);

    const phoneNumber = parsePhoneNumber(data.contactTelephone);
    company.contactTelephone = phoneNumber.number;

    company = await this.companyRepository.save(company);

    return company;
  }
}
