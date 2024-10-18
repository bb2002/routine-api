import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({
    required: true,
    type: String,
    description: '유저의 고유 ID',
  })
  @IsString()
  readonly id: string;

  @ApiProperty({
    required: true,
    type: String,
    description: '닉네임',
  })
  @IsString()
  nickname: string;

  @ApiProperty({
    required: true,
    type: String,
    description: '프로필 사진 URL',
  })
  @IsString()
  profileImage: string;

  @ApiProperty({
    required: false,
    type: String,
    description: '전자메일',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: '성별 (M=남, F=여)',
  })
  @IsEnum(['M', 'F'])
  @IsOptional()
  gender?: 'M' | 'F';

  @ApiProperty({
    required: false,
    type: String,
    description: '태어난 해',
  })
  @IsString()
  @Matches(/^(19\d\d|20[0-9][0-9])$/)
  @IsOptional()
  birthyear?: string;

  @ApiProperty({
    required: false,
    type: Number,
    description: '키 (cm 단위)',
  })
  @IsNumber()
  @IsOptional()
  @Min(100)
  @Max(250)
  @Transform(({ value }) => Number(value))
  heightInCentimeter?: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: '몸무게 (kg 단위)',
  })
  @IsNumber()
  @IsOptional()
  @Min(10)
  @Max(200)
  @Transform(({ value }) => Number(value))
  weightInKilogram?: number;
}

export class FetchUserProfileDto extends OmitType(UserProfileDto, [
  'id',
  'nickname',
  'profileImage',
]) {
  @ApiProperty({
    required: false,
    type: String,
    description: '닉네임',
  })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: '프로필 사진 URL',
  })
  @IsString()
  @IsOptional()
  profileImage?: string;
}
