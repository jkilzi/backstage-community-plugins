import React, { useState, useEffect } from 'react';
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
    <SearchBar
        placeholder="Filter by Cluster"
        debounceTime={700}
    />
    
    <Chip
      label='demo'
      size='medium'
      variant='default'
      onDelete={() => ({})} />
  </>
  
);

const ProjectFilter = () => (
  <>
    <SearchBar
        placeholder="Filter by Project"
        debounceTime={700}
    />
  </>
);

const WorkloadFilter = () => (
  <>
    <SearchBar
        placeholder="Filter by Workload"
        debounceTime={700}
    />
  </>
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


export const ExampleComponent = () => {
  const api = useApi(optimizationsApiRef);

  const [data, setData] = useState<Recommendations[]>([]);

  const [page, setPage] = useState(0);  // first page starts at 0
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [offset, setOffset] = useState(0);
  

  const { value, loading, error } = useAsync(async () => {

    const response = await api.getRecommendationList({ 
      query: { 
        limit: rowsPerPage, 
        offset: 0,
        orderBy: 'last_reported',
        orderHow: 'desc'
      } 
    });
    const payload = await response.json();
    return payload;
  }, []);
  
  
  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const handleChangeRowsPerPage = (pageSize: number) => {
    setRowsPerPage(pageSize);
  };

  const handleChangePage = (page: number, pageSize: number) => {
    setPage(page);
  };

  const handleOnOrderChange = (orderBy: number, orderDirection: 'asc' | 'desc') => {
    if(orderBy >= 0) {
      console.log("Handle order change:", columns[orderBy].field, orderDirection);
    }
  }

  const handleOnSearchChange = (searchText: string) => {
    console.log(searchText);
  }

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
                padding: 'dense'}}
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
