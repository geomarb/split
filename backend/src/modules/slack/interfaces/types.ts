export const TYPES = {
  services: {
    ApiSlackService: 'ApiSlackService',
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
  slackId?: string;
  responsible?: boolean;
  errors?: RetroError[];
};
