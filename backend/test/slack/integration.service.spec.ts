import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import {
  ConversationsCreateArguments,
  ConversationsInviteArguments,
  ConversationsMembersArguments,
} from '@slack/web-api';
// import * as WebClientSlackApi from '@slack/web-api';
import { faker } from '@faker-js/faker';

import configService from '../../src/libs/test-utils/mocks/configService.mock';
import {
  chatSlackService,
  conversationsSlackService,
  usersSlackService,
  webApiSlackService,
} from '../../src/modules/slack/slack.providers';
import { ApiSlackService } from '../../src/modules/slack/services/api.slack.service';

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

describe('Service', () => {
  let service: ApiSlackService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        {
          provide: ConfigService,
          useValue: configService,
        },
        webApiSlackService,
        usersSlackService,
        conversationsSlackService,
        chatSlackService,
        ApiSlackService,
      ],
    }).compile();

    service = module.get<ApiSlackService>(ApiSlackService);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
