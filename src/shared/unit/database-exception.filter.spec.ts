import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { DatabaseExceptionFilter } from '../filters/database-exception.filter';

describe('DatabaseExceptionFilter', () => {
  let databaseExceptionFilter: DatabaseExceptionFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseExceptionFilter],
    }).compile();

    databaseExceptionFilter = module.get<DatabaseExceptionFilter>(
      DatabaseExceptionFilter,
    );
  });

  describe('Database Exception Filter - Catch', () => {
    it('Should handle TypeORMError with known PostgreSQL error code (22P02)', async () => {
      const exception: any = {};
      exception.code = '22P02';

      const responseMock = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const hostMock: Partial<ArgumentsHost> = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: jest.fn().mockReturnValue(responseMock),
        }),
      };

      databaseExceptionFilter.catch(exception, hostMock);

      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(responseMock.send).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Invalid UUID value passed. Please check your input.',
      });
    });

    it('Should handle TypeORMError with unknown PostgreSQL error code', async () => {
      const exception: any = {};
      exception.code = 'XYZ123';

      const responseMock = {
        status: jest.fn().mockReturnValue({
          send: jest.fn(),
        }),
      };

      const hostMock: Partial<ArgumentsHost> = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: jest.fn().mockReturnValue(responseMock),
        }),
      };

      databaseExceptionFilter.catch(exception, hostMock);

      expect(responseMock.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      /*expect(responseMock.status.send).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
      });*/
    });
  });
});
