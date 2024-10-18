import { HttpStatus, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { NaverProfileDto } from '../dtos/NaverProfile.dto';
import { validateOrReject } from 'class-validator';
import { UserRepository } from '../repositories/user.repository';
import LoginProvider from '../types/LoginProvider';
import UserRole from '../types/UserRole';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import RegistrationType from '../types/RegistrationType';
import { User } from '@prisma/client';
import {
  KakaoLoginIntegrityError,
  LoginError,
  NaverLoginIntegrityError,
} from '../exceptions/LoginError.exception';
import { KakaoProfileDto } from '../dtos/KakaoProfile.dto';

interface EntryParams {
  provider: LoginProvider;
  providerId: string;
}

export interface EntryResult {
  accessToken: string;
  user: User;
  registrationType: RegistrationType;
}

interface GetSNSProfileParams {
  endpoint: string;
  accessToken: string;
  error: LoginError;
}

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async getNaverProfile(naverAccessToken: string): Promise<NaverProfileDto> {
    return this.getSNSProfile<NaverProfileDto>(
      {
        endpoint: 'https://openapi.naver.com/v1/nid/me',
        accessToken: naverAccessToken,
        error: new NaverLoginIntegrityError(),
      },
      (data: any) =>
        plainToInstance(NaverProfileDto, {
          uniqueId: data.id,
          nickname: data.nickname,
          name: data.name,
          profileImage: data.profile_image,
          email: data.email,
          gender:
            data.gender === 'M' || data.gender === 'F' ? data.gender : null,
          birthyear: data.birthyear,
        }),
    );
  }

  async getKakaoProfile(kakaoAccessToken: string): Promise<KakaoProfileDto> {
    return this.getSNSProfile<KakaoProfileDto>(
      {
        endpoint: 'https://kapi.kakao.com/v2/user/me',
        accessToken: kakaoAccessToken,
        error: new KakaoLoginIntegrityError(),
      },
      (data: any) =>
        plainToInstance(KakaoProfileDto, {
          uniqueId: String(data.id),
          nickname: data.properties.nickname,
          profileImage: data.properties.profile_image,
        }),
    );
  }

  async entry({ provider, providerId }: EntryParams): Promise<EntryResult> {
    const user = await this.userRepository.findOneByProviderId({
      provider,
      providerId,
    });

    if (user && user.deleted_at) {
      // 탈퇴한 유저의 경우 계정 복구
      await this.userRepository.updateUser(user.id, {
        deleted_at: null,
      });

      return {
        accessToken: this.generateJWT(user.id),
        user,
        registrationType: RegistrationType.RETURNING,
      };
    }

    if (!user) {
      // 신규 가입자의 경우
      const newUser = await this.userRepository.createUser({
        provider,
        providerId,
        role: UserRole.USER,
      });

      return {
        accessToken: this.generateJWT(newUser.id),
        user: newUser,
        registrationType: RegistrationType.SIGNUP,
      };
    }

    return {
      accessToken: this.generateJWT(user.id),
      user,
      registrationType: RegistrationType.SIGNIN,
    };
  }

  async getUser(userId: bigint) {
    return this.userRepository.getUser(userId);
  }

  private generateJWT(userId: bigint) {
    return this.jwtService.sign({
      userId: String(userId),
    });
  }

  private async getSNSProfile<R>(
    { endpoint, accessToken, error }: GetSNSProfileParams,
    process: (data: any) => R,
  ): Promise<R> {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      validateStatus: () => true,
    });

    if (response.status !== HttpStatus.OK) {
      throw error;
    }

    const data = response?.data?.response || response?.data;
    if (!data) {
      throw error;
    }

    const dto = process(data);
    await validateOrReject(dto as object);
    return dto;
  }
}
