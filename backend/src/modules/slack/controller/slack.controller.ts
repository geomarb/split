import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ConversationsSlackServiceInterface } from '../interfaces/services/conversations.slack.service';
import { UsersSlackServiceInterface } from '../interfaces/services/users.slack.service';
import { TYPES } from '../interfaces/types';

@Controller('slack')
export default class SlackController {
  constructor(
    @Inject(TYPES.services.ConversationsSlackService)
    private conversationsSlackService: ConversationsSlackServiceInterface,
    @Inject(TYPES.services.UsersSlackService)
    private usersSlackService: UsersSlackServiceInterface,
  ) {}

  @Post('/create')
  async createChannel() {
    return this.conversationsSlackService.createChannel({
      name: 'teste1',
    });
  }

  @Get('/members')
  async fetchMembersChannel() {
    return this.conversationsSlackService.fetchMembersFromChannelSlowly(
      'C03E6SA065Q', // 'C03F4NNLKCJ',
    );
  }

  @Get('/members/email')
  async fetchMembersEmailsChannel() {
    const usersIds =
      await this.conversationsSlackService.fetchMembersFromChannelSlowly(
        'C03E6SA065Q', // 'C03F4NNLKCJ',
      );

    return this.usersSlackService.getEmailsByIds(usersIds);
  }

  @Get('/profiles')
  async fetchProfilesChannel() {
    const usersIds =
      await this.conversationsSlackService.fetchMembersFromChannelSlowly(
        'C03E6SA065Q', // 'C03F4NNLKCJ',
      );

    return this.usersSlackService.getProfilesByIds(usersIds);
  }
}
