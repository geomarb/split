import { ConfigService } from '@nestjs/config';
import {
  ConversationsCreateArguments,
  ConversationsInviteArguments,
  ConversationsMembersArguments,
  UsersProfileGetArguments,
} from '@slack/web-api';
import { faker } from '@faker-js/faker';

import configService from '../../src/libs/test-utils/mocks/configService.mock';
import { WebApiSlackServiceInterface } from '../../src/modules/slack/interfaces/services/webapi.slack.service';
import { ConversationsSlackService } from '../../src/modules/slack/services/conversations.slack.service';
import { CreateChannelDto } from '../../src/modules/slack/dto/create.channel.slack.dto';

const slackUsersIds = ['U023BECGF', 'U061F7AUR', 'W012A3CDE'];

const webApiSlackService = {
  getClient() {
    return {
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
            members: slackUsersIds,
            response_metadata: {
              next_cursor: null, // 'e3VzZXJfaWQ6IFcxMjM0NTY3fQ==',
            },
          });
        },
      },
    };
  },
};

describe('ConversationsSlackService', () => {
  let service: ConversationsSlackService;

  beforeAll(async () => {
    /* const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: configService,
        },
        {
          provide: WebApiSlackService,
          useValue: webApiSlackService,
        },
        ConversationsSlackService,
      ],
    }).compile();

    service = module.get<ConversationsSlackService>(ConversationsSlackService); */
    service = new ConversationsSlackService(
      configService as unknown as ConfigService<Record<string, unknown>, false>,
      webApiSlackService as unknown as WebApiSlackServiceInterface,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a slack channel and return its id', async () => {
    const today = new Date();
    const input: CreateChannelDto = {
      name: 'test',
    };
    const { id, name } = await service.createChannel(input);

    expect(id.startsWith('C')).toBe(true);
    expect(
      name.includes(`${today.getMonth() + 1}-${today.getFullYear()}`),
    ).toBe(true);
  });

  it('should invite users to channel and returns ok if no erros', async () => {
    const channelId = 'C_any_id';
    const usersIds = ['U_1', 'U_2', 'U_3'];

    const result = await service.inviteUsersToChannel(channelId, usersIds);

    expect(result).toBe(true);
  });

  it('should fetch members from a channel by channel id', async () => {
    const channelId = 'C_any_id';

    const result = await service.fetchMembersFromChannelSlowly(channelId);

    expect(result).toMatchObject(slackUsersIds);
  });
});
