import { WebClient } from '@slack/web-api';

export interface WebApiSlackServiceInterface {
  getClient(): WebClient;
}
