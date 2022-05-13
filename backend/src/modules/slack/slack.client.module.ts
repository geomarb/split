import { Module } from '@nestjs/common';
import { webApiSlackService } from './slack.providers';

@Module({
  providers: [webApiSlackService],
  exports: [webApiSlackService],
})
export class SlackClientModule {}
