import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('dangerous-goods')
@ApiTags('dangerous-goods')
@UseInterceptors(ClassSerializerInterceptor)
export class DangerousGoodsController {
  
}
