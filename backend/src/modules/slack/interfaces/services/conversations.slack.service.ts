import { CreateChannelDto } from '../../dto/create.channel.slack.dto';

export interface ConversationsSlackServiceInterface {
  createChannel(createChannelDto: CreateChannelDto): Promise<string>;

  inviteUsersToChannel(channelId: string, usersIds: string[]): Promise<boolean>;

  fetchMembersFromChannelSlowly(channelId: string): Promise<string[]>;
}
