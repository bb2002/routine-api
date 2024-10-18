import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserProfileService } from './services/user-profile.service';
import { UserController } from './user.controller';
import { CosmosModule } from '../plugins/cosmos/cosmos.module';
import { PrismaModule } from '../plugins/prisma/prisma.module';
import { UserRepository } from './repositories/user.repository';
import { UserProfileRepository } from './repositories/user-profile.repository';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserProfileService,
    UserRepository,
    UserProfileRepository,
  ],
  exports: [UserService, UserProfileService],
  imports: [PrismaModule, CosmosModule],
})
export class UserModule {}
