import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { resourceOptimizationPlugin, ResourceOptimizationPage } from '../src/plugin';

createDevApp()
  .registerPlugin(resourceOptimizationPlugin)
  .addPage({
    element: <ResourceOptimizationPage />,
    title: 'Root Page',
    path: '/resource-optimization',
  })
  .render();
