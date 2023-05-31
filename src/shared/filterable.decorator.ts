import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { has, get, forEach, endsWith, split } from 'lodash';
import { FilterableData } from './filterable-data';

export const Filterable = createParamDecorator(
  (data: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const rawQueryData = request.query;

    const filterable = new FilterableData();

    if (has(rawQueryData, '_sort')) {
      filterable.sort = get(rawQueryData, '_sort', null);
      filterable.order = get(rawQueryData, '_order', 'DESC');
    }

    if (has(rawQueryData, '_limit') && has(rawQueryData, '_page')) {
      filterable.limit = parseInt(get(rawQueryData, '_limit'));
      filterable.page = parseInt(get(rawQueryData, '_page'));
    }

    forEach(rawQueryData, function (value, key) {
      if (endsWith(key, '_like')) {
        const field = split(key, '_')[0];

        if (data.includes(field)) {
          filterable.fields.push({ field, value });
        }
      }
    });

    return filterable;
  },
);
