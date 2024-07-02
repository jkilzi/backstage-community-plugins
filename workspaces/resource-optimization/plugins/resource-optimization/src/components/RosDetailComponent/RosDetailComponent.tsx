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
import { YAMLCodeDataType } from '../../utils/generateYAMLCode';
import { getRecommendedValue } from '../../utils/utils';

type durationType = 'shortTerm' | 'mediumTerm' | 'longTerm';
type recommendationType = 'cost' | 'performance';

export const RosDetailComponent = () => {
  const { id } = useParams();
  const api = useApi(optimizationsApiRef);
  const [durationSelectedValue, setDurationSelectedValue] =
    useState<durationType>('shortTerm');

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
    setDurationSelectedValue(event.target.value);
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

  // get current configuration
  const getCurrentYAMLCodeData = () => {
    // limits values
    const cpuLimitsValue = `${value?.recommendations?.current?.limits?.cpu?.amount}${value?.recommendations?.current?.limits?.cpu?.format}`;
    const memoryLimitsValue = `${value?.recommendations?.current?.limits?.memory?.amount}${value?.recommendations?.current?.limits?.memory?.format}`;

    // requests values
    const cpuRequestsValue = `${value?.recommendations?.current?.requests?.cpu?.amount}${value?.recommendations?.current?.requests?.cpu?.format}`;
    const memoryRequestsValue = `${value?.recommendations?.current?.requests?.memory?.amount}${value?.recommendations?.current?.requests?.memory?.format}`;

    const currentYAMLCodeData: YAMLCodeDataType = {
      limits: {
        cpu: cpuLimitsValue,
        memory: memoryLimitsValue,
      },
      requests: {
        cpu: cpuRequestsValue,
        memory: memoryRequestsValue,
      },
    };

    return currentYAMLCodeData;
  };

  // get recommended configuration

  const getRecommendedYAMLCodeData = (
    duration: durationType,
    type: recommendationType,
  ) => {
    const currentValues = value?.recommendations?.current;
    const recommendedValues =
      value?.recommendations?.recommendationTerms?.[duration]
        ?.recommendationEngines?.[type]?.config;

    if (currentValues && recommendedValues) {
      const cpuLimitsValue = getRecommendedValue(
        currentValues,
        recommendedValues,
        'limits',
        'cpu',
      );
      const memoryLimitsValue = getRecommendedValue(
        currentValues,
        recommendedValues,
        'limits',
        'memory',
      );

      const cpuRequestsValue = getRecommendedValue(
        currentValues,
        recommendedValues,
        'requests',
        'cpu',
      );
      const memoryRequestsValue = getRecommendedValue(
        currentValues,
        recommendedValues,
        'requests',
        'memory',
      );

      const recommendedYAMLCodeData: YAMLCodeDataType = {
        limits: {
          cpu: cpuLimitsValue,
          memory: memoryLimitsValue,
        },
        requests: {
          cpu: cpuRequestsValue,
          memory: memoryRequestsValue,
        },
      };

      return recommendedYAMLCodeData;
    }

    return {
      limits: {
        cpu: '',
        memory: '',
      },
      requests: {
        cpu: '',
        memory: '',
      },
    };
  };

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
                  value={durationSelectedValue}
                  onChange={handleChange}
                >
                  <MenuItem value="shortTerm">Last 24 hrs</MenuItem>
                  <MenuItem value="mediumTerm">Last 7 days</MenuItem>
                  <MenuItem value="longTerm">Last 15 days</MenuItem>
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
                  yamlCodeData={getCurrentYAMLCodeData()}
                />
              </Grid>
              <Grid item xs={6}>
                <CodeInfoCard
                  cardTitle="Recommended configuration"
                  showCopyCodeButton={true}
                  yamlCodeData={getRecommendedYAMLCodeData(
                    durationSelectedValue,
                    'cost',
                  )}
                />
              </Grid>
            </Grid>
          </TabbedLayout.Route>

          <TabbedLayout.Route
            path="/performance-tab"
            title="Performance optimizations"
          >
            <Grid container>
              <Grid item xs={6}>
                <CodeInfoCard
                  cardTitle="Current configuration"
                  showCopyCodeButton={false}
                  yamlCodeData={getCurrentYAMLCodeData()}
                />
              </Grid>
              <Grid item xs={6}>
                <CodeInfoCard
                  cardTitle="Recommended configuration"
                  showCopyCodeButton={true}
                  yamlCodeData={getRecommendedYAMLCodeData(
                    durationSelectedValue,
                    'performance',
                  )}
                />
              </Grid>
            </Grid>
          </TabbedLayout.Route>
        </TabbedLayout>
      </Content>
    </Page>
  );
};
