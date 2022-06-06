import { Inject, Injectable, Logger } from '@nestjs/common';
import { ChatSlackServiceInterface } from '../interfaces/services/chat.slack.service';
import { WebApiSlackServiceInterface } from '../interfaces/services/webapi.slack.service';
import { TYPES } from '../interfaces/types';

@Injectable()
export class ChatSlackService implements ChatSlackServiceInterface {
  private logger = new Logger(ChatSlackService.name);

  constructor(
    @Inject(TYPES.services.WebApiSlackService)
    private readonly webApiSlackService: WebApiSlackServiceInterface,
  ) {}

  async postMessage(
    channelId: string,
    text: string,
  ): Promise<{ ok: boolean; channel: string }> {
    try {
      // https://api.slack.com/methods/chat.postMessage
      const { ok, channel } = await this.webApiSlackService
        .getClient()
        .chat.postMessage({
          channel: channelId,
          text,
        });

      return { ok, channel: channel || '' };
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }
}
