import { Injectable } from '@nestjs/common';
import { UserProfileRepository } from '../repositories/user-profile.repository';
import { plainToInstance } from 'class-transformer';
import { UserProfileDto } from '../dtos/UserProfile.dto';

@Injectable()
export class UserProfileService {
  constructor(private readonly userProfileRepository: UserProfileRepository) {}

  async getUserProfile(userId: bigint): Promise<UserProfileDto | null> {
    const profile = await this.userProfileRepository.getProfile(userId);
    return plainToInstance(UserProfileDto, profile as object);
  }

  async getOrCreateUserProfile(dto: UserProfileDto): Promise<UserProfileDto> {
    const profile = await this.getUserProfile(BigInt(dto.id));
    if (profile) {
      return profile;
    }

    const newProfile = await this.userProfileRepository.createProfile(dto);
    return plainToInstance(UserProfileDto, newProfile);
  }

  async patchProfile(dto: UserProfileDto): Promise<UserProfileDto | null> {
    const profile = this.userProfileRepository.patchProfile(dto);
    return plainToInstance(UserProfileDto, profile);
  }
}
