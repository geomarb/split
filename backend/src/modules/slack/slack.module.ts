import { Module } from '@nestjs/common';

import SlackController from './controller/slack.controller';
import {
  apiSlackService,
  chatSlackService,
  conversationsSlackService,
  usersSlackService,
  webApiSlackService,
} from './slack.providers';

@Module({
  providers: [
    webApiSlackService,
    usersSlackService,
    conversationsSlackService,
    chatSlackService,
    apiSlackService,
  ],
  controllers: [SlackController],
  exports: [apiSlackService],
})
export class SlackModule {}
