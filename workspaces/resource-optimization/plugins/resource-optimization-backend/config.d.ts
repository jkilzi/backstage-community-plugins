export interface Config {
  resourceOptimization: {
    /** @visibility backend */
    ssoBaseUrl: string;

    /** @visibility backend */
    clientId: string;

    /** @visibility secret */
    clientSecret: string;
  };
}
