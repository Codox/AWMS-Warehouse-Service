import { LocationDTO } from '../warehouse-location/dto/location.dto';
import { Mixin } from 'ts-mixer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WarehouseDTO extends Mixin(LocationDTO) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Warehouse name',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Full contact telephone number of the warehouse',
  })
  contactTelephone: string;
}
