import { Controller, Get, Query } from '@nestjs/common';
import { ExerciseService } from 'src/exercise/exercise.service';

@Controller('routine')
export class RoutineController {
  constructor(private readonly exerciseService: ExerciseService) {}

	@Get()
	async test(@Query('id') id) {
		console.log(id)
		return this.exerciseService.getExercisesByCode([id, 'Dips']);
	}
}
