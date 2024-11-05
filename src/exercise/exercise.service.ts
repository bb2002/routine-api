import { Injectable } from '@nestjs/common';
import { CosmosService } from 'src/plugins/cosmos/cosmos.service';
import { ExerciseDto } from './dtos/Exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(private readonly cosmosService: CosmosService) {}

	async getAllExercises(): Promise<ExerciseDto[]> {
		const { container } = await this.exerciseContainer;
		
		const { resources } = await container.items.query({
			query: "SELECT * FROM c",
		}).fetchAll();

		return resources.map((resource) => ExerciseDto.toInstance(resource));
	}

	async getExercisesByCode(exerciseCodes: string[]): Promise<ExerciseDto[]> {
		const { container } = await this.exerciseContainer;

		const { resources } = await container.items.query({
			query: "SELECT * FROM c WHERE ARRAY_CONTAINS(@ExerciseCodeArray, c.ExerciseCode)",
  		parameters: [{ name: "@ExerciseCodeArray", value: exerciseCodes }],
		}).fetchAll();

		return resources.map((resource) => ExerciseDto.toInstance(resource));
	}

	private get exerciseContainer() {
		return this.cosmosService.getDatabaseAndContainer('Exercise');
	}
}
