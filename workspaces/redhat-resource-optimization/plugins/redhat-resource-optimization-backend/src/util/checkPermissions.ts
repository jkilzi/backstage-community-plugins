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
import { Request as HttpRequest } from 'express-serve-static-core';
import {
  AuthorizePermissionRequest,
  AuthorizePermissionResponse,
  AuthorizeResult,
  BasicPermission,
} from '@backstage/plugin-permission-common';
import {
  PermissionsService,
  HttpAuthService,
} from '@backstage/backend-plugin-api';
import { rosClusterSpecificPermission } from '@backstage-community/plugin-redhat-resource-optimization-common/permissions';

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

  const allow = decisions.find(d => d.result === AuthorizeResult.ALLOW);
  return (
    allow || {
      result: AuthorizeResult.DENY,
    }
  );
};

export const filterAuthorizedClusterIds = async (
  request: HttpRequest,
  permissionsSvc: PermissionsService,
  httpAuth: HttpAuthService,
  allClusters: string[],
): Promise<string[]> => {
  const credentials = await httpAuth.credentials(request);

  const specificClusterRequests: AuthorizePermissionRequest[] = allClusters.map(
    clusterId => ({
      permission: rosClusterSpecificPermission(clusterId),
    }),
  );

  const decisions = await permissionsSvc.authorize(specificClusterRequests, {
    credentials,
  });

  return allClusters.filter(
    (_, idx) => decisions[idx].result === AuthorizeResult.ALLOW,
  );
};
