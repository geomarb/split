import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SLACK_MASTER_CHANNEL_ID } from 'src/libs/constants/slack';
import { RetroTeamSlackDto } from '../dto/retro-teams.slack.dto';
import { ConversationsSlackServiceInterface } from '../interfaces/services/conversations.slack.service';
import { UsersSlackServiceInterface } from '../interfaces/services/users.slack.service';
import { RetroUser, TYPES } from '../interfaces/types';

@Injectable()
export class ApiSlackService {
  private logger = new Logger(ApiSlackService.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject(TYPES.services.ConversationsSlackService)
    private readonly conversationsSlackService: ConversationsSlackServiceInterface,
    @Inject(TYPES.services.UsersSlackService)
    private readonly usersSlackService: UsersSlackServiceInterface,
  ) {}

  async createChannelsForRetroTeam(
    _retroTeams: RetroTeamSlackDto[],
  ): Promise<void> {
    const retroTeams = await this.fillRetroTeams(_retroTeams);

    const responsiblesList = retroTeams
      .map((retroTeam) =>
        retroTeam.participants.find((participant) => participant.responsible),
      )
      .filter((i) => !!i) as RetroUser[];

    await this.createChannelForResponsibles(responsiblesList);

    await this.createChannelForEachTeam(retroTeams);
  }

  private async fillRetroTeams(
    _retroTeams: RetroTeamSlackDto[],
  ): Promise<RetroTeamSlackDto[]> {
    const retroTeams = [..._retroTeams];

    const allUsersIdsOnMasterChannel =
      await this.conversationsSlackService.fetchMembersFromChannelSlowly(
        this.configService.get(SLACK_MASTER_CHANNEL_ID) as string,
      );

    const allUsersProfilesOnMasterChannel =
      await this.usersSlackService.getProfilesByIds(allUsersIdsOnMasterChannel);

    retroTeams.forEach((i) =>
      i.participants.forEach((participant) => {
        const found = allUsersProfilesOnMasterChannel.find(
          (profile) => profile.email === participant.email,
        );

        if (found) {
          participant.slackId = found.userId;
        }
      }),
    );

    return retroTeams;
  }

  private async createChannelForResponsibles(
    responsiblesList: RetroUser[],
  ): Promise<boolean> {
    const channelId = await this.conversationsSlackService.createChannel({
      name: 'responsibles',
    });

    const inviteResponsiblesSuccess =
      await this.conversationsSlackService.inviteUsersToChannel(
        channelId,
        responsiblesList.map((r) => r.slackId),
      );

    return inviteResponsiblesSuccess;
  }

  private async createChannelForEachTeam(
    retroTeams: RetroTeamSlackDto[],
  ): Promise<boolean> {
    const createChannelsPromises = retroTeams.map(({ name }) =>
      this.conversationsSlackService.createChannel({
        name,
      }),
    );

    const createdChannels = await Promise.all(createChannelsPromises);

    const inviteUsersPromises = retroTeams.reduce((acc, item, idx) => {
      acc.push(
        this.conversationsSlackService.inviteUsersToChannel(
          createdChannels[idx],
          item.participants.map((p) => p.slackId),
        ),
      );

      return acc;
    }, [] as Promise<boolean>[]);

    const inviteUsersSuccess = await Promise.all(inviteUsersPromises);

    return inviteUsersSuccess.every((i) => i === true);
  }
}
