import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { OptimizationsClient } from '@backstage-community/plugin-resource-optimization-common';
import { optimizationsBreakdownRouteRef, rootRouteRef } from './routes';
import { optimizationsApiRef } from './apis';

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
        return new OptimizationsClient({
          discoveryApi,
          fetchApi,
        });
      },
    }),
  ],
  routes: {
    root: rootRouteRef,
    breakdown: optimizationsBreakdownRouteRef,
  },
});

export const ResourceOptimizationPage = resourceOptimizationPlugin.provide(
  createRoutableExtension({
    name: 'ResourceOptimizationPage',
    component: () =>
      import('./components/Router').then(
        m => m.Router,
      ),
    mountPoint: rootRouteRef,
  }),
);

