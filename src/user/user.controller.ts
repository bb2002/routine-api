import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserProfileService } from './services/user-profile.service';
import LoginProvider from './types/LoginProvider';
import { FetchUserProfileDto, UserProfileDto } from './dtos/UserProfile.dto';
import { plainToInstance } from 'class-transformer';
import { LoginRequestDto, LoginResponseDto } from './dtos/Login.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Everyone } from './types/UserRole';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RoutineUser } from '../common/types/RoutineUser';
import { AuthGuard } from '../common/guards/auth.guard';
import { UserProfileNotFound } from './exceptions/UserProfile.exception';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import RoutineError from '../common/types/RoutineError';
import { FileInterceptor } from '@nestjs/platform-express';
import * as url from 'url';
import profileImageAzureStorage from '../common/multer/ProfileImageAzureStorage';
import { PutProfileImageResponseDto } from './dtos/PutProfileImage.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userProfileService: UserProfileService,
  ) {}

  @ApiOperation({ summary: '네이버 로그인' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `AccessToken 이 잘못된 경우`,
  })
  @Post('/login/naver')
  async loginWithNaverAccount(@Body() { accessToken }: LoginRequestDto) {
    const naverProfileDto = await this.userService.getNaverProfile(accessToken);

    // 로그인 또는 가입 처리
    const entryResult = await this.userService.entry({
      provider: LoginProvider.NAVER,
      providerId: naverProfileDto.uniqueId,
    });

    // 프로필 정보 생성 및 업데이트
    const userProfileDto = plainToInstance(UserProfileDto, {
      id: String(entryResult.user.id),
      nickname: naverProfileDto.nickname,
      profileImage: naverProfileDto.profileImage,
      email: naverProfileDto.email,
      gender: naverProfileDto.gender,
      birthyear: naverProfileDto.birthyear,
    });
    await this.userProfileService.getOrCreateUserProfile(userProfileDto);
    await this.userProfileService.patchProfile(userProfileDto);

    return plainToInstance(LoginResponseDto, {
      accessToken: entryResult.accessToken,
      registrationType: entryResult.registrationType,
    });
  }

  @ApiOperation({ summary: '카카오 로그인' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `AccessToken 이 잘못된 경우`,
  })
  @Post('login/kakao')
  async loginWithKakaoAccount(@Body() { accessToken }: LoginRequestDto) {
    const kakaoProfile = await this.userService.getKakaoProfile(accessToken);
    const entryResult = await this.userService.entry({
      provider: LoginProvider.KAKAO,
      providerId: kakaoProfile.uniqueId,
    });
    const userProfileDto = plainToInstance(UserProfileDto, {
      id: String(entryResult.user.id),
      nickname: kakaoProfile.nickname,
      profileImage: kakaoProfile.profileImage,
    });
    await this.userProfileService.getOrCreateUserProfile(userProfileDto);
    await this.userProfileService.patchProfile(userProfileDto);

    return plainToInstance(LoginResponseDto, {
      accessToken: entryResult.accessToken,
      registrationType: entryResult.registrationType,
    });
  }

  @ApiOperation({ summary: '사용자 프로필 읽기' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '프로필 읽기 성공',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `프로필 정보가 없는 경우 (code: ${RoutineError.USER_PROFILE_NOT_FOUND})`,
  })
  @ApiBearerAuth('AccessToken')
  @Roles(Everyone)
  @UseGuards(AuthGuard)
  @Get('/profile')
  async getMyProfile(@CurrentUser() user: RoutineUser) {
    const profile = await this.userProfileService.getUserProfile(user.id);
    if (!profile) {
      throw new UserProfileNotFound();
    }

    return profile;
  }

  @ApiOperation({
    summary: '사용자 프로필 수정',
    description: '수정을 원하는 필드만 전달합니다.',
  })
  @ApiBody({ type: FetchUserProfileDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '프로필 수정 성공',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `프로필 정보가 없는 경우 (code: ${RoutineError.USER_PROFILE_NOT_FOUND})`,
  })
  @ApiBearerAuth('AccessToken')
  @Roles(Everyone)
  @UseGuards(AuthGuard)
  @Patch('/profile')
  async patchMyProfile(
    @CurrentUser() user: RoutineUser,
    @Body() dto: FetchUserProfileDto,
  ) {
    const profile = await this.userProfileService.getUserProfile(user.id);
    if (!profile) {
      throw new UserProfileNotFound();
    }

    return this.userProfileService.patchProfile(
      plainToInstance(UserProfileDto, {
        id: profile.id,
        ...dto,
      }),
    );
  }

  @ApiOperation({
    summary: '프로필 사진 업로드',
    description:
      '새 프로필 사진을 등록합니다. 기존 사진을 수정하지 않으며, 수정하려면 PATCH /user/profile 를 사용하세요.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '업로드 성공',
    type: PutProfileImageResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      '지원하지 않는 확장자 (jpg, jpeg, png 만 업로드 가능) 또는 파일이 없는 경우',
  })
  @ApiResponse({
    status: HttpStatus.PAYLOAD_TOO_LARGE,
    description: '업로드 용량 초과 (최대 5MB)',
  })
  @ApiBearerAuth('AccessToken')
  @Roles(Everyone)
  @UseGuards(AuthGuard)
  @Put('/profile/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: profileImageAzureStorage,
      limits: {
        files: 1,
        fileSize: 1024 * 1024 * 5,
      },
    }),
  )
  async putMyProfileImage(@UploadedFile() file) {
    if (!file) {
      throw new BadRequestException();
    }

    const contentURL = new URL(file.url);
    contentURL.search = '';

    return plainToInstance(PutProfileImageResponseDto, {
      profileImage: url.format(contentURL),
      contentSize: Number(file.blobSize),
    });
  }
}
