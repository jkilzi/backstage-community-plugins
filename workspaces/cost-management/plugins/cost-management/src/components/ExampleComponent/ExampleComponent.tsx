import React from 'react';
import { Typography, Grid, Chip, Box } from '@material-ui/core';
import {
  InfoCard,
  Header,
  HeaderLabel,
  HeaderTabs,
  Page,
  Content,
  ContentHeader,
  Link, TrendLine,
  TableColumn, Table,
  SupportButton, StatusOK, GaugeCard,
  Select,Progress, ResponseErrorPanel
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { optimizationsApiRef } from '../../api/refs';

export default {
  title: 'Plugins/Examples',
  component: Page,
};

interface TableData {
  container: string;
  project: string;
  workload: string;
  workload_type: string;
  cluster: string;
  last_reported: string;
}

export const ExampleComponent = () => {

  const config = useApi(configApiRef);
  const api = useApi(optimizationsApiRef);

  const { value, loading, error } = useAsync(async () => {
    return (await api.getRecommendationList({ query: {} })).json();
  }, []);

  const generateTestData = (rows = 10) => {
    const data: Array<TableData> = [];

    value?.data?.map( item => {
        console.log("Workload Type:", item.workloadType, item.lastReported)
        data.push({
          container: item.container ? item.container : '',
          project: item.project ? item.project : '',
          workload: item.workload ? item.workload : '',
          workload_type: item.workloadType ? item.workloadType : '',
          cluster:  item.clusterAlias ? item.clusterAlias : item.clusterUuid ? item.clusterUuid : '',
          last_reported: '6 hours ago'
      });
    })

    return data;
  };

  const columns: TableColumn[] = [
    {
      title: 'Container names',
      highlight: true,
      render: (row: Partial<TableData>) => (
        <>
          <Link to="#message-source">{row.container}</Link>
        </>
      ),
    },
    {
      title: 'Project names',
      render: (row: Partial<TableData>) => (
        <>
        <Typography variant="body2">{row.project}</Typography>
        </>
      ),
    },
    {
      title: 'Workload names',
      render: (row: Partial<TableData>) => (
        <>
        <Typography variant="body2">{row.workload}</Typography>
        </>
      ),
    },
    {
      title: 'Workload types',
      render: (row: Partial<TableData>) => (
        <>
        <Typography variant="body2">{row.workload_type}</Typography>
        </>
      ),
    },
    {
      title: 'Cluster names',
      render: (row: Partial<TableData>) => (
        <>
          <Link to="#message-source">{row.cluster}</Link>
        </>
      ),
    },
    {
      title: 'Last reported',
      render: (row: Partial<TableData>) => (
        <>
        <Typography variant="body2">{row.last_reported}</Typography>
        </>
      ),
    }
  ];


  const ExampleHeader = () => (
    <Header title="Resource Optimization">
    </Header>
  );

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
      label="CLUSTER"
      items={SELECT_ITEMS}
      multiple
      onChange={() => {}}
    />
  );

  const ProjectFilter = () => (
    <Select
      placeholder="All results"
      label="PROJECT"
      items={SELECT_ITEMS}
      multiple
      onChange={() => {}}
    />
  );

  const WorkloadFilter = () => (
    <Select
      placeholder="All results"
      label="WORKLOAD"
      items={SELECT_ITEMS}
      multiple
      onChange={() => {}}
    />
  );

  const TypeFilter = () => (
    <Select
      placeholder="All results"
      label="TYPE"
      items={SELECT_ITEMS}
      multiple
      onChange={() => {}}
    />
  );

  return (
      loading ? 
      <Progress /> :
      <div style={{ border: '1px solid #ddd' }}>
        <Page themeId="tool">
        <Content >
            <ExampleHeader />
            <h2>Filters</h2>
            <br/>
            <Grid container direction="row">
              <Grid item xs={3}>
                
                  <ClusterFilter />
                  <ProjectFilter />
                  <WorkloadFilter />
                  <TypeFilter />
                
              </Grid>
              
              <Grid item xs={9}>
                <Table
                  options={{ paging: true, padding: 'dense' }}
                  data={generateTestData(10)}
                  columns={columns}
                  title="Optimizable containers"
                />
              </Grid>
            </Grid> 
            </Content>
        </Page>
      </div>
  );
};
