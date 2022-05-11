export class CreateChannelDto {
  isPrivate?: boolean;

  name!: string;

  description?: string;

  orgWide?: boolean;

  teamId?: string;
}
