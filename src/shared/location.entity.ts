import { Column } from 'typeorm';
import { decorate } from 'ts-mixer';

export class Location {
  @decorate(
    Column({
      name: 'address_lines',
      type: 'json',
    }),
  )
  addressLines: string[];

  @decorate(Column())
  town: string;

  @decorate(Column())
  region: string;

  @decorate(Column())
  city: string;

  @decorate(
    Column({
      name: 'zip_code',
      length: 10,
    }),
  )
  zipCode: string;

  @decorate(
    Column({
      length: 2,
    }),
  )
  country: string;
}
