import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from '../dto/create.channel.slack.dto';
import { ChannelSlackServiceInterface } from '../interfaces/services/channel.slack.service';

@Injectable()
export class ChannelSlackService implements ChannelSlackServiceInterface {
  // constructor() {}

  async createChannel(createChannelDto: CreateChannelDto) {
    console.log('ChannelSlackService@createChannel', createChannelDto);
  }
}
