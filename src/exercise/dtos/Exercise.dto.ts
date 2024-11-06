import { plainToInstance } from 'class-transformer';
import { IsString, IsUrl } from 'class-validator';

export class ExerciseDto {
  @IsString()
  id: string;

  @IsString()
  exerciseName: string;

  @IsString()
  exerciseCode: string;

  @IsUrl()
  thumbnail: string;

  @IsUrl()
  video: string;

  static toInstance(plain: any) {
    return plainToInstance(ExerciseDto, {
      id: plain.id,
      exerciseName: plain['ExerciseName'],
      exerciseCode: plain['ExerciseCode'],
      thumbnail: plain['Thumbnail'],
      video: plain['Video'],
    });
  }
}
