const browserWindow = window || {};
const browserWindowEnv = browserWindow['__env'] || {};

export const dynamicEnv: {
  backendUrl: string;
  externalStream: string;
  radioStreamUrl: string;
  slack: {
    clientId: string;
    clientSecret: string;
  };
} = {
  ...browserWindowEnv,
};
