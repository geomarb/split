import { Module } from '@nestjs/common';
import SlackController from './controller/slack.controller';
import {
  webApiSlackService,
  conversationsSlackService,
} from './slack.providers';

@Module({
  providers: [webApiSlackService, conversationsSlackService],
  controllers: [SlackController],
  exports: [],
})
export class SlackModule {}
