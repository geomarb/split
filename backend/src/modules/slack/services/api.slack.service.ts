import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SLACK_MASTER_CHANNEL_ID } from '../../../libs/constants/slack';
import { RetroTeamSlackDto } from '../dto/retro-teams.slack.dto';
import { ConversationsSlackServiceInterface } from '../interfaces/services/conversations.slack.service';
import { UsersSlackServiceInterface } from '../interfaces/services/users.slack.service';
import { RetroTeamMessage, RetroUser, TYPES } from '../interfaces/types';

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
  ): Promise<RetroTeamMessage[]> {
    const messages: RetroTeamMessage[] = [];

    const [retroTeams, messagesFromFill] = await this.fillRetroTeams(
      _retroTeams,
    );
    messages.push(...messagesFromFill);

    const responsiblesList = this.getResponsibles(retroTeams);
    const messagesFromCreateChannelForResponsibles =
      await this.createChannelForResponsibles(responsiblesList);
    messages.push(...messagesFromCreateChannelForResponsibles);

    const messagedFromCreateChannelForEachTeam =
      await this.createChannelForEachTeam(retroTeams);
    messages.push(...messagedFromCreateChannelForEachTeam);

    return messages;
  }

  private async fillRetroTeams(
    _retroTeams: RetroTeamSlackDto[],
  ): Promise<[RetroTeamSlackDto[], RetroTeamMessage[]]> {
    const allUsersIdsOnMasterChannel =
      await this.conversationsSlackService.fetchMembersFromChannelSlowly(
        this.configService.get(SLACK_MASTER_CHANNEL_ID) as string,
      );

    const allUsersProfilesOnMasterChannel =
      await this.usersSlackService.getProfilesByIds(allUsersIdsOnMasterChannel);

    const messages: RetroTeamMessage[] = [];
    const retroTeams = _retroTeams.map((i) => {
      const participants: RetroUser[] = [];
      const messageData: string[] = [];

      i.participants.forEach((participant) => {
        const found = allUsersProfilesOnMasterChannel.find(
          (profile) => profile.email === participant.email,
        );

        if (found) {
          participants.push({ ...participant, slackId: found.userId });
        } else {
          messageData.push(participant.email);
        }
      });

      if (messageData.length > 0) {
        messages.push({
          type: 'warning',
          title: 'Users not assigned to master slack channel',
          data: messageData,
        });
      }

      return {
        ...i,
        participants,
      };
    });

    const retroTeamsSlackIds = retroTeams.reduce((acc, item) => {
      const ids = item.participants.map((i) => i.slackId as string);

      return [...acc, ...ids];
    }, [] as string[]);

    const slackUsersWithoutATeam = allUsersProfilesOnMasterChannel
      .filter((i) => !retroTeamsSlackIds.includes(i.userId))
      .map((i) => i.email);

    if (slackUsersWithoutATeam.length > 0) {
      messages.push({
        type: 'warning',
        title: 'Users assigned to master slack channel without a RetroTeam',
        data: slackUsersWithoutATeam,
      });
    }

    return [retroTeams, messages];
  }

  // this return the list of responsibles
  // if any member was set as responsible the first participant will be chosen
  private getResponsibles(retroTeams: RetroTeamSlackDto[]) {
    return retroTeams.reduce((acc, item) => {
      const responsa = item.participants.find((i) => i.responsible);
      return [...acc, responsa ?? item.participants[0]];
    }, [] as RetroUser[]);
  }

  private async createChannelForResponsibles(
    responsiblesList: RetroUser[],
  ): Promise<RetroTeamMessage[]> {
    const { id: channelId } =
      await this.conversationsSlackService.createChannel({
        name: 'responsibles',
      });

    const inviteResponsiblesSuccess =
      await this.conversationsSlackService.inviteUsersToChannel(
        channelId,
        responsiblesList
          .filter((i) => typeof i.slackId === 'string')
          .map((i) => i.slackId as string),
      );
    const messages: RetroTeamMessage[] = [
      {
        type: 'success',
        title: 'Channel created and all responsibles were invited',
        data: inviteResponsiblesSuccess,
      },
    ];

    const autoNominatedUsersAsResponsibles = responsiblesList.filter(
      (i) => !i.responsible,
    );

    if (autoNominatedUsersAsResponsibles.length > 0) {
      messages.push({
        type: 'warning',
        title:
          'Those teams that did not assign a responsible person were assigned one automatically',
        data: autoNominatedUsersAsResponsibles,
      });
    }

    return messages;
  }

  private async createChannelForEachTeam(
    retroTeams: RetroTeamSlackDto[],
  ): Promise<RetroTeamMessage[]> {
    const createChannelsPromises = retroTeams.map(({ name }) =>
      this.conversationsSlackService.createChannel({
        name,
      }),
    );

    const createdChannels = await Promise.all(createChannelsPromises);

    const inviteUsersPromises = retroTeams.reduce((acc, item, idx) => {
      acc.push(
        this.conversationsSlackService.inviteUsersToChannel(
          createdChannels[idx].id,
          item.participants
            .filter((r) => typeof r.slackId === 'string')
            .map((p) => p.slackId as string),
        ),
      );

      return acc;
    }, [] as Promise<boolean>[]);

    const inviteUsersSuccess = await Promise.all(inviteUsersPromises);

    return [
      {
        type: 'success',
        title: 'Channel created and all members were invited',
        data: inviteUsersSuccess.every((i) => i === true),
      },
    ];
  }
}
