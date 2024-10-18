import { ApplicationException } from '../../common/exceptions/application.exception';
import { HttpStatus } from '@nestjs/common';
import RoutineError from '../../common/types/RoutineError';

export class UserProfileNotFound extends ApplicationException {
  constructor() {
    super(
      'User profile not found',
      HttpStatus.NOT_FOUND,
      RoutineError.USER_PROFILE_NOT_FOUND,
    );
  }
}
