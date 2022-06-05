import { RetroTeamMessageType, RetroUser } from '../interfaces/types';

export class RetroTeamSlackDto {
  name!: string;

  participants!: RetroUser[];

  messages?: {
    type: RetroTeamMessageType;
    title?: string;
    body?: string;
    data?: any;
  }[];
}
