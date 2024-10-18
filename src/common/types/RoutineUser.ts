import { UserProfileDto } from '../../user/dtos/UserProfile.dto';
import UserRole from '../../user/types/UserRole';

export interface RoutineUser {
  id: bigint;
  kakaoId?: string;
  naverId?: string;
  appleId?: string;
  role?: UserRole;
  profile?: UserProfileDto;
  createdAt?: Date;
}
