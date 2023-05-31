import { BaseRepository } from '../shared/base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Company } from './company.entity';

@Injectable()
export class CompanyRepository extends BaseRepository<Company> {
  constructor(private dataSource: DataSource) {
    super(Company, dataSource.createEntityManager());
  }
}
