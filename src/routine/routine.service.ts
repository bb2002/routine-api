import { Injectable } from '@nestjs/common';
import { ExerciseService } from 'src/exercise/exercise.service';
import { CosmosService } from 'src/plugins/cosmos/cosmos.service';

@Injectable()
export class RoutineService {
  constructor(
    private readonly exerciseService: ExerciseService,
    private readonly cosmosService: CosmosService,
  ) {}

  async getAllPublicRoutines() {}
}
