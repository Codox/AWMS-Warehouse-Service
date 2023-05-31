import { FindManyOptions, ILike, Repository } from 'typeorm';
import { FilterableData } from './filterable-data';
import { forEach } from 'lodash';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseRepository<T> extends Repository<T> {
  public async queryWithFilterable(
    filterable: FilterableData,
    options?: FindManyOptions<T>,
  ) {
    const addedFindOptions: FindManyOptions = {};

    if (filterable.order && filterable.sort) {
      addedFindOptions.order = {
        [filterable.sort]: filterable.order as 'ASC' | 'DESC',
      };
    }

    if (filterable.fields && filterable.fields.length !== 0) {
      const whereOptions = options ? options.where : {};
      forEach(filterable.fields, (value) => {
        whereOptions[value.field] = ILike(`%${value.value}%`);
      });

      addedFindOptions.where = whereOptions;
    }

    if (!filterable.limit) {
      filterable.limit = 10;
    }

    if (!filterable.page) {
      filterable.page = 1;
    }

    const take = filterable.limit;
    addedFindOptions.skip = (filterable.page - 1) * take;
    addedFindOptions.take = take;

    if (options) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      options = { ...options, ...addedFindOptions };
    } else {
      options = addedFindOptions;
    }

    const count = await this.count(options);
    const data = await this.find(options);

    return {
      data,
      count,
      page: filterable.page,
      limit: filterable.limit,
    };
  }
}
