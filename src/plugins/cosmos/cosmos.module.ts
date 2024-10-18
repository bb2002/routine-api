import { Module } from '@nestjs/common';
import { CosmosService } from './cosmos.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [CosmosService],
  imports: [ConfigModule.forRoot()],
  exports: [CosmosService],
})
export class CosmosModule {}
