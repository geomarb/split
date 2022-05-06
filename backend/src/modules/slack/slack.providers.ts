import { TYPES } from './interfaces/types';
import { ChannelSlackService } from './services/channel.slack.service';

export const channelSlackService = {
  provide: TYPES.services.ChannelSlackService,
  useClass: ChannelSlackService,
};
