import { Inject, Injectable, Logger } from '@nestjs/common';
import { UsersSlackServiceInterface } from '../interfaces/services/users.slack.service';
import { TYPES } from '../interfaces/types';
import { WebApiSlackServiceInterface } from '../interfaces/services/webapi.slack.service';
import { Profile } from './webapi.slack.service';

@Injectable()
export class UsersSlackService implements UsersSlackServiceInterface {
  private logger = new Logger(UsersSlackService.name);

  constructor(
    @Inject(TYPES.services.WebApiSlackService)
    private readonly webApiSlackService: WebApiSlackServiceInterface,
  ) {}

  async getProfilesByIds(usersIds: string[]): Promise<Profile[]> {
    try {
      const profiles: Profile[] = [];

      // eslint-disable-next-line no-restricted-syntax
      for await (const id of usersIds) {
        const profile = await this.getProfileById(id);
        if (typeof profile === 'object' && profile.userId) {
          profiles.push(profile);
        }
      }

      return profiles;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  private async getProfileById(userId: string): Promise<Profile> {
    // https://api.slack.com/methods/users.profile.get
    const { profile } = await this.webApiSlackService
      .getClient()
      .users.profile.get({
        user: userId,
      });

    return { ...profile, userId } || {};
  }
}
