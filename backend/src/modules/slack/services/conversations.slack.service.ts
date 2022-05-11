import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  SLACK_API_BOT_TOKEN,
  SLACK_CHANNEL_PREFIX,
} from 'src/libs/constants/slack';
import { CreateChannelDto } from '../dto/create.channel.slack.dto';
import { ConversationsSlackServiceInterface } from '../interfaces/services/conversations.slack.service';

@Injectable()
export class ConversationsSlackService
  implements ConversationsSlackServiceInterface
{
  constructor(private readonly configService: ConfigService) {}

  async createChannel(createChannelDto: CreateChannelDto) {
    console.log(this.configService.get(SLACK_API_BOT_TOKEN));
    console.log(this.configService.get(SLACK_CHANNEL_PREFIX));
    console.log('ChannelSlackService@createChannel', createChannelDto);

    try {
      const result = await axios.post(
        'https://slack.com/api/admin.usergroups.addChannels',
        {
          channel: 'C03E6SA065Q',
          text: 'I hope the tour went well, Mr. Wonka.',
        },
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${this.configService.get(
              SLACK_API_BOT_TOKEN,
            )}`,
          },
        },
      );

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inviteUsersToChannel(channelId: string, usersIds: string[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
