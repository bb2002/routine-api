import { Module } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CosmosModule } from 'src/plugins/cosmos/cosmos.module';

@Module({
  providers: [ExerciseService],
  imports: [CosmosModule]
})
export class ExerciseModule {}
