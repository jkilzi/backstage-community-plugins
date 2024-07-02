import React, { useState } from 'react';
import {
  Page,
  Header,
  Content,
  TabbedLayout,
  Progress,
  ResponseErrorPanel,
  Breadcrumbs,
} from '@backstage/core-components';
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { CodeInfoCard } from '../CodeInfoCard/CodeInfoCard';
import { useApi } from '@backstage/core-plugin-api';
import { optimizationsApiRef } from '../../api/refs';
import useAsync from 'react-use/esm/useAsync';
import { getTimeFromNow } from '../../utils/dates';

export const RosDetailComponent = () => {
  const { id } = useParams();
  const api = useApi(optimizationsApiRef);
  const [selectedValue, setSelectedValue] = useState('option1');

  const { value, loading, error } = useAsync(async () => {
    const recommendationId = id || '';
    const apiQuery = {
      path: {
        recommendationId: recommendationId,
      },
      query: {},
    };

    const response = await api.getRecommendationById(apiQuery);
    const payload = await response.json();

    return payload;
  }, []);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const handleChange = (event: any) => {
    setSelectedValue(event.target.value);
  };

  const containerData = [
    {
      key: 'Last reported:',
      value: getTimeFromNow(value?.lastReported?.toString()),
    },
    { key: 'Cluster name:', value: value?.clusterAlias },
    { key: 'Project name:', value: value?.project },
    { key: 'Workload type:', value: value?.workloadType },
    { key: 'Workload name:', value: value?.workload },
  ];

  console.log('Checking id:', id);

  return (
    <Page themeId="tool">
      <Header
        title="Resource Optimization"
        type="Optimizations"
        typeLink="/resource-optimization"
      />

      <Content>
        <Typography variant="h4">{value?.container}</Typography>

        <Box sx={{ paddingTop: 2 }}>
          {containerData.map((item, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={1.5}>
                <Typography variant="body1">{item.key}</Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography variant="body1">{item.value}</Typography>
              </Grid>
            </Grid>
          ))}
        </Box>

        <Box sx={{ paddingTop: 8, marginBottom: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Typography variant="body1">
                View optimizations based on
              </Typography>
            </Grid>
            <Box sx={{ minWidth: 200 }}>
              <FormControl fullWidth variant="outlined">
                <Select
                  id="dropdown"
                  value={selectedValue}
                  onChange={handleChange}
                >
                  <MenuItem value="option1">Last 24 hrs</MenuItem>
                  <MenuItem value="option2">Last 7 days</MenuItem>
                  <MenuItem value="option3">Last 15 days</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Box>

        <TabbedLayout>
          <TabbedLayout.Route path="/" title="Cost optimizations">
            <Grid container>
              <Grid item xs={6}>
                <CodeInfoCard
                  cardTitle="Current configuration"
                  showCopyCodeButton={false}
                />
              </Grid>
              <Grid item xs={6}>
                <CodeInfoCard
                  cardTitle="Recommended configuration"
                  showCopyCodeButton={true}
                />
              </Grid>
            </Grid>
          </TabbedLayout.Route>

          <TabbedLayout.Route
            path="/some-other-path"
            title="Performance optimizations"
          >
            <Grid container>
              <Grid item xs={6}>
                <CodeInfoCard
                  cardTitle="Current configuration"
                  showCopyCodeButton={false}
                />
              </Grid>
              <Grid item xs={6}>
                <CodeInfoCard
                  cardTitle="Recommended configuration"
                  showCopyCodeButton={true}
                />
              </Grid>
            </Grid>
          </TabbedLayout.Route>
        </TabbedLayout>
      </Content>
    </Page>
  );
};
