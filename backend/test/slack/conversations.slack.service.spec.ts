import { Logger as LoggerNestJs } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import {
  ConversationsCreateArguments,
  ConversationsInviteArguments,
  ConversationsMembersArguments,
} from '@slack/web-api';
import * as WebClientSlackApi from '@slack/web-api';
import { faker } from '@faker-js/faker';

import configService from '../../src/libs/test-utils/mocks/configService.mock';
import { ConversationsSlackService } from '../../src/modules/slack/services/conversations.slack.service';
import { CreateChannelDto } from '../../src/modules/slack/dto/create.channel.slack.dto';
import { webApiSlackService } from '../../src/modules/slack/slack.providers';
import { WebApiSlackServiceInterface } from '../../src/modules/slack/interfaces/services/webapi.slack.service';
import { WebApiSlackService } from '../../src/modules/slack/services/webapi.slack.service';

const slackUsersIds = ['U023BECGF', 'U061F7AUR', 'W012A3CDE'];

jest.mock('@slack/web-api', () => ({
  // eslint-disable-next-line object-shorthand
  WebClient: function WebClient() {
    return {
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
}));

/* jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  // eslint-disable-next-line @typescript-eslint/no-shadow
  Logger: function Logger() {
    return { error: () => {} };
  },
})); */

describe('ConversationsSlackService', () => {
  let service: ConversationsSlackService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        {
          provide: ConfigService,
          useValue: configService,
        },
        webApiSlackService,
        ConversationsSlackService,
      ],
    }).compile();

    service = module.get<ConversationsSlackService>(ConversationsSlackService);

    jest.spyOn(LoggerNestJs.prototype, 'error').mockImplementation(jest.fn);
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

  it('should throws the slack api error if it fails', async () => {
    const input: CreateChannelDto = {
      name: 'test',
    };

    const WebClientMock: any = function WebClient() {
      return {
        conversations: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          create(options?: ConversationsCreateArguments | undefined) {
            return Promise.reject(new Error('some error message'));
          },
        },
      };
    };

    jest
      .spyOn(WebClientSlackApi, 'WebClient')
      .mockImplementationOnce(WebClientMock);

    const serviceWithWebClientMock = new ConversationsSlackService(
      configService as unknown as ConfigService<Record<string, unknown>, false>,
      new WebApiSlackService(
        configService as unknown as ConfigService<
          Record<string, unknown>,
          false
        >,
      ) as unknown as WebApiSlackServiceInterface,
    );

    await expect(
      serviceWithWebClientMock.createChannel(input),
    ).rejects.toThrowError();
  });

  it('should call logger slack api throwns an error', async () => {
    const input: CreateChannelDto = {
      name: 'test',
    };

    const WebClientMock: any = function WebClient() {
      return {
        conversations: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          create(options?: ConversationsCreateArguments | undefined) {
            return Promise.reject(new Error('some error message'));
          },
        },
      };
    };

    jest
      .spyOn(WebClientSlackApi, 'WebClient')
      .mockImplementationOnce(WebClientMock);

    const serviceWithWebClientMock = new ConversationsSlackService(
      configService as unknown as ConfigService<Record<string, unknown>, false>,
      new WebApiSlackService(
        configService as unknown as ConfigService<
          Record<string, unknown>,
          false
        >,
      ) as unknown as WebApiSlackServiceInterface,
    );

    const LoggerErrorMock = jest.fn();
    const spy = jest
      .spyOn(LoggerNestJs.prototype, 'error')
      .mockImplementation(LoggerErrorMock);

    try {
      await serviceWithWebClientMock.createChannel(input);
    } catch (err) {
      expect(LoggerErrorMock).toBeCalledTimes(1);
    }

    spy.mockRestore();
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
