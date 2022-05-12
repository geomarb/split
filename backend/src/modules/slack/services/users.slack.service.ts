import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersSlackServiceInterface } from '../interfaces/services/users.slack.service';
import { WebApiSlackService } from './webapi.slack.service';

@Injectable()
export class UsersSlackService implements UsersSlackServiceInterface {
  private logger = new Logger(UsersSlackService.name);

  private readonly webApiSlackService: WebApiSlackService;

  constructor(private readonly configService: ConfigService) {
    this.webApiSlackService = new WebApiSlackService(configService);
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
}
