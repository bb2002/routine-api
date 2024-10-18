import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class KakaoProfileDto {
  @IsString()
  uniqueId: string;

  @IsString()
  nickname: string;

  @IsString()
  profileImage: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(['M', 'F'])
  @IsOptional()
  gender?: 'M' | 'F';

  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsOptional()
  birthday?: string;
}
