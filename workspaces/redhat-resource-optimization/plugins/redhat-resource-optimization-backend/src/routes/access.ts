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
import type { RequestHandler } from 'express';
import type { RouterOptions } from '../models/RouterOptions';
import { authorize } from '../util/checkPermissions';
import { rosPluginPermissions } from '@backstage-community/plugin-redhat-resource-optimization-common/permissions';
import { getTokenFromApi } from '../util/tokenUtil';

export const getAccess: (options: RouterOptions) => RequestHandler =
  options => async (_, response) => {
    const { logger, permissions, httpAuth, optimizationApi } = options;

    // token
    const token = await getTokenFromApi(options);
    console.log('Token at Access:', token);

    // hit /optimization endpoint
    const optimizationResponse = await optimizationApi.getRecommendationList(
      {
        query: {
          limit: -1,
          orderHow: 'desc',
          orderBy: 'last_reported',
        },
      },
      { token },
    );

    if (optimizationResponse.ok) {
      const responseBody = await optimizationResponse.json();
      const allProjects = [
        ...new Set(
          responseBody.data?.map(recommendation => recommendation.project),
        ),
      ];
      const allClusters = [
        ...new Set(
          responseBody.data?.map(recommendation => recommendation.clusterAlias),
        ),
      ];
    } else {
      throw new Error(optimizationResponse.statusText);
    }

    const decision = await authorize(
      _,
      rosPluginPermissions,
      permissions,
      httpAuth,
    );

    logger.info(`Checking decision:`, decision);

    const body = {
      decision: decision.result,
    };

    response.json(body);
  };
