/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import configService from '../../src/libs/test-utils/mocks/configService.mock';
import { ApiSlackService } from '../../src/modules/slack/services/api.slack.service';

import { ConversationsSlackServiceInterface } from '../../src/modules/slack/interfaces/services/conversations.slack.service';
import { UsersSlackServiceInterface } from '../../src/modules/slack/interfaces/services/users.slack.service';
import { CreateChannelDto } from '../../src/modules/slack/dto/create.channel.slack.dto';
import { Profile } from '../../src/modules/slack/services/webapi.slack.service';
import { RetroTeamSlackDto } from '../../src/modules/slack/dto/retro-teams.slack.dto';
import { RetroUser } from '../../src/modules/slack/interfaces/types';

const usersIdsAndEmails1 = [
  {
    userId: 'U_id_1_1',
    email: 'email_id_1_1@test.com',
  },
  {
    userId: 'U_id_1_2',
    email: 'email_id_1_2@test.com',
  },
  {
    userId: 'U_id_1_3',
    email: 'email_id_1_3@test.com',
  },
];
const usersIdsAndEmails2 = [
  {
    userId: 'U_id_2_1',
    email: 'email_id_2_1@test.com',
  },
  {
    userId: 'U_id_2_2',
    email: 'email_id_2_2@test.com',
  },
  {
    userId: 'U_id_2_3',
    email: 'email_id_2_3@test.com',
  },
];
const usersIdsAndEmails3 = [
  {
    email: 'email_id_3_1@test.com',
  },
  {
    email: 'email_id_3_2@test.com',
  },
];

const MakeConversationsSlackServiceStub = () => {
  class ConversationsSlackServiceStub
    implements ConversationsSlackServiceInterface
  {
    createChannel(
      _createChannelDto: CreateChannelDto,
    ): Promise<{ name: string; id: string }> {
      return Promise.resolve({ id: 'any_id', name: 'any_name' });
    }

    inviteUsersToChannel(
      _channelId: string,
      _usersIds: string[],
    ): Promise<boolean> {
      return Promise.resolve(true);
    }

    fetchMembersFromChannelSlowly(_channelId: string): Promise<string[]> {
      return Promise.resolve(
        [...usersIdsAndEmails1, ...usersIdsAndEmails2]
          // .filter((i) => !!i.userId) // remove users that are not in the slack channel
          .map((i) => i.userId),
      );
    }
  }
  return new ConversationsSlackServiceStub();
};

const MakeUsersSlackServiceStub = () => {
  class UsersSlackServiceStub implements UsersSlackServiceInterface {
    getProfilesByIds(usersIds: string[]): Promise<Profile[]> {
      return Promise.resolve([...usersIdsAndEmails1, ...usersIdsAndEmails2]);
    }
  }

  return new UsersSlackServiceStub();
};

describe('ApiSlackService', () => {
  let service: ApiSlackService;

  beforeAll(async () => {
    service = new ApiSlackService(
      configService as unknown as ConfigService<Record<string, unknown>, false>,
      MakeConversationsSlackServiceStub(),
      MakeUsersSlackServiceStub(),
    );

    jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fill RetroTeamSlackDto with data from slack', async () => {
    const givenRetroTeamsSlackDto: RetroTeamSlackDto[] = [
      {
        name: 'test_team_1',
        participants: usersIdsAndEmails1.map((i) => ({
          email: i.email,
          responsible: false,
        })),
      },
      {
        name: 'test_team_2',
        participants: usersIdsAndEmails2.map((i) => ({
          email: i.email,
          responsible: false,
        })),
      },
    ];

    let result;

    const spy = jest
      .spyOn(service, 'createChannelsForRetroTeam')
      .mockImplementationOnce(async (_retroTeams: RetroTeamSlackDto[]) => {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        result = await service['fillRetroTeams'](_retroTeams);

        return [];
      });

    await service.createChannelsForRetroTeam(givenRetroTeamsSlackDto);

    const [resultRetroTeams] = result;
    expect(resultRetroTeams).toMatchObject([
      {
        name: 'test_team_1',
        participants: [
          {
            email: 'email_id_1_1@test.com',
            responsible: false,
            slackId: 'U_id_1_1',
          },
          {
            email: 'email_id_1_2@test.com',
            responsible: false,
            slackId: 'U_id_1_2',
          },
          {
            email: 'email_id_1_3@test.com',
            responsible: false,
            slackId: 'U_id_1_3',
          },
        ],
      },
      {
        name: 'test_team_2',
        participants: [
          {
            email: 'email_id_2_1@test.com',
            responsible: false,
            slackId: 'U_id_2_1',
          },
          {
            email: 'email_id_2_2@test.com',
            responsible: false,
            slackId: 'U_id_2_2',
          },
          {
            email: 'email_id_2_3@test.com',
            responsible: false,
            slackId: 'U_id_2_3',
          },
        ],
      },
    ]);

    spy.mockRestore();
  });

  it('should return feedback message for users without a slack id', async () => {
    const givenRetroTeamsSlackDto: RetroTeamSlackDto[] = [
      {
        name: 'test_team_1',
        participants: [...usersIdsAndEmails1, ...usersIdsAndEmails3].map(
          (i) => ({
            email: i.email,
            responsible: false,
          }),
        ),
      },
      {
        name: 'test_team_2',
        participants: usersIdsAndEmails2.map((i) => ({
          email: i.email,
          responsible: false,
        })),
      },
    ];

    let result;

    const spy = jest
      .spyOn(service, 'createChannelsForRetroTeam')
      .mockImplementationOnce(async (_retroTeams: RetroTeamSlackDto[]) => {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        result = await service['fillRetroTeams'](_retroTeams);

        return [];
      });

    await service.createChannelsForRetroTeam(givenRetroTeamsSlackDto);

    const [, resultMessages] = result;

    expect(resultMessages).toMatchObject([
      {
        type: 'warning',
        title: 'Users not assigned to master slack channel',
        data: ['email_id_3_1@test.com', 'email_id_3_2@test.com'],
      },
    ]);

    spy.mockRestore();
  });

  it('should return feedback message for users without a team', async () => {
    const userOnSlackWithoutATeam = usersIdsAndEmails2[0];

    const givenRetroTeamsSlackDto: RetroTeamSlackDto[] = [
      {
        name: 'test_team_1',
        participants: [...usersIdsAndEmails1].map((i) => ({
          email: i.email,
          responsible: false,
        })),
      },
      {
        name: 'test_team_2',
        participants: usersIdsAndEmails2
          .filter((i) => i.userId !== userOnSlackWithoutATeam.userId)
          .map((i) => ({
            email: i.email,
            responsible: false,
          })),
      },
    ];

    let result;

    const spy = jest
      .spyOn(service, 'createChannelsForRetroTeam')
      .mockImplementationOnce(async (_retroTeams: RetroTeamSlackDto[]) => {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        result = await service['fillRetroTeams'](_retroTeams);

        return [];
      });

    await service.createChannelsForRetroTeam(givenRetroTeamsSlackDto);

    const [, resultMessages] = result;

    expect(resultMessages).toMatchObject([
      {
        type: 'warning',
        title: 'Users assigned to master slack channel without a RetroTeam',
        data: ['email_id_2_1@test.com'],
      },
    ]);

    spy.mockRestore();
  });

  it('should create channel for responsibles successfuly and return feedback messages', async () => {
    const responsiblesList: RetroUser[] = [
      {
        email: usersIdsAndEmails1[0].email,
        slackId: usersIdsAndEmails1[0].userId,
        responsible: true,
      },
      {
        email: usersIdsAndEmails2[0].email,
        slackId: usersIdsAndEmails2[0].userId,
        responsible: true,
      },
      {
        email: usersIdsAndEmails2[1].email,
        slackId: usersIdsAndEmails2[1].userId,
        responsible: false,
      },
    ];

    // eslint-disable-next-line @typescript-eslint/dot-notation
    const fn = service['createChannelForResponsibles'];

    const result = await fn.call(service, responsiblesList);

    expect(result).toMatchObject([
      {
        type: 'success',
        title: 'Channel created and all responsibles were invited',
        data: true,
      },
      {
        type: 'warning',
        title:
          'Those teams that did not assign a responsible person were assigned one automatically',
        data: [
          {
            email: 'email_id_2_2@test.com',
            slackId: 'U_id_2_2',
            responsible: false,
          },
        ],
      },
    ]);
  });
});
