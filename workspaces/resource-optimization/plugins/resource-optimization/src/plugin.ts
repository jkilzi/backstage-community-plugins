import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { OptimizationsClient } from '@backstage-community/plugin-resource-optimization-common';
import { rootRouteRef } from './routes';
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

export const ResourceOptimizationDetailPage = resourceOptimizationPlugin.provide(
  createRoutableExtension({
    name: 'ResourceOptimizationDetailPage',
    component: () =>
      import('./components/RosDetailComponent').then(m => m.RosDetailComponent),
    mountPoint: rootRouteRef,
  }),
);
