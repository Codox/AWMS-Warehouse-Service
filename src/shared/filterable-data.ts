export class FilterableField {
  field: string;
  type? = 'string';
}

export class FilterableData {
  sort?: string;
  order?: string;
  limit?: number;
  page?: number;
  fields?: FilterableDataField[] = [];
}

export class FilterableDataField {
  field: string;
  value: string | number;
}
