import { HttpException } from '@nestjs/common';

export class ApplicationException extends HttpException {
  private readonly _detailCode: number;
  constructor(message: string, statusCode: number, detailCode: number) {
    super(message, statusCode);
    this._detailCode = detailCode;
  }

  get detailCode() {
    return this._detailCode;
  }
}
