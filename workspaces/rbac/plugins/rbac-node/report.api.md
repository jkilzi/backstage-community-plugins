## API Report File for "@backstage-community/plugin-rbac-node"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { ExtensionPoint } from '@backstage/backend-plugin-api';

// @public
export interface PluginIdProvider {
    // (undocumented)
    getPluginIds: () => string[];
}

// @public
export type PluginIdProviderExtensionPoint = {
    addPluginIdProvider(pluginIdProvider: PluginIdProvider): void;
};

// @public
export const pluginIdProviderExtensionPoint: ExtensionPoint<PluginIdProviderExtensionPoint>;

// @public (undocumented)
export interface RBACProvider {
    // (undocumented)
    connect(connection: RBACProviderConnection): Promise<void>;
    // (undocumented)
    getProviderName(): string;
    // (undocumented)
    refresh(): Promise<void>;
}

// @public (undocumented)
export interface RBACProviderConnection {
    // (undocumented)
    applyPermissions(permissions: string[][]): Promise<void>;
    // (undocumented)
    applyRoles(roles: string[][]): Promise<void>;
}

// @public (undocumented)
export type RBACProviderExtensionPoint = {
    addRBACProvider(...providers: Array<RBACProvider | Array<RBACProvider>>): void;
};

// @public (undocumented)
export const rbacProviderExtensionPoint: ExtensionPoint<RBACProviderExtensionPoint>;

```