import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PriorityStatusDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Priority Status name',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'A description of the company',
  })
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Priority Status value',
  })
  value: number;
}
