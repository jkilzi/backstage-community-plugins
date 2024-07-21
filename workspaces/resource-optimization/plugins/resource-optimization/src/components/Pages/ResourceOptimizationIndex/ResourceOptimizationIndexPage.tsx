import React from 'react';
import {
  Link,
  ResponseErrorPanel,
  Table,
  TableColumn,
} from '@backstage/core-components';
import type { Recommendations } from '@backstage-community/plugin-resource-optimization-common';
import {
  BasePage,
  TableToolbar,
} from '@backstage-community/plugin-resource-optimization-react';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { optimizationsApiRef } from '../../../apis';
import useAsync from 'react-use/lib/useAsync';
import { optimizationsBreakdownRouteRef } from '../../../routes';
import {
  Filter,
  Filters,
} from '@backstage-community/plugin-resource-optimization-react';
import { PageLayout } from './PageLayout';

const DEFAULT_DEBOUNCE_INTERVAL = 700;
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const columns: TableColumn<Recommendations>[] = [
  {
    title: 'Container',
    field: 'container',
    render(data) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const link = useRouteRef(optimizationsBreakdownRouteRef);
      return <Link to={link({ id: data.id! })}>{data.container}</Link>;
    },
  },
  {
    title: 'Project',
    field: 'project',
  },
  {
    title: 'Workload',
    field: 'workload',
  },
  {
    title: 'Type',
    field: 'workloadType',
  },
  {
    title: 'Cluster',
    field: 'clusterAlias',
  },
  {
    title: 'Last reported',
    field: 'lastReported',
  },
];

const filters: Filter[] = [
  {
    name: 'cluster',
    options: [{ label: 'foo1' }],
    type: 'multiple',
  },
  {
    name: 'project',
    options: [{ label: 'foo2' }],
    type: 'multiple',
  },
  {
    name: 'workload',
    options: [{ label: 'foo3' }],
    type: 'multiple',
  },
  {
    name: 'type',
    options: [{ label: 'foo4' }],
    type: 'multiple',
  },
];

export type ResourceOptimizationIndexPageProps = {};

export function ResourceOptimizationIndexPage(
  _props: ResourceOptimizationIndexPageProps,
) {
  const api = useApi(optimizationsApiRef);
  const { value, error, loading } = useAsync(async () => {
    const response = await api.getRecommendationList({
      query: { limit: DEFAULT_PAGE_SIZE_OPTIONS[0], orderBy: 'last_reported' },
    });
    return response.json();
  });

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <BasePage pageTitle="Resource Optimization">
      <PageLayout>
        <PageLayout.Filters>
          <Filters filters={filters} onChangeFilters={() => {}} />
        </PageLayout.Filters>
        <PageLayout.Table>
          <Table<Recommendations>
            components={{
              Toolbar: TableToolbar,
            }}
            title="Optimizable containers"
            options={{
              debounceInterval: DEFAULT_DEBOUNCE_INTERVAL,
              padding: 'dense',
              pageSize: value?.meta?.limit ?? DEFAULT_PAGE_SIZE_OPTIONS[0],
              pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
              paging: true,
              search: true,
              sorting: true,
              thirdSortClick: false,
            }}
            data={value?.data ?? []}
            columns={columns}
            isLoading={loading}
            totalCount={value?.meta?.count ?? 0}
            // page={page}
            // onPageChange={handleChangePage}
            // onRowsPerPageChange={handleChangeRowsPerPage}
            // onOrderChange={handleOnOrderChange}
            // onSearchChange={handleOnSearchChange}
          />
        </PageLayout.Table>
      </PageLayout>
    </BasePage>
  );
}
