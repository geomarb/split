import LoggedUserDto from 'src/modules/users/dto/logged.user.dto';

export interface AuthAzureService {
  loginOrRegisterAzureToken(azureToken: string): Promise<LoggedUserDto | null>;
  checkUserExistsInActiveDirectory(email: string): Promise<boolean>;
}
