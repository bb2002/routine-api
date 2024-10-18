import { HttpException, HttpStatus } from '@nestjs/common';

export class LoginError extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
}

export class NaverLoginIntegrityError extends LoginError {
  constructor() {
    super('Naver login integrity error', HttpStatus.BAD_REQUEST);
  }
}

export class KakaoLoginIntegrityError extends LoginError {
  constructor() {
    super('Kakao login integrity error', HttpStatus.BAD_REQUEST);
  }
}

export class AppleLoginIntegrityError extends LoginError {
  constructor() {
    super('Apple login integrity error', HttpStatus.BAD_REQUEST);
  }
}
