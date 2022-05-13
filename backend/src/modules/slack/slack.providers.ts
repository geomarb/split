import { TYPES } from './interfaces/types';
import { ConversationsSlackService } from './services/conversations.slack.service';
import { UsersSlackService } from './services/users.slack.service';
import { WebApiSlackService } from './services/webapi.slack.service';

export const webApiSlackService = {
  provide: TYPES.services.WebApiSlackService,
  useClass: WebApiSlackService,
};

export const conversationsSlackService = {
  provide: TYPES.services.ConversationsSlackService,
  useClass: ConversationsSlackService,
};

export const usersSlackService = {
  provide: TYPES.services.UsersSlackService,
  useClass: UsersSlackService,
};
