import { Column } from "typeorm";

export class Location {
  @Column({
    name: 'address_lines',
    type: 'json',
  })
  addressLines: string[];

  @Column()
  town: string;

  @Column()
  region: string;

  @Column()
  city: string;

  @Column({
    name: 'zip_code',
    length: 10,
  })
  zipCode: string;

  @Column({
    length: 2,
  })
  country: string;
}
