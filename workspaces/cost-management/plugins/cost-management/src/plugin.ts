import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const costManagementPlugin = createPlugin({
  id: 'cost-management',
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
