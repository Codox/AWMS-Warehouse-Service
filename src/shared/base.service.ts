import { FilterableData } from './filterable-data';
import { Logger } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { BaseRepository } from './base.repository';

export class BaseService<T> {
  private readonly logger: Logger;

  constructor(private readonly repository: BaseRepository<T>) {
    this.logger = new Logger(this.constructor['name'], {
      timestamp: true,
    });
  }

  async getAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async getAllWithFilterable(filterable?: FilterableData) {
    return await this.repository.queryWithFilterable(filterable);
  }

  async getOne(uuid: string): Promise<T> {
    const options: FindOptionsWhere<any> = {
      uuid: uuid,
    };

    return await this.repository.findOne({
      where: options,
    });
  }

  public getRepository(): BaseRepository<T> {
    return this.repository;
  }

  public getLogger() {
    return this.logger;
  }
}
