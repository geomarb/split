import { Module } from '@nestjs/common';
// import SlackController from './controller/slack.controller';
import { SlackApiModule } from './slack.api.module';
import { SlackClientModule } from './slack.client.module';

@Module({
  imports: [SlackClientModule, SlackApiModule],
})
export class SlackModule {}
