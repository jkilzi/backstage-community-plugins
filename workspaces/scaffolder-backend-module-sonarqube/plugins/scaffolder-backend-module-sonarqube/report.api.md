## API Report File for "@backstage-community/plugin-scaffolder-backend-module-sonarqube"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
import { BackendFeature } from '@backstage/backend-plugin-api';
import { JsonObject } from '@backstage/types';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';

// @public (undocumented)
export const createSonarQubeProjectAction: () => TemplateAction<
  TemplateActionParameters,
  JsonObject
>;

// @public (undocumented)
const scaffolderModuleSonarqubeActions: BackendFeature;
export default scaffolderModuleSonarqubeActions;

// @public (undocumented)
export type TemplateActionParameters = {
  baseUrl: string;
  token?: string;
  username?: string;
  password?: string;
  name: string;
  key: string;
  branch?: string;
  visibility?: string;
};
```