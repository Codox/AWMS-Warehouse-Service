import { decorate } from 'ts-mixer';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha2CountryCode } from '../../gateway/validators/is-alpha-2-country-code.validator';

export class LocationDTO {
  @decorate(IsNotEmpty())
  @decorate(IsArray())
  @decorate(
    ApiProperty({
      description: 'Address lines (Supports multiple address lines)',
    }),
  )
  addressLines: string[];

  @decorate(IsString())
  @decorate(IsNotEmpty())
  @decorate(
    ApiProperty({
      description: 'Address town',
    }),
  )
  town: string;

  @decorate(IsString())
  @decorate(IsNotEmpty())
  @decorate(
    ApiProperty({
      description: 'Address region',
    }),
  )
  region: string;

  @decorate(IsString())
  @decorate(IsNotEmpty())
  @decorate(
    ApiProperty({
      description: 'Address city',
    }),
  )
  city: string;

  @decorate(IsString())
  @decorate(IsNotEmpty())
  @decorate(
    ApiProperty({
      description: 'Address post/zip code',
    }),
  )
  zipCode: string;

  @decorate(IsString())
  @decorate(Validate(IsAlpha2CountryCode))
  @decorate(MaxLength(2))
  @decorate(IsNotEmpty())
  @decorate(
    ApiProperty({
      description: 'The country code in ISO 3166 ALPHA-2 format',
      maximum: 2,
    }),
  )
  country: string;
}
