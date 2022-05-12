import { ConfigService } from '@nestjs/config';
import { WebClient } from '@slack/web-api';

import { SLACK_API_BOT_TOKEN } from 'src/libs/constants/slack';

export class WebApiSlackService {
  public client: WebClient;

  constructor(private readonly configService: ConfigService) {
    this.client = new WebClient(this.configService.get(SLACK_API_BOT_TOKEN));
  }
}
