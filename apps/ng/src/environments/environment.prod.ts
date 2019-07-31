const browserWindow = window || {};
const browserWindowEnv = browserWindow['__env'] || {};

export const environment: {
  backendUrl: string;
  radioStreamUrl: string;
  production: boolean;
} = {
  ...browserWindowEnv,
  ...{
    production: true
  }
};
