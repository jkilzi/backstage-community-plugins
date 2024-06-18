import { Apis } from "@backstage-community/plugin-resource-optimization-common";
import { createApiRef } from "@backstage/core-plugin-api";


export const optimizationsApiRef = createApiRef<Apis.OptimizationsApi>({
  id: 'plugin.resource-optimization.api',
});     