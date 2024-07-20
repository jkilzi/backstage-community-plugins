import { ErrorPage } from '@backstage/core-components';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { optimizationsBreakdownRouteRef } from '../routes';
// import { ResourceOptimizationIndexPage } from './Pages/ResourceOptimizationIndex';
import { ExampleComponent as ResourceOptimizationIndexPage } from './ExampleComponent'; // TODO(jkilzi): replace with above line after PoC
// import { OptimizationsBreakdownPage } from './Pages/OptimizationsBreakdown';
import { RosDetailComponent as OptimizationsBreakdownPage } from './RosDetailComponent'; // TODO(jkilzi): replace with above line after PoC

/** @public */
export function Router() {
  return (
    <Routes>
      <Route path="/" element={<ResourceOptimizationIndexPage />} />
      <Route
        path={optimizationsBreakdownRouteRef.path}
        element={<OptimizationsBreakdownPage />}
      />
      <Route
        path="*"
        element={<ErrorPage status="404" statusMessage="Page not found" />}
      />
    </Routes>
  );
}
