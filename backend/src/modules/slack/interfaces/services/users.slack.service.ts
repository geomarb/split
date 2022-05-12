export interface UsersSlackServiceInterface {
  getEmailById(userId: string): Promise<string>;
}
