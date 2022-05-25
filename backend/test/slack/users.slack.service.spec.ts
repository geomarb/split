import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UsersProfileGetArguments } from '@slack/web-api';
import * as WebClientSlackApi from '@slack/web-api';

import configService from '../../src/libs/test-utils/mocks/configService.mock';
import { UsersSlackService } from '../../src/modules/slack/services/users.slack.service';
import { webApiSlackService } from '../../src/modules/slack/slack.providers';
import { WebApiSlackServiceInterface } from '../../src/modules/slack/interfaces/services/webapi.slack.service';
import { WebApiSlackService } from '../../src/modules/slack/services/webapi.slack.service';

const usersIdsAndEmails = [
  {
    userId: 'U_id_1',
    email: 'email_id_1@test.com',
  },
  {
    userId: 'U_id_2',
    email: 'email_id_2@test.com',
  },
  {
    userId: 'U_id_3',
    email: 'email_id_3@test.com',
  },
];

jest.mock('@slack/web-api', () => ({
  // eslint-disable-next-line object-shorthand
  WebClient: function WebClient() {
    return {
      users: {
        profile: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          get(options?: UsersProfileGetArguments | undefined) {
            return Promise.resolve({
              ok: true,
              profile: {
                email: usersIdsAndEmails.find((i) => i.userId === options?.user)
                  ?.email,
              },
            });
          },
        },
      },
    };
  },
}));

const WebClientMockError: any = function WebClient() {
  return {
    users: {
      profile: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        get(options?: UsersProfileGetArguments | undefined) {
          return Promise.reject(new Error('some error message'));
        },
      },
    },
  };
};

const LoggerErrorMock = jest.fn();

describe('UsersSlackService', () => {
  let service: UsersSlackService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        {
          provide: ConfigService,
          useValue: configService,
        },
        webApiSlackService,
        UsersSlackService,
      ],
    }).compile();

    service = module.get<UsersSlackService>(UsersSlackService);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a list of slack profiles', async () => {
    const usersIds = usersIdsAndEmails.map((i) => i.userId);

    const result = await service.getProfilesByIds(usersIds);

    expect(result).toMatchObject(usersIdsAndEmails);
  });

  describe('- throw Errors', () => {
    let serviceWithWebClientMock: UsersSlackService;

    beforeEach(() => {
      jest
        .spyOn(WebClientSlackApi, 'WebClient')
        .mockImplementationOnce(WebClientMockError);

      serviceWithWebClientMock = new UsersSlackService(
        new WebApiSlackService(
          configService as unknown as ConfigService<
            Record<string, unknown>,
            false
          >,
        ) as unknown as WebApiSlackServiceInterface,
      );

      jest.spyOn(Logger.prototype, 'error').mockImplementation(LoggerErrorMock);
    });

    afterEach(() => {
      LoggerErrorMock.mockRestore();
    });

    it('should throws the slack api error if it fails', async () => {
      const usersIds = usersIdsAndEmails.map((i) => i.userId);

      await expect(
        serviceWithWebClientMock.getProfilesByIds(usersIds),
      ).rejects.toThrowError();
    });

    it('should call logger if slack api throwns an error', async () => {
      const usersIds = usersIdsAndEmails.map((i) => i.userId);

      try {
        await serviceWithWebClientMock.getProfilesByIds(usersIds);
      } catch (err) {
        expect(LoggerErrorMock).toBeCalledTimes(1);
      }
    });
  });
});
