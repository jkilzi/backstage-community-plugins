import {
  DiscoveryApi,
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { OptimizationsApiClientNamespace } from '@backstage-community/plugin-cost-management-client';

import { rootRouteRef } from './routes';
import { optimizationsApiRef } from './api/ApiRefs';

export const costManagementPlugin = createPlugin({
  id: 'cost-management',
  apis: [
    createApiFactory({
      api: optimizationsApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory({ discoveryApi, fetchApi }) {
        const patchThroughProxy = (discoveryApiParam: typeof discoveryApi) => {
          return new Proxy(discoveryApiParam, {
            // eslint-disable-next-line consistent-return
            get(target, prop: keyof DiscoveryApi) {
              if (prop === 'getBaseUrl') {
                return async (pluginId: string) => {
                  const originalBaseUrl = await Reflect.apply(target[prop], target, [pluginId]);
                  if ((originalBaseUrl.endsWith('/api/cost-management'))) {
                    return originalBaseUrl.replace(/\/api\/cost-management$/, '/api/proxy/cost-management/v1');
                  } 
                    
                  return originalBaseUrl;
                }
              }
            },
          });
        };

        return new OptimizationsApiClientNamespace.OptimizationsApiClient({
          discoveryApi: patchThroughProxy(discoveryApi),
          fetchApi,
        });
      },
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const CostManagementPage = costManagementPlugin.provide(
  createRoutableExtension({
    name: 'CostManagementPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
