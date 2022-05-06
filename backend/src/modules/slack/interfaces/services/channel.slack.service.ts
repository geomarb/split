import { CreateChannelDto } from '../../dto/create.channel.slack.dto';

export interface ChannelSlackServiceInterface {
  createChannel(createChannelDto: CreateChannelDto): Promise<void>;
}
