import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SLACK_CHANNEL_PREFIX } from 'src/libs/constants/slack';
import { CreateChannelDto } from '../dto/create.channel.slack.dto';
import { ConversationsSlackServiceInterface } from '../interfaces/services/conversations.slack.service';
import { WebApiSlackService } from './webapi.slack.service';

@Injectable()
export class ConversationsSlackService
  implements ConversationsSlackServiceInterface
{
  private readonly webApiSlackService: WebApiSlackService;

  constructor(private readonly configService: ConfigService) {
    this.webApiSlackService = new WebApiSlackService(configService);

    console.log(this.webApiSlackService);
  }

  async createChannel(createChannelDto: CreateChannelDto) {
    try {
      const today = new Date();

      const result = await this.webApiSlackService.webApi.conversations.create({
        name: `${this.configService.get(SLACK_CHANNEL_PREFIX)}${
          createChannelDto.name
        }-${today.getMonth() + 1}-${today.getFullYear()}`,
      });

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inviteUsersToChannel(channelId: string, usersIds: string[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetchMembersFromChannel(channelId: string): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
}
