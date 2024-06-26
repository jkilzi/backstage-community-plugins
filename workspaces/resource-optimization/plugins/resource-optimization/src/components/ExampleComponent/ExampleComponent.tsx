import React, { useState } from 'react';
import { Grid, Chip, Typography } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  Table,
  Select,
  Progress,
  ResponseErrorPanel,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';
import { SearchBar } from '@backstage/plugin-search-react';
import useAsync from 'react-use/lib/useAsync';
import { useApi } from '@backstage/core-plugin-api';
import { optimizationsApiRef } from '../../api/refs';
import { Recommendations } from '@backstage-community/plugin-resource-optimization-common';
import { columns } from '../Tables/columns';
import {
  CatalogFilterLayout,
  EntityListProvider,
} from '@backstage/plugin-catalog-react';

export default {
  title: 'Plugins/Examples',
  component: Page,
};

const SELECT_ITEMS = [
  {
    label: 'Cluster 1',
    value: 'cluster_1',
  },
  {
    label: 'Cluster 2',
    value: 'cluster_2',
  },
  {
    label: 'Cluster 3',
    value: 'cluster_3',
  },
];

const ClusterFilter = () => (
  <Select
    placeholder="All results"
    label="Cluster"
    items={SELECT_ITEMS}
    multiple
    onChange={() => {}}
  />
);

const ProjectFilter = () => (
  <Select
    placeholder="All results"
    label="Project"
    items={SELECT_ITEMS}
    multiple
    onChange={() => {}}
  />
);

const WorkloadFilter = () => (
  <Select
    placeholder="All results"
    label="Workload"
    items={SELECT_ITEMS}
    multiple
    onChange={() => {}}
  />
);

const TypeFilter = () => (
  <Select
    placeholder="All results"
    label="WorkLoad Type"
    items={SELECT_ITEMS}
    multiple
    onChange={() => {}}
  />
);

type SortOrder = 'asc' | 'desc';

export const ExampleComponent = () => {
  const api = useApi(optimizationsApiRef);

  const [page, setPage] = useState(0); // first page starts at 0
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [orderBy, setOrderBy] = useState('last_reported');
  const [orderDirection, setOrderDirection] = useState<SortOrder>('desc');

  const { value, loading, error } = useAsync(async () => {
    const offsetValue = page * rowsPerPage;

    const apiQuery: Parameters<typeof api.getRecommendationList>[0]['query'] = {
      limit: rowsPerPage,
      offset: offsetValue,
      orderBy: orderBy,
      orderHow: orderDirection,
    };

    const response = await api.getRecommendationList({
      query: apiQuery,
    });
    const payload = await response.json();
    return payload;
  }, [rowsPerPage, page, orderBy, orderDirection]);

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const handleChangeRowsPerPage = (pageSize: number) => {
    setRowsPerPage(pageSize);
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setPage(page);
  };

  const handleOnOrderChange = (orderBy: number, orderDirection: SortOrder) => {
    if (orderBy >= 0) {
      setOrderBy(`${columns[orderBy].field}`);
      setOrderDirection(orderDirection);
    }
  };

  const handleOnSearchChange = (searchText: string) => {
    console.log(searchText);
  };

  const tableTitle = `Optimizable containers (${value?.meta?.count || 0})`;

  return (
    <Page themeId="tool">
      <Header title="Resource Optimization" />
      <Content>
        <ContentHeader title="">
          <SupportButton>All your optimizations</SupportButton>
        </ContentHeader>

        <EntityListProvider>
          <CatalogFilterLayout>
            <CatalogFilterLayout.Filters>
              <Typography variant="h6">Filters</Typography>
              <hr></hr>
              <ClusterFilter />
              <ProjectFilter />
              <WorkloadFilter />
              <TypeFilter />
            </CatalogFilterLayout.Filters>
            <CatalogFilterLayout.Content>
              <Table<Recommendations>
                title={tableTitle}
                options={{
                  debounceInterval: 700,
                  paging: true,
                  search: true,
                  padding: 'dense',
                  thirdSortClick: false,
                }}
                data={value?.data || []}
                isLoading={loading}
                columns={columns}
                totalCount={value?.meta?.count || 0}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                onOrderChange={handleOnOrderChange}
                onSearchChange={handleOnSearchChange}
              />
            </CatalogFilterLayout.Content>
          </CatalogFilterLayout>
        </EntityListProvider>
      </Content>
    </Page>
  );
};
