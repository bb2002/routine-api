import { Controller, Get, Query } from '@nestjs/common';
import { ExerciseService } from 'src/exercise/exercise.service';

@Controller('routine')
export class RoutineController {
  constructor(private readonly exerciseService: ExerciseService) {}
}
