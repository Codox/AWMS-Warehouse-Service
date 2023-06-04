import { Mixin } from 'ts-mixer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LocationDTO } from '../../location/dto/location.dto';
import { IsAlpha2CountryCode } from "../../gateway/validators/is-alpha-2-country-code.validator";

export class CompanyDTO extends Mixin(LocationDTO) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Company name',
  })
  name: string;

  @IsString()
  @ApiPropertyOptional({
    description: 'A description of the company',
  })
  description?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @ApiProperty({
    description: 'The company code that will be used to identify the company',
    maximum: 10,
  })
  code: string;

  @IsString()
  @Validate(IsAlpha2CountryCode)
  @MaxLength(2)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The telephone country code in ISO 3166 ALPHA-2 format',
    maximum: 2,
  })
  contactTelephoneCountryCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Full contact telephone number of the company',
  })
  contactTelephone: string;
}
