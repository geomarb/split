import { Module } from '@nestjs/common';
import SlackController from './controller/slack.controller';
import {
  conversationsSlackService,
  usersSlackService,
} from './slack.providers';

@Module({
  providers: [usersSlackService, conversationsSlackService],
  controllers: [SlackController],
  exports: [],
})
export class SlackModule {}
