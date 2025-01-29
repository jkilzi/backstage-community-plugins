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
import type { RouterOptions } from '../service/router';
import {
  authorize,
  filterAuthorizedClusterIds,
  filterAuthorizedClusterProjectIds,
  filterAuthorizedProjectIds,
} from '../service/router';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { UnauthorizedError } from '@backstage-community/plugin-rbac-common';
import { rosPluginPermissions } from '@backstage-community/plugin-redhat-resource-optimization-common';
import { GetAccessResponse } from '@backstage-community/plugin-redhat-resource-optimization-common';

export const getAccess: (options: RouterOptions) => RequestHandler =
  options => async (_, response) => {
    const { logger, config, permissions, httpAuth } = options;
    logger.info('PONG!');

    const decision = await authorize(
      _,
      rosPluginPermissions,
      permissions,
      httpAuth,
    );
    // if(decision.result === AuthorizeResult.DENY){
    //   const error = new UnauthorizedError();
    //   throw error;
    // }

    const authorizeClusterIds: string[] = await filterAuthorizedClusterIds(
      _,
      permissions,
      httpAuth,
      [
        'test_cost_negative_iqe_ros_ocp_FTiILSWFEE',
        'test_cost_negative_iqe_ros_ocp_RplTvXURfD',
        'test_cost_iqe_ros_ocp_YijQtYVLRU',
        'test_cost_negative_iqe_ros_ocp_pafrgkkorn',
        'test_cost_iqe_ros_ocp_date_2025_01_20',
        'OpenShift on GCP - Nise Populator',
        'OCP-OnPrem01',
        'OpenShift on Azure',
        'OpenShift on AWS',
      ],
    );

    let finalDecision = decision.result;

    if (authorizeClusterIds.length === 0) {
      finalDecision = AuthorizeResult.DENY;
    } else {
      finalDecision = AuthorizeResult.ALLOW;
    }

    const authorizeProjectIds: string[] = await filterAuthorizedProjectIds(
      _,
      permissions,
      httpAuth,
      ['project-ros-A1', 'kube-system', 'Dubai', 'banking'],
    );

    const authorizeResults: string[] = await filterAuthorizedClusterProjectIds(
      _,
      permissions,
      httpAuth,
      [
        'test_cost_negative_iqe_ros_ocp_FTiILSWFEE',
        'test_cost_iqe_ros_ocp_YijQtYVLRU',
        'test_cost_negative_iqe_ros_ocp_pafrgkkorn',
        'OpenShift on GCP - Nise Populator',
        'OCP-OnPrem01',
        'OpenShift on Azure',
        'OpenShift on AWS',
      ],
      ['project-ros-A1', 'kube-system', 'Dubai', 'banking'],
    );

    const body: GetAccessResponse = {
      decision: finalDecision,
      authorizeClusterIds: authorizeClusterIds,
      authorizeProjectIds: authorizeProjectIds,
    };

    response.json(body);
  };
