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

  // returns a new RetroTeams collection, remove all users without a slack ID
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
  // if any member was not set as responsible the first participant will be chosen
  private getResponsibles(retroTeams: RetroTeamSlackDto[]) {
    return retroTeams.reduce((acc, item) => {
      const responsa = item.participants.find((i) => i.responsible);
      return [...acc, responsa ?? item.participants[0]];
    }, [] as RetroUser[]);
  }

  private async createChannelForResponsibles(
    responsiblesList: RetroUser[],
  ): Promise<RetroTeamMessage[]> {
    const messages: RetroTeamMessage[] = [];

    const { id: channelId, name } =
      await this.conversationsSlackService.createChannel({
        name: 'responsibles',
      });
    messages.push({
      type: 'success',
      title: 'Channel for responsibles created',
      data: { id: channelId, name },
    });

    const inviteResponsiblesSuccess =
      await this.conversationsSlackService.inviteUsersToChannel(
        channelId,
        responsiblesList
          .filter((i) => typeof i.slackId === 'string')
          .map((i) => i.slackId as string),
      );
    messages.push({
      type: 'success',
      title: 'All responsibles were invited',
      data: inviteResponsiblesSuccess,
    });

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
    const messages: RetroTeamMessage[] = [];

    const createChannelsPromises = retroTeams.map(({ name }) =>
      this.conversationsSlackService.createChannel({
        name,
      }),
    );

    const [successCreateChannels, errorCreateChannels] =
      await this.resolveAllPromises(createChannelsPromises);

    if (successCreateChannels.length > 0) {
      messages.push({
        type: 'success',
        title: 'Channels for teams created',
        data: successCreateChannels,
      });
    }

    if (errorCreateChannels.length > 0) {
      messages.push({
        type: 'error',
        title: 'Channels for teams fails',
        data: errorCreateChannels,
      });
    }

    const inviteUsersPromises = successCreateChannels.reduce((acc, item) => {
      const found = retroTeams.find((i) => item.name.includes(i.name)) || {
        participants: [],
      };

      acc.push(
        this.conversationsSlackService.inviteUsersToChannel(
          item.id,
          found.participants
            .filter((r) => typeof r.slackId === 'string')
            .map((p) => p.slackId as string),
        ),
      );

      return acc;
    }, [] as Promise<any>[]);

    const [successInviteUsers, errorsInviteUsers] =
      await this.resolveAllPromises(inviteUsersPromises);

    successInviteUsers.forEach((i) =>
      messages.push({
        type: 'success',
        title: 'All members were invited',
        data: i,
      }),
    );

    errorsInviteUsers.forEach((i) =>
      messages.push({
        type: 'error',
        title: 'Invite members fails',
        data: i,
      }),
    );

    return messages;
  }

  private async resolveAllPromises(promises: Promise<any>[]): Promise<any[][]> {
    const results = await Promise.allSettled(promises);

    const success = results
      .filter((i) => i.status === 'fulfilled')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .map((i) => i.value);

    const errors = results
      .filter((i) => i.status === 'rejected')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .map((i) => (typeof i.reason === 'string' ? i.reason : i.reason.message));

    return [success, errors];
  }
}
