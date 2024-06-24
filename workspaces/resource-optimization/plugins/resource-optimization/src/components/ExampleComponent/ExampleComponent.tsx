import React, { useState, useEffect } from 'react';
import { Typography, Grid, Chip } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  Link,
  TableColumn,
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
import { getTimeFromNow } from '../../utils/dates';

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

const columns: TableColumn<Recommendations>[] = [
  {
    title: 'Containers',
    highlight: true,
    render: row => <Link to="#message-source">{row.container}</Link>,
  },
  {
    title: 'Projects',
    render: row => <Typography variant="body2">{row.project}</Typography>,
  },
  {
    title: 'Workloads',
    render: row => <Typography variant="body2">{row.workload}</Typography>,
  },
  {
    title: 'Workload types',
    render: row => <Typography variant="body2">{row.workloadType}</Typography>,
  },
  {
    title: 'Clusters',
    render: row => <Typography variant="body2">{row.clusterAlias}</Typography>,
  },
  {
    title: 'Last reported',
    field: 'last_reported',
    defaultSort: 'desc',
    filtering: false,
    render: row => (
      <>
        <Typography variant="body2">{getTimeFromNow(row.lastReported?.toString())}</Typography>
      </>
    ),
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

  const { value, loading, error } = useAsync(async () => {
    const response = await api.getRecommendationList({ query: {} });
    const payload = await response.json();
    return payload;
  }, []);


  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
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
                filtering: false, 
                paging: true, 
                search: true,
                padding: 'dense'}}
              data={query =>
                new Promise((resolve, reject) => {
                    console.log("Checking Query:", query);
                    // prepare your data and then call resolve like this:
                    const offset = query.page * query.pageSize;
                    
                    const apiQuery: Parameters<typeof api.getRecommendationList>[0]['query'] = {
                      limit: query.pageSize, 
                      offset: offset, 
                    }
                    
                    if(query.search){
                      const constainerValue = query.search;
                      apiQuery.container = constainerValue;
                    }

                    if(query.orderBy){
                      apiQuery.orderBy = query.orderBy.field;
                      apiQuery.orderHow = query.orderDirection
                    }

                    if(query.filters.length){
                      console.log("Filters:", query.filters);
                    }

                    api.getRecommendationList({ query: apiQuery }).then(
                      response => response.json()).then(response =>{
                        const pageNumber = Math.floor(offset / query.pageSize);
          
                        resolve({
                          data: response.data || [],// your data array
                          page: pageNumber,// current page number
                          totalCount: response.meta?.count || 0// total row number
                      });  
                  });
                })
              }
              columns={columns}
            />
          
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
