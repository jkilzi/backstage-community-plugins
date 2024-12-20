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
import type {
  HttpAuthService,
  LoggerService,
  PermissionsService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import express from 'express';
import Router from 'express-promise-router';
import { createPermissionIntegrationRouter } from '@backstage/plugin-permission-node';
import { registerHealthRoutes } from '../routes/health';
import { registerTokenRoutes } from '../routes/token';
import { rosListPermissions } from '@backstage-community/plugin-redhat-resource-optimization-common';
import { Request as HttpRequest } from 'express-serve-static-core';
import {
  AuthorizePermissionRequest,
  AuthorizePermissionResponse,
  AuthorizeResult,
  BasicPermission,
} from '@backstage/plugin-permission-common';

/** @public */
export interface RouterOptions {
  logger: LoggerService;
  config?: RootConfigService;
  httpAuth: HttpAuthService;
  permissions: PermissionsService;
}

export const authorize = async (
  request: HttpRequest,
  anyOfPermissions: BasicPermission[],
  permissionsSvc: PermissionsService,
  httpAuth: HttpAuthService,
): Promise<AuthorizePermissionResponse> => {
  const credentials = await httpAuth.credentials(request);

  const decisionResponses: AuthorizePermissionResponse[][] = await Promise.all(
    anyOfPermissions.map(permission =>
      permissionsSvc.authorize([{ permission }], {
        credentials,
      }),
    ),
  );

  const decisions: AuthorizePermissionResponse[] = decisionResponses.map(
    d => d[0],
  );

  console.log('Permissions Decision:', decisions);

  const allow = decisions.find(d => d.result === AuthorizeResult.ALLOW);
  return (
    allow || {
      result: AuthorizeResult.DENY,
    }
  );
};

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();
  const permissionsIntegrationRouter = createPermissionIntegrationRouter({
    permissions: rosListPermissions,
  });

  router.use(express.json());
  router.use(permissionsIntegrationRouter);

  registerHealthRoutes(router, options);
  registerTokenRoutes(router, options);

  return router;
}
