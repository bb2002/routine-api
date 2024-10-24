import { IsString, IsUrl } from "class-validator";

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
}