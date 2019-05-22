const browserWindow = window || {};
const browserWindowEnv = browserWindow['__env'] || {};

export const environment = {
    ...browserWindowEnv,
    ...{
        production: true
    }
};
