import { CreateChannelDto } from '../../dto/create.channel.slack.dto';

export interface ConversationsSlackServiceInterface {
  createChannel(
    createChannelDto: CreateChannelDto,
  ): Promise<{ name: string; id: string }>;

  inviteUsersToChannel(
    channelId: string,
    usersIds: string[],
  ): Promise<{ ok: boolean; channelId: string }>;

  fetchMembersFromChannelSlowly(channelId: string): Promise<string[]>;
}
