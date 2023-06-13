import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { FileOperationsException } from './file-operations.exception';

@Catch(FileOperationsException)
export class FileOperationsExceptionFilter implements ExceptionFilter {
  catch(exception: FileOperationsException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const message = exception.message;

    response.status(500).json({
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
