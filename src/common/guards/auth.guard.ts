import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import parseBearerToken from '../utils/parseBearerToken';
import { Reflector } from '@nestjs/core';
import UserRole from '../../user/types/UserRole';
import { JwtService } from '@nestjs/jwt';
import { RoutineUser } from '../types/RoutineUser';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const roles = this.reflector.get<UserRole[] | undefined>(
      'roles',
      context.getHandler(),
    );

    const accessToken = parseBearerToken(request.header('Authorization'));
    if (accessToken === null) {
      return roles === undefined;
    }

    const { userId } = this.jwtService.decode(accessToken);
    const user = await this.userService.getUser(BigInt(userId));
    if (user) {
      request.user = {
        id: user.id,
        kakaoId: user.kakao_provider_id,
        naverId: user.naver_provider_id,
        appleId: user.apple_provider_id,
        role: user.role,
        createdAt: user.created_at,
      } as RoutineUser;

      const role = user.role as UserRole;
      return roles === undefined || roles.includes(role);
    }

    return false;
  }
}
