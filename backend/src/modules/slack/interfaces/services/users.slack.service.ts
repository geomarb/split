import { Profile } from '../../services/webapi.slack.service';

export interface UsersSlackServiceInterface {
  getProfilesByIds(usersIds: string[]): Promise<Profile[]>;
}
