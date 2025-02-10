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
import { authorize } from '../service/router';
import { rosPluginPermissions } from '@backstage-community/plugin-redhat-resource-optimization-common/permissions';

export const getAccess: (options: RouterOptions) => RequestHandler =
  options => async (_, response) => {
    const { logger, permissions, httpAuth } = options;

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
