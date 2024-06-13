import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { resourceOptimizationPlugin, ResourceOptimizationPage } from '../src/plugin';
import { ResourceOptimizationIcon } from '../src/components/ResourceOptimizationIcon';

createDevApp()
  .registerPlugin(resourceOptimizationPlugin)
  .addPage({
    element: <ResourceOptimizationPage />,
    title: 'Optimizations',
    icon: ResourceOptimizationIcon,
    path: '/resource-optimization',
  })
  .addPage({
    element: (
      <>
        <h1>UNDER CONSTRUCTION</h1>
        <h2>Here you'll find the Resource Optimization Details page</h2>
      </>
    ),
    title: 'Optimization Details',
    path: '/resource-optimization/:recommendationId',
  })
  .render();
