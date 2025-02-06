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
import type { RecommendationBoxPlots } from '@backstage-community/plugin-redhat-resource-optimization-common/models';
import { getTimeFromNow } from '../../utils/dates';
import { BasePage } from '../../components/BasePage';
import { type Interval, OptimizationType } from './models/ChartEnums';
import { OptimizationEngineTab } from './components/optimization-engine-tab/OptimizationEngineTab';
import {
  getCurrentYAMLCodeData,
  getRecommendedYAMLCodeData,
} from './models/YamlCodeData';
import type { WorkflowDataSchema } from './models/WorkflowDataSchema';
import { optimizationsApiRef, orchestratorSlimApiRef } from '../../apis';

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
  const [_, applyRecommendation] = useAsyncFn(
    async (workflowId: string, workflowData: WorkflowDataSchema) => {
      const payload = await orchestratorSlimApi.executeWorkflow(workflowId, {
        inputData: {
          ...workflowData,
        },
      });
      return payload;
    },
    [recommendedConfiguration],
  );

  const navigate = useNavigate();
  const handleApplyRecommendation = useCallback(() => {
    const workflowId = workflowIdRef.current;

    applyRecommendation(workflowId, {
      clusterName: value!.clusterAlias!,
      clusterUuid: value!.clusterUuid!,
      project: value!.project!,
      workload: value!.workload!,
      container: value!.container!,
      ...recommendedConfiguration,
    }).then(response => {
      navigate(`/orchestrator/instances/${response.id}`);
    });
  }, [applyRecommendation, navigate, recommendedConfiguration, value]);

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
      pageTitle={value!.container!}
      pageType="Optimizations"
      pageTypeLink="/redhat-resource-optimization"
    >
      <TabbedLayout>
        <TabbedLayout.Route path="/cost?" title="Cost optimizations">
          <OptimizationEngineTab
            optimizationType={OptimizationType.cost}
            chartData={value!}
            containerData={containerData}
            recommendationTerm={recommendationTerm}
            currentConfiguration={currentConfiguration}
            recommendedConfiguration={recommendedConfiguration}
            onRecommendationTermChange={handleRecommendationTermChange}
            onApplyRecommendation={handleApplyRecommendation}
            workflowId={workflowIdRef.current}
          />
        </TabbedLayout.Route>

        <TabbedLayout.Route
          path="/performance"
          title="Performance optimizations"
        >
          <OptimizationEngineTab
            optimizationType={OptimizationType.performance}
            chartData={value!}
            containerData={containerData}
            recommendationTerm={recommendationTerm}
            currentConfiguration={currentConfiguration}
            recommendedConfiguration={recommendedConfiguration}
            onRecommendationTermChange={handleRecommendationTermChange}
            onApplyRecommendation={handleApplyRecommendation}
            workflowId={workflowIdRef.current}
          />
        </TabbedLayout.Route>
      </TabbedLayout>
    </BasePage>
  );
};
OptimizationsBreakdownPage.displayName = 'OptimizationsBreakdownPage';
