import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../plugins/prisma/prisma.service';
import LoginProvider from '../types/LoginProvider';
import UserRole from '../types/UserRole';
import { Snowflake } from 'nodejs-snowflake';

export interface CreateUserParams {
  provider: LoginProvider;
  providerId: string;
  role: UserRole;
}

export interface FindOneByProviderIdParams {
  provider: LoginProvider;
  providerId: string;
}

@Injectable()
export class UserRepository {
  private readonly snowflake = new Snowflake();
  constructor(private readonly prismaService: PrismaService) {}

  findOneByProviderId({ providerId, provider }: FindOneByProviderIdParams) {
    return this.prismaService.user.findFirst({
      where: {
        ...(provider === LoginProvider.KAKAO
          ? { kakao_provider_id: providerId }
          : {}),
        ...(provider === LoginProvider.NAVER
          ? { naver_provider_id: providerId }
          : {}),
        ...(provider === LoginProvider.APPLE
          ? { apple_provider_id: providerId }
          : {}),
      },
    });
  }

  async createUser({ providerId, provider, role }: CreateUserParams) {
    const id = this.snowflake.getUniqueID() as bigint;

    return this.prismaService.user.create({
      data: {
        id,
        ...(provider === LoginProvider.KAKAO
          ? { kakao_provider_id: providerId }
          : {}),
        ...(provider === LoginProvider.NAVER
          ? { naver_provider_id: providerId }
          : {}),
        ...(provider === LoginProvider.APPLE
          ? { apple_provider_id: providerId }
          : {}),
        role,
      },
    });
  }

  async updateUser(id: bigint, data: any) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async getUser(id: bigint) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }
}
