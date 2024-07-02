import { createRouteRef, createSubRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 'ros/optimizations',
});

export const optimizationsBreakdownRouteRef = createSubRouteRef({
  id: 'ros/optimizations/breakdown',
  parent: rootRouteRef,
  path: '/:id',
});
