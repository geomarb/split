import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UsersProfileGetArguments } from '@slack/web-api';

import configService from '../../src/libs/test-utils/mocks/configService.mock';
import { UsersSlackService } from '../../src/modules/slack/services/users.slack.service';
import { webApiSlackService } from '../../src/modules/slack/slack.providers';

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a list of slack profiles', async () => {
    const usersIds = usersIdsAndEmails.map((i) => i.userId);

    const result = await service.getProfilesByIds(usersIds);

    expect(result).toMatchObject(usersIdsAndEmails);
  });
});
