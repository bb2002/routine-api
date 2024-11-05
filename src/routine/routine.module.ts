import { Module } from '@nestjs/common';
import { RoutineController } from './routine.controller';
import { RoutineService } from './routine.service';
import { ExerciseModule } from 'src/exercise/exercise.module';

@Module({
  controllers: [RoutineController],
  providers: [RoutineService],
  imports: [ExerciseModule]
})
export class RoutineModule {}
