import { Module } from '@nestjs/common';
import SlackController from './controller/slack.controller';
import { conversationsSlackService } from './slack.providers';

@Module({
  providers: [conversationsSlackService],
  controllers: [SlackController],
  exports: [conversationsSlackService],
})
export class SlackModule {}
