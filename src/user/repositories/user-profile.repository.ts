import { Injectable } from '@nestjs/common';
import { CosmosService } from '../../plugins/cosmos/cosmos.service';
import { UserProfileDto } from '../dtos/UserProfile.dto';

@Injectable()
export class UserProfileRepository {
  constructor(private readonly cosmosService: CosmosService) {}

  async getProfile(userId: bigint) {
    const { container } = await this.UserProfileContainer;
    const { resource } = await container
      .item(String(userId), String(userId))
      .read();
    return resource;
  }

  async createProfile(dto: UserProfileDto) {
    const { container } = await this.UserProfileContainer;
    const { resource } = await container.items.create(dto);
    return resource;
  }

  async patchProfile(dto: UserProfileDto) {
    const profile = await this.getProfile(BigInt(dto.id));
    if (!profile) {
      return null;
    }

    for (const key in dto) {
      if (dto.hasOwnProperty(key) && dto[key] !== undefined) {
        profile[key] = dto[key];
      }
    }

    const { container } = await this.UserProfileContainer;
    const result = await container
      .item(String(dto.id), String(dto.id))
      .replace(profile);

    return result.resource;
  }

  async putProfile(dto: UserProfileDto) {
    const raw = await this.getProfile(BigInt(dto.id));

    if (raw) {
      return this.patchProfile(dto);
    } else {
      return this.putProfile(dto);
    }
  }

  async deleteProfile(userId: bigint) {
    const { container } = await this.UserProfileContainer;
    const { resource } = await container.item(String(userId)).delete();
    return resource;
  }

  private get UserProfileContainer() {
    return this.cosmosService.getDatabaseAndContainer('UserProfile');
  }
}
