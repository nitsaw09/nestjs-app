import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let res: any = 'INTERNAL_SERVER_ERROR';
    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof HttpException) {
      res = exception.getResponse();
      status = exception.getStatus();
    }

    let message = res;

    if (typeof res === 'object') {
      message = res.message;
      if (Array.isArray(res.message)) {
        message = res.message[0];
      }
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: true,
      message,
    };

    this.logger.error(JSON.stringify(errorResponse));

    response.status(status).json(errorResponse);
  }
}
