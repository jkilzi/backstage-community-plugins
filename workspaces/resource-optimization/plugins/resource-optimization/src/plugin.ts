import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { Apis } from "@backstage-community/plugin-resource-optimization-common";

import { rootRouteRef } from './routes';
import { optimizationsApiRef } from './api/refs'

export const resourceOptimizationPlugin = createPlugin({
  id: 'resource-optimization',
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

export const ResourceOptimizationPage = resourceOptimizationPlugin.provide(
  createRoutableExtension({
    name: 'ResourceOptimizationPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
