import { Controller, Inject, Post } from '@nestjs/common';
import { RetroTeamSlackDto } from '../dto/retro-teams.slack.dto';

import { TYPES } from '../interfaces/types';
import { ApiSlackService } from '../services/api.slack.service';

@Controller('slack')
export default class SlackController {
  constructor(
    @Inject(TYPES.services.ApiSlackService)
    private apiSlackService: ApiSlackService,
  ) {}

  @Post('/test1')
  async test1() {
    const retroTeams: RetroTeamSlackDto[] = [
      {
        name: 'team-1',
        participants: [
          {
            email: 'mourabraz@hotmail.com',
          },
          {
            email: 'cmourabraz@gmail.com',
          },
        ],
      },
    ];

    return this.apiSlackService.createChannelsForRetroTeam(retroTeams);
  }
}
