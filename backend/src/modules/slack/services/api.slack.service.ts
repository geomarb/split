import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SLACK_MASTER_CHANNEL_ID } from '../../../libs/constants/slack';
import { RetroTeamSlackDto } from '../dto/retro-teams.slack.dto';
import { ChatSlackServiceInterface } from '../interfaces/services/chat.slack.service';
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
    @Inject(TYPES.services.ChatSlackService)
    private readonly chatSlackService: ChatSlackServiceInterface,
  ) {}

  public async createChannelsForRetroTeam(
    _retroTeams: RetroTeamSlackDto[],
  ): Promise<RetroTeamMessage[]> {
    const messages: RetroTeamMessage[] = [];

    const [retroTeams, messagesFromFill] = await this.fillRetroTeams(
      _retroTeams,
    );
    messages.push(...messagesFromFill);

    const responsiblesList = this.getResponsibles(retroTeams);
    const [
      messagesFromCreateChannelForResponsibles,
      autoNominatedResponsibles,
    ] = await this.createChannelForResponsibles(responsiblesList);
    messages.push(...messagesFromCreateChannelForResponsibles);

    // if there are responsibles auto nominated fix the retroTeams
    const retroTeamsFixed = this.fixRetroTeamWithAutoNominatedResponsibles(
      retroTeams,
      autoNominatedResponsibles,
    );

    const messagesFromCreateChannelForEachTeam =
      await this.createChannelForEachTeam(retroTeamsFixed);
    messages.push(...messagesFromCreateChannelForEachTeam);

    const messageFromNotifyMasterChannel = await this.notifyMasterChannel(
      retroTeamsFixed,
    );
    messages.push(...messageFromNotifyMasterChannel);

    return messages;
  }

  // returns a new RetroTeams collection, remove all users without a slack ID
  // add userId and add real_name from slack if none provided
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
          participants.push({
            ...participant,
            slackId: found.userId,
            ...(!participant.name ? { name: found.real_name } : null),
          });
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

  private fixRetroTeamWithAutoNominatedResponsibles(
    _retroTeams: RetroTeamSlackDto[],
    _autoNominatedResponsibles: RetroUser[],
  ): RetroTeamSlackDto[] {
    const retroTeams = [..._retroTeams];
    if (_autoNominatedResponsibles.length > 0) {
      _autoNominatedResponsibles.forEach((i) => {
        let participant: RetroUser | undefined;
        retroTeams.find((r) => {
          participant = r.participants.find((p) => p.email === i.email);
          if (participant) {
            participant.responsible = true;
          }
          return !!participant;
        });
      });
    }

    return retroTeams;
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
  ): Promise<[RetroTeamMessage[], RetroUser[]]> {
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

    const autoNominatedResponsibles = responsiblesList.filter(
      (i) => !i.responsible,
    );

    if (autoNominatedResponsibles.length > 0) {
      messages.push({
        type: 'warning',
        title:
          'Those teams that did not assign a responsible person were assigned one automatically',
        data: autoNominatedResponsibles,
      });
    }

    return [messages, autoNominatedResponsibles];
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

  private async notifyMasterChannel(
    _retroTeams: RetroTeamSlackDto[],
  ): Promise<RetroTeamMessage[]> {
    const textGeneralTeams = _retroTeams.reduce((text, team) => {
      text += `\n${team.name}:\n`;

      team.participants.forEach((i, idx) => {
        text += `${idx + 1}. ${i.name || i.email}`;
        if (i.responsible) {
          text += ` *- Responsible*`;
        }
        text += '\n';
      });

      return text;
    }, '');

    const today = new Date();
    const until = new Date(
      today.setMonth(today.getMonth() + 1),
    ).toLocaleDateString('en-US', {
      month: 'long',
    });

    const generalText = `<!channel> In order to proceed with the retro of this month, here are the random teams: \n\n
    ${textGeneralTeams} \n
    Each team has a *random* selected responsible, in order to create the board, organize the retro and everything else that is described in the doc(https://confluence.kigroup.de/display/OX/Retro) :eyes: :thumbsup:\n\n
    This must be done until \`${until} 1st\`\n\n
    All the channels needed have been created automatically for your team and another one for responsibles of the teams.\n\n
    (Note: currently, retrobot does not check if the chosen responsibles joined xgeeks less than 3 months ago, so, if that happens, you have to decide who will take that role in the team. In the future, retrobot will automatically validate this rule.)\n\n
    Talent wins games, but teamwork and intelligence wins championships. :fire: :muscle:`;

    const result = await this.chatSlackService.postMessage(
      this.configService.get(SLACK_MASTER_CHANNEL_ID) as string,
      generalText,
    );

    if (!result.ok) {
      return [
        {
          type: 'error',
          title: 'Fail to send Message to Master Channel',
          data: generalText,
        },
      ];
    }

    return [
      {
        type: 'info',
        title: 'Message send to Master Channel',
        data: generalText,
      },
    ];
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
