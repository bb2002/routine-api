import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './plugins/prisma/prisma.module';
import { CosmosModule } from './plugins/cosmos/cosmos.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from './app.service';
import { ExerciseModule } from './exercise/exercise.module';
import { RoutineModule } from './routine/routine.module';

@Module({
  imports: [
    PrismaModule,
    CosmosModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2w' },
    }),
    UserModule,
    ExerciseModule,
    RoutineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
