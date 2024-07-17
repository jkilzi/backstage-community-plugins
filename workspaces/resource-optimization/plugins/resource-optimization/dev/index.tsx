import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import {
  resourceOptimizationPlugin,
  ResourceOptimizationPage,
} from '../src/plugin';
import { ResourceOptimizationIconOutlined } from '@backstage-community/plugin-resource-optimization-react';

createDevApp()
  .registerPlugin(resourceOptimizationPlugin)
  .addPage({
    element: <ResourceOptimizationPage />,
    title: 'Optimizations',
    icon: ResourceOptimizationIconOutlined,
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
    path: '/resource-optimization/:id',
  })
  .render();
