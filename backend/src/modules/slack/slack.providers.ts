import { TYPES } from './interfaces/types';
import { ConversationsSlackService } from './services/conversations.slack.service';

export const conversationsSlackService = {
  provide: TYPES.services.ConversationsSlackService,
  useClass: ConversationsSlackService,
};
