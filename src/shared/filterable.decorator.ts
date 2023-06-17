import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { has, get, forEach, endsWith, split, find } from 'lodash';
import { FilterableData, FilterableField } from './filterable-data';

export const Filterable = createParamDecorator(
  (data: FilterableField[], ctx: ExecutionContext) => {
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
      let field = null;
      if (endsWith(key, '_like')) {
        field = split(key, '_')[0];
      } else {
        field = key;
      }

      const existingField = find(data, { field });

      if (existingField) {
        filterable.fields.push({
          field: existingField.field,
          value,
          type: existingField.type,
        });
      }
    });

    return filterable;
  },
);
