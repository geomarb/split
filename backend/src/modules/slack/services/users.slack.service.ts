import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersSlackServiceInterface } from '../interfaces/services/users.slack.service';
import { TYPES } from '../interfaces/types';
import { Profile, WebApiSlackService } from './webapi.slack.service';

@Injectable()
export class UsersSlackService implements UsersSlackServiceInterface {
  private logger = new Logger(UsersSlackService.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => TYPES.services.WebApiSlackService))
    private readonly webApiSlackService: WebApiSlackService,
  ) {}

  async getProfileById(userId: string): Promise<Profile> {
    try {
      // https://api.slack.com/methods/users.profile.get
      const { profile } =
        await this.webApiSlackService.client.users.profile.get({
          user: userId,
        });

      return profile || {};
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async getProfilesByIds(usersIds: string[]): Promise<Profile[]> {
    try {
      const profiles: Profile[] = [];

      // eslint-disable-next-line no-restricted-syntax
      for await (const id of usersIds) {
        profiles.push(await this.getProfileById(id));
      }

      return profiles;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async getEmailById(userId: string): Promise<string> {
    try {
      // https://api.slack.com/methods/users.profile.get
      const { profile } =
        await this.webApiSlackService.client.users.profile.get({
          user: userId,
        });

      return profile?.email || '';
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async getEmailsByIds(usersIds: string[]): Promise<Record<string, string>[]> {
    try {
      const idsEmails = {} as Record<string, string>[];

      // eslint-disable-next-line no-restricted-syntax
      for await (const id of usersIds) {
        idsEmails[id] = await this.getEmailById(id);
      }

      return idsEmails;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }
}
