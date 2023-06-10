import { Mixin } from 'ts-mixer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LocationDTO } from '../../warehouse-location/dto/location.dto';

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
  @IsNotEmpty()
  @ApiProperty({
    description: 'Full contact telephone number of the company',
  })
  contactTelephone: string;
}
