import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApplicationException } from '../exceptions/application.exception';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    if (exception instanceof ApplicationException) {
      response.status(status).json({
        message: exception.message,
        detailCode: exception.detailCode,
      });
      return;
    }

    if (exception instanceof HttpException) {
      const { message } = exception.getResponse() as any;
      const json = {
        message: exception.message,
        detailCode: -1,
      };

      if (Array.isArray(message)) {
        json.message = message.join(', ');
      }

      response.status(status).json(json);
      return;
    }

    if (exception instanceof Error) {
      // TODO: Sentry 에 로그를 저장하는 로직 추가
      response.status(status).json({
        message: exception.message,
        detailCode: -1,
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
      detailCode: -1,
    });
  }
}
