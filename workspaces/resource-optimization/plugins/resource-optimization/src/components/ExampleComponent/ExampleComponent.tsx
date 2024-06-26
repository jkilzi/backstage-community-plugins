import React, { useState } from 'react';
import { Grid, Chip } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  Table,
  Select,
  Progress,
  ResponseErrorPanel,
  ContentHeader,
} from '@backstage/core-components';
import { SearchBar } from '@backstage/plugin-search-react';
import useAsync from 'react-use/lib/useAsync';
import { useApi } from '@backstage/core-plugin-api';
import { optimizationsApiRef } from '../../api/refs';
import { Recommendations } from '@backstage-community/plugin-resource-optimization-common';
import { columns } from '../Tables/columns';

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
  <>
    <SearchBar placeholder="Filter by Cluster" debounceTime={700} />
    <Chip label="demo" size="medium" variant="default" onDelete={() => ({})} />
  </>
);

const ProjectFilter = () => (
  <SearchBar placeholder="Filter by Project" debounceTime={700} />
);

const WorkloadFilter = () => (
  <SearchBar placeholder="Filter by Workload" debounceTime={700} />
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
        <ContentHeader title="Filters" />
        <Grid container direction="row">
          <Grid item xs={3}>
            <ClusterFilter />
            <ProjectFilter />
            <WorkloadFilter />
            <TypeFilter />
          </Grid>

          <Grid item xs={9}>
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
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
