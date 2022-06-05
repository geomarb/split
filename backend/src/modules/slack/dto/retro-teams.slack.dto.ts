import { RetroUser } from '../interfaces/types';

export class RetroTeamSlackDto {
  name!: string;

  participants!: RetroUser[];
}
