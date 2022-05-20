import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ConversationsCreateArguments,
  ConversationsInviteArguments,
  ConversationsMembersArguments,
  UsersProfileGetArguments,
} from '@slack/web-api';
import { faker } from '@faker-js/faker';

import configService from '../../src/libs/test-utils/mocks/configService.mock';
import { ApiSlackService } from '../../src/modules/slack/services/api.slack.service';
import { WebApiSlackService } from '../../src/modules/slack/services/webapi.slack.service';
import {
  conversationsSlackService,
  usersSlackService,
  webApiSlackService,
} from '../../src/modules/slack/slack.providers';

const webApiSlackServiceMock = {
  getClient: () => ({
    users: {
      profile: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        get(options?: UsersProfileGetArguments | undefined) {
          return Promise.resolve({
            ok: true,
            profile: {
              email: 'spengler@ghostbusters.example.com',
            },
          });
        },
      },
    },
    conversations: {
      create(options?: ConversationsCreateArguments | undefined) {
        return Promise.resolve({
          ok: true,
          channel: {
            id: `C${faker.random.alphaNumeric(8).toUpperCase()}`,
            name: options?.name,
          },
        });
      },
      invite(options?: ConversationsInviteArguments | undefined) {
        return Promise.resolve({
          ok: true,
          channel: {
            id: options?.channelId,
          },
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      members(options?: ConversationsMembersArguments | undefined) {
        return Promise.resolve({
          ok: true,
          members: ['U023BECGF', 'U061F7AUR', 'W012A3CDE'],
          response_metadata: {
            next_cursor: null, // 'e3VzZXJfaWQ6IFcxMjM0NTY3fQ==',
          },
        });
      },
    },
  }),
};

describe('ApiSlackService', () => {
  let service: ApiSlackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        {
          provide: ConfigService,
          useValue: configService,
        },
        webApiSlackService,
        {
          provide: WebApiSlackService,
          useValue: webApiSlackServiceMock,
        },
        usersSlackService,
        conversationsSlackService,
        ApiSlackService,
      ],
    }).compile();

    service = module.get<ApiSlackService>(ApiSlackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /*   it('should return a RetroTeamSlackDto filled with data from slack', async () => {
    const givenRetroTeamsSlackDto: RetroTeamSlackDto[] = [
      {
        name: 'test',
        participants: [
          {
            email: 'participant_1@test.com',
            responsible: false,
          },
        ],
      },
    ];

    const result = await service.createChannelsForRetroTeam();
  }); */
});
