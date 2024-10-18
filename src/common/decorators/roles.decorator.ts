import { SetMetadata } from '@nestjs/common';
import UserRole from '../../user/types/UserRole';

export const Roles = (roles: UserRole[]) => SetMetadata('roles', roles);
