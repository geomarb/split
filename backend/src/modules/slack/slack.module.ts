import { Module } from '@nestjs/common';
import SlackController from './controller/slack.controller';
import { ApiSlackService } from './services/api.slack.service';
import { ConversationsSlackService } from './services/conversations.slack.service';
import { UsersSlackService } from './services/users.slack.service';
import { WebApiSlackService } from './services/webapi.slack.service';

@Module({
  providers: [
    WebApiSlackService,
    UsersSlackService,
    ConversationsSlackService,
    ApiSlackService,
  ],
  controllers: [SlackController],
  exports: [ApiSlackService],
})
export class SlackModule {}
