import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/createRouter';

/**
 * resourceOptimizationPlugin backend plugin
 *
 * @public
 */
export const resourceOptimizationPlugin = createBackendPlugin({
  pluginId: 'resource-optimization',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        config: coreServices.rootConfig,
      },
      async init({ httpRouter, logger, config }) {
        httpRouter.use(
          await createRouter({
            logger,
            config,
          }),
        );
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
        httpRouter.addAuthPolicy({
          path: '/token',
          allow: 'user-cookie',
        });
      },
    });
  },
});
