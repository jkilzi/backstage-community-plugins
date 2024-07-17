import { OptimizationsApi } from "@backstage-community/plugin-resource-optimization-common";
import { createApiRef } from "@backstage/core-plugin-api";


export const optimizationsApiRef = createApiRef<OptimizationsApi>({
  id: 'plugin.resource-optimization.api',
});
