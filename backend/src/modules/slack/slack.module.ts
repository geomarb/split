import { Module } from '@nestjs/common';
import { channelSlackService } from './slack.providers';

@Module({
  providers: [channelSlackService],
  exports: [channelSlackService],
})
export class SlackModule {}
