import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import RegistrationType from '../types/RegistrationType';

export class LoginRequestDto {
  @ApiProperty({
    description:
      '소셜 로그인 후 해당 프로필에 접근 할 수 있는 AccessToken 입니다.',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  accessToken: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Routine API 에 엑세스 할 수 있는 토큰 입니다.',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: '신규 가입/재가입/로그인 여부 입니다.',
    required: true,
    type: 'enum',
    enum: RegistrationType,
  })
  @IsNotEmpty()
  @IsString()
  registrationType: RegistrationType;
}
