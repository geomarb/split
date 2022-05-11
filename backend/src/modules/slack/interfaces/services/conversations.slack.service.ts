import { CreateChannelDto } from '../../dto/create.channel.slack.dto';

export interface ConversationsSlackServiceInterface {
  createChannel(createChannelDto: CreateChannelDto): Promise<void>;

  inviteUsersToChannel(channelId: string, usersIds: string[]): Promise<void>;

  fetchMembersFromChannel(channelId: string): Promise<string[]>;
}
