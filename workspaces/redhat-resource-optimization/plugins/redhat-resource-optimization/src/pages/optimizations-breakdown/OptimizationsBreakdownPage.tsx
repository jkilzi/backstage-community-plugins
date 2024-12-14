/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useAsync from 'react-use/esm/useAsync';
import useAsyncFn from 'react-use/esm/useAsyncFn';
import {
  TabbedLayout,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import Grid from '@material-ui/core/Grid';
import {
  optimizationsApiRef,
  orchestratorSlimApiRef,
  type RecommendationBoxPlots,
} from '@backstage-community/plugin-redhat-resource-optimization-common';
import { CodeInfoCard } from './components/CodeInfoCard';
import { getTimeFromNow } from '../../utils/dates';
import {
  Interval,
  OptimizationType,
  RecommendationType,
} from './components/charts/types/ChartEnums';
import { BasePage } from '../../components/BasePage';
import { ContainerInfoCard } from './components/ContainerInfoCard';
import { ChartInfoCard } from './components/ChartInfoCard';
import {
  getCurrentYAMLCodeData,
  getRecommendedYAMLCodeData,
} from './models/YamlCodeData';
import type { YamlCodeData } from './models/YamlCodeData';

type SanitizedRecommendedConfiguration = {
  requests?: Partial<YamlCodeData['requests']>;
  limits?: Partial<YamlCodeData['limits']>;
};

const SANITATION_REGEX = /(^[-]$|\s+#.+$)/;

const sanitizeRecommendedConfiguration = (
  config: YamlCodeData,
): SanitizedRecommendedConfiguration => {
  const cpuLimits = config.limits.cpu.toString().replace(SANITATION_REGEX, '');
  const memoryLimits = config.limits.memory
    .toString()
    .replace(SANITATION_REGEX, '');
  const cpuRequests = config.requests.cpu
    .toString()
    .replace(SANITATION_REGEX, '');
  const memoryRequests = config.requests.memory
    .toString()
    .replace(SANITATION_REGEX, '');

  const sanitizedData: SanitizedRecommendedConfiguration = {};
  if (cpuLimits.length > 0 || memoryLimits.length > 0) {
    sanitizedData.limits = {};
    if (cpuLimits.length > 0) {
      sanitizedData.limits.cpu = cpuLimits;
    }
    if (memoryLimits.length > 0) {
      sanitizedData.limits.memory = memoryLimits;
    }
  }

  if (cpuRequests.length > 0 || memoryRequests.length > 0) {
    sanitizedData.requests = {};
    if (cpuRequests.length > 0) {
      sanitizedData.requests.cpu = cpuRequests;
    }
    if (memoryRequests.length > 0) {
      sanitizedData.requests.memory = memoryRequests;
    }
  }

  return sanitizedData;
};

const getContainerData = (value: RecommendationBoxPlots) => [
  { key: 'Cluster', value: value?.clusterAlias },
  { key: 'Project', value: value?.project },
  { key: 'Workload', value: value?.workload },
  { key: 'Type', value: value?.workloadType },
  {
    key: 'Last reported',
    value: getTimeFromNow(value?.lastReported?.toString()),
  },
];

export const OptimizationsBreakdownPage = () => {
  const [recommendationTerm, setRecommendationTerm] =
    useState<Interval>('shortTerm');
  const loc = useLocation();

  const configApi = useApi(configApiRef);
  const workflowIdRef = useRef<string>(
    configApi.getOptionalString(
      'resourceOptimization.optimizationWorkflowId',
    ) ?? '',
  );

  const { id } = useParams();
  const optimizationsApi = useApi(optimizationsApiRef);
  const { value, loading, error } = useAsync(async () => {
    const apiQuery = {
      path: {
        recommendationId: id!,
      },
      query: {},
    };

    const response = await optimizationsApi.getRecommendationById(apiQuery);
    const payload = await response.json();

    return payload;
  }, []);

  const recommendedConfiguration = useMemo(
    () =>
      getRecommendedYAMLCodeData(
        value!,
        recommendationTerm,
        loc.pathname.endsWith('performance')
          ? OptimizationType.performance
          : OptimizationType.cost,
      ),
    [recommendationTerm, loc.pathname, value],
  );

  const currentConfiguration = useMemo(
    () => getCurrentYAMLCodeData(value!),
    [value],
  );

  const orchestratorSlimApi = useApi(orchestratorSlimApiRef);
  const [_, applyRecommendation] = useAsyncFn(async () => {
    const workflowId = workflowIdRef.current;
    const workflowData = sanitizeRecommendedConfiguration(
      recommendedConfiguration,
    );

    const payload = await orchestratorSlimApi.executeWorkflow(workflowId, {
      inputData: {
        name: 'Optimizations Plugin', // TODO(jkilzi): DELETEME...
        language: 'Spanish', // TODO(jkilzi): DELETEME...
        optimization: workflowData,
      },
    });
    return payload;
  }, [recommendedConfiguration]);

  const navigate = useNavigate();
  const handleApplyRecommendation = useCallback(() => {
    applyRecommendation().then(response => {
      navigate(`/orchestrator/instances/${response.id}`);
    });
  }, [applyRecommendation, navigate]);

  const handleRecommendationTermChange = useCallback((event: any) => {
    setRecommendationTerm(event.target.value);
  }, []);

  const containerData = useMemo(() => getContainerData(value!), [value]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <BasePage
      pageThemeId="tool"
      pageTitle={value?.container ?? '🤔'}
      pageType="Optimizations"
      pageTypeLink="/redhat-resource-optimization"
    >
      <TabbedLayout>
        <TabbedLayout.Route path="/cost?" title="Cost optimizations">
          <Grid container>
            <Grid item xs={12}>
              <ContainerInfoCard
                containerData={containerData}
                recommendationTerm={recommendationTerm}
                onRecommendationTermChange={handleRecommendationTermChange}
                workflowId={workflowIdRef.current}
                onApplyRecommendation={handleApplyRecommendation}
              />
            </Grid>

            <Grid item xs={6}>
              <CodeInfoCard
                cardTitle="Current configuration"
                showCopyCodeButton={false}
                yamlCodeData={currentConfiguration}
              />
            </Grid>
            <Grid item xs={6}>
              <CodeInfoCard
                cardTitle="Recommended configuration"
                showCopyCodeButton
                yamlCodeData={recommendedConfiguration}
              />
            </Grid>

            <Grid item xs={6}>
              <ChartInfoCard
                title="CPU utilization"
                chartData={value!}
                recommendationTerm={recommendationTerm}
                optimizationType={OptimizationType.cost}
                resourceType={RecommendationType.cpu}
              />
            </Grid>
            <Grid item xs={6}>
              <ChartInfoCard
                title="Memory utilization"
                chartData={value!}
                recommendationTerm={recommendationTerm}
                optimizationType={OptimizationType.cost}
                resourceType={RecommendationType.memory}
              />
            </Grid>
          </Grid>
        </TabbedLayout.Route>

        <TabbedLayout.Route
          path="/performance"
          title="Performance optimizations"
        >
          <Grid container>
            <Grid item xs={12}>
              <ContainerInfoCard
                containerData={containerData}
                recommendationTerm={recommendationTerm}
                onRecommendationTermChange={handleRecommendationTermChange}
                workflowId={workflowIdRef.current}
                onApplyRecommendation={handleApplyRecommendation}
              />
            </Grid>

            <Grid item xs={6}>
              <CodeInfoCard
                cardTitle="Current configuration"
                showCopyCodeButton={false}
                yamlCodeData={currentConfiguration}
              />
            </Grid>
            <Grid item xs={6}>
              <CodeInfoCard
                cardTitle="Recommended configuration"
                showCopyCodeButton
                yamlCodeData={recommendedConfiguration}
              />
            </Grid>
            <Grid item xs={6}>
              <ChartInfoCard
                title="CPU utilization"
                chartData={value!}
                recommendationTerm={recommendationTerm}
                optimizationType={OptimizationType.performance}
                resourceType={RecommendationType.cpu}
              />
            </Grid>
            <Grid item xs={6}>
              <ChartInfoCard
                title="Memory utilization"
                chartData={value!}
                recommendationTerm={recommendationTerm}
                optimizationType={OptimizationType.performance}
                resourceType={RecommendationType.memory}
              />
            </Grid>
          </Grid>
        </TabbedLayout.Route>
      </TabbedLayout>
    </BasePage>
  );
};
OptimizationsBreakdownPage.displayName = 'OptimizationsBreakdownPage';
