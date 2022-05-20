import { Profile } from '../../services/webapi.slack.service';

export interface UsersSlackServiceInterface {
  getProfileById(userId: string): Promise<Profile>;

  getProfilesByIds(usersIds: string[]): Promise<Profile[]>;
}
