import { ConfigService } from '@nestjs/config';
import { WebClient } from '@slack/web-api';

import { SLACK_API_BOT_TOKEN } from 'src/libs/constants/slack';

export class WebApiSlackService {
  public webApi: WebClient;

  constructor(private readonly configService: ConfigService) {
    this.webApi = new WebClient(this.configService.get(SLACK_API_BOT_TOKEN));
  }
}
