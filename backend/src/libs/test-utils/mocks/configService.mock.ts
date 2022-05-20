const configService = {
  get(key: string) {
    switch (key) {
      case 'JWT_ACCESS_TOKEN_EXPIRATION_TIME':
        return '3600';
      case 'SLACK_MASTER_CHANNEL_ID':
        return 'ANY_SLACK_CHANNEL_ID';
      default:
        return 'UNKNOWN';
    }
  },
};

export default configService;
