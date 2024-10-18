import { IsNumber, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PutProfileImageResponseDto {
  @ApiProperty({
    description: '프로필 이미지 URL',
    required: true,
    type: String,
  })
  @IsUrl()
  profileImage: string;

  @ApiProperty({
    description: '업로드된 콘텐츠 크기',
    required: true,
    type: Number,
  })
  @IsNumber()
  contentSize: number;
}
