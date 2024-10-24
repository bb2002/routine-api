import { Injectable } from '@nestjs/common';
import { CosmosService } from 'src/plugins/cosmos/cosmos.service';
import { ExerciseDto } from './dtos/Exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(private readonly cosmosService: CosmosService) {}

	async getAllExercises(): Promise<ExerciseDto> {
		const { database, container } = await this.exerciseContainer;
		
		const { resources } = await container.items.query({
			query: "SELECT * FROM c",
		}).fetchAll();

		resources.forEach(item => {
			console.log(item);
		});
	}

	private get exerciseContainer() {
		return this.cosmosService.getDatabaseAndContainer('Exercise');
	}
}
