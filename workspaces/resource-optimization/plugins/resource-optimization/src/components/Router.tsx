import { ErrorPage } from '@backstage/core-components';
import React, { PropsWithChildren } from 'react';
import { Routes, Route } from 'react-router-dom';
import { optimizationsBreakdownRouteRef } from '../routes';
import { IndexPage } from './Pages/Index/IndexPage';
import { OptimizationsBreakdownPage } from './Pages/OptimizationsBreakdown/OptimizationsBreakdownPage';

export function Router(props: PropsWithChildren) {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
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
