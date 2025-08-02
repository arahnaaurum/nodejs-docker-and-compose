/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  PostgresErrorCode,
  PostgresErrorMessage,
} from 'src/helpers/postgrsql-error-codes';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // TypeORM EntityNotFoundError
    if (exception instanceof EntityNotFoundError) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Объект не найден',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    // TypeORM QueryFailedError
    if (exception instanceof QueryFailedError) {
      const driverError = (exception as any).driverError;
      const code = driverError?.code;

      if (
        code === PostgresErrorCode.UniqueViolation ||
        code === PostgresErrorCode.CheckViolation ||
        code === PostgresErrorCode.NotNullViolation ||
        code === PostgresErrorCode.ForeignKeyViolation
      ) {
        return response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: PostgresErrorMessage[code],
          detail: driverError.detail,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
      }

      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: driverError?.message || 'Ошибка запроса в БД',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    // HttpException
    if (
      exception instanceof HttpException ||
      Object.values(HttpStatus).includes((exception as any).status)
    ) {
      const { status, message } = exception as any;
      return response.status(status).json({
        statusCode: status,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    return response.status(500).json({
      statusCode: 500,
      message: 'Что-то пошло не так',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
