import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { Apis } from '@backstage-community/plugin-cost-management-common';

import { rootRouteRef } from './routes';
import { optimizationsApiRef } from './api/refs';

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
        return new Apis.OptimizationsApiClient({
          discoveryApi: {
            async getBaseUrl() {
              const baseUrl = await discoveryApi.getBaseUrl('proxy');
              return `${baseUrl}/cost-management/v1`;
            },
          },
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
