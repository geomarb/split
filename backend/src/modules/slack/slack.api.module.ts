import { Module } from '@nestjs/common';
import SlackController from './controller/slack.controller';
import { SlackClientModule } from './slack.client.module';
import {
  conversationsSlackService,
  usersSlackService,
} from './slack.providers';

@Module({
  imports: [SlackClientModule],
  providers: [usersSlackService, conversationsSlackService],
  controllers: [SlackController],
  exports: [usersSlackService, conversationsSlackService],
})
export class SlackApiModule {}
