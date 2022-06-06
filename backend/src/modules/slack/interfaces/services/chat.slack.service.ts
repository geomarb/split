export interface ChatSlackServiceInterface {
  postMessage(
    channelId: string,
    text: string,
  ): Promise<{ ok: boolean; channel: string }>;
}
