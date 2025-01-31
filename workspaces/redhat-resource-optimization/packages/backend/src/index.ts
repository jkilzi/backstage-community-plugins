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

import { createBackend } from '@backstage/backend-defaults';
import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import {
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { githubAuthenticator } from '@backstage/plugin-auth-backend-module-github-provider';

const customGithubAuthModule = createBackendModule({
  // This ID must be exactly "auth" because that's the plugin it targets
  pluginId: 'auth',
  // This ID must be unique, but can be anything
  moduleId: 'custom-auth-provider',
  register(reg) {
    reg.registerInit({
      deps: { providers: authProvidersExtensionPoint },
      async init({ providers }) {
        providers.registerProvider({
          // This ID must match the actual provider config, e.g. addressing
          // auth.providers.azure means that this must be "azure".
          providerId: 'github',
          // Use createProxyAuthProviderFactory instead if it's one of the proxy
          // based providers rather than an OAuth based one
          factory: createOAuthProviderFactory({
            // For more info about authenticators please see https://backstage.io/docs/auth/add-auth-provider/#adding-an-oauth-based-provider
            authenticator: githubAuthenticator,
            async signInResolver(info, ctx) {
              console.log('Preeti Logging...');
              console.log('Sign in done:', info);
              const {
                profile: { email },
              } = info;

              // Profiles are not always guaranteed to to have an email address.
              // You can also find more provider-specific information in `info.result`.
              // It typically contains a `fullProfile` object as well as ID and/or access
              // tokens that you can use for additional lookups.
              if (!email) {
                throw new Error('User profile contained no email');
              }

              // This example resolver simply uses the local part of the email as the name.
              const [name] = email.split('@');

              // This helper function handles sign-in by looking up a user in the catalog.
              // The lookup can be done either by reference, annotations, or custom filters.
              //
              // The helper also issues a token for the user, using the standard group
              // membership logic to determine the ownership references of the user.
              //
              // There are a number of other methods on the ctx, feel free to explore them!
              const userEntity = stringifyEntityRef({
                kind: 'User',
                name: name,
                namespace: DEFAULT_NAMESPACE,
              });

              return ctx.issueToken({
                claims: {
                  sub: userEntity, // The user's own identity
                  ent: [userEntity], // A list of identities that the user claims ownership through
                },
              });
            },
          }),
        });
      },
    });
  },
});

const backend = createBackend();

backend.add(
  import('@backstage-community/plugin-redhat-resource-optimization-backend'),
);

backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-proxy-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-techdocs-backend'));

// orchestrator plugin
backend.add(
  import('@red-hat-developer-hub/backstage-plugin-orchestrator-backend'),
);

// orchestrator plugin dependencies
backend.add(import('@backstage/plugin-notifications-backend'));
backend.add(import('@backstage/plugin-signals-backend'));

// auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
// See https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
// See https://backstage.io/docs/auth/guest/provider

backend.add(customGithubAuthModule);

// catalog plugin
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);

// permission plugin
backend.add(import('@backstage/plugin-permission-backend'));
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);

// search plugin
backend.add(import('@backstage/plugin-search-backend'));
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

backend.start();
