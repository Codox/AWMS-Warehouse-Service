import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { CompanyRepository } from './company.repository';
import { Company } from './company.entity';

@Injectable()
export class CompanyService extends BaseService<Company> {
  constructor(private readonly companyRepository: CompanyRepository) {
    super(companyRepository);
  }

  getRepository() {
    return this.companyRepository;
  }
}
