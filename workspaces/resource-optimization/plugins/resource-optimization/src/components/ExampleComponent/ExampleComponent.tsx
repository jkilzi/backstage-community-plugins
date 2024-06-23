import React from 'react';
import { Typography, Grid } from '@material-ui/core';
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
import useAsync from 'react-use/lib/useAsync';
import { useApi } from '@backstage/core-plugin-api';
import { optimizationsApiRef } from '../../api/refs';
import { Recommendations } from '@backstage-community/plugin-resource-optimization-common';

export default {
  title: 'Plugins/Examples',
  component: Page,
};

// const VALUE_NOT_AVAILABLE = 'N/A';

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
    render: row => (
      <Typography variant="body2">{row.lastReported?.toString()}</Typography>
    ),
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
              options={{ paging: true, padding: 'dense' }}
              data={value!.data ?? []}
              columns={columns}
              title="Optimizable containers"
            />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
