import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { costManagementPlugin, CostManagementPage } from '../src/plugin';

createDevApp()
  .registerPlugin(costManagementPlugin)
  .addPage({
    element: <CostManagementPage />,
    title: 'Root Page',
    path: '/cost-management',
  })
  .render();
