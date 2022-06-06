export const TYPES = {
  services: {
    ApiSlackService: 'ApiSlackService',
    ChatSlackService: 'ChatSlackService',
    ConversationsSlackService: 'ConversationsSlackService',
    UsersSlackService: 'UsersSlackService',
    WebApiSlackService: 'WebApiSlackService',
  },
};

export type RetroError = {
  message: string;
};

export type RetroUser = {
  email: string;
  name?: string;
  slackId?: string;
  responsible?: boolean;
  errors?: RetroError[];
};

export type RetroTeamMessageType = 'error' | 'warning' | 'info' | 'success';

export type RetroTeamMessage = {
  type: RetroTeamMessageType;
  title?: string;
  body?: string;
  data?: any;
};
