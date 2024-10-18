import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class NaverProfileDto {
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

  @IsString()
  @Matches(/^(19\d\d|20[0-9][0-9])$/)
  @IsOptional()
  birthyear?: string;
}
