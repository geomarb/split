import { Controller, Inject, Post } from '@nestjs/common';
import { ConversationsSlackServiceInterface } from '../interfaces/services/conversations.slack.service';
import { TYPES } from '../interfaces/types';

@Controller('slack/test')
export default class SlackController {
  constructor(
    @Inject(TYPES.services.ConversationsSlackService)
    private channelSlackService: ConversationsSlackServiceInterface,
  ) {}

  @Post()
  async createChannel() {
    this.channelSlackService.createChannel({
      name: 'teste1',
    });

    return 'ok';
  }
}
