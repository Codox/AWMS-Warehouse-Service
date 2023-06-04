import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  POSTGRES_ERRORS = {
    '22P02': {
      message: 'Invalid UUID value passed. Please check your input.',
    },
  };

  catch(exception, host: ArgumentsHost) {
    const errorCode = exception.code;

    const response = host.switchToHttp().getResponse();
    const status = 400;

    if (this.POSTGRES_ERRORS[errorCode]) {
      const error = this.POSTGRES_ERRORS[errorCode].message;

      response.status(status).send({
        statusCode: HttpStatus.BAD_REQUEST,
        error: error,
      });

      return;
    }

    response.status(status).send({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
    });
  }
}
