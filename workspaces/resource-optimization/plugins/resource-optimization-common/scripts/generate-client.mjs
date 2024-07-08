/* eslint-disable no-console */

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  generateClient,
  lintAndFormatGeneratedFiles,
  patchGeneratedApiFiles,
  patchGeneratedIndexFile,
  patchGeneratedModelFiles,
  patchGetRecommendationsByIdPath,
  pathPlotDetailsComponent,
  patchRecommendationsListQueryParams,
  patchSpecTitle,
  updateSchema,
} from './lib/tasks.mjs';

async function main(_args) {
  const packageRootDir = dirname(fileURLToPath(dirname(import.meta.url)));

  console.log('Updating src/schema/openapi.yaml');
  await updateSchema({
    packageRootDir,
    specUrl:
      'https://raw.githubusercontent.com/RedHatInsights/ros-ocp-backend/main/openapi.json',
    afterDownloadCompletes: spec => {
      patchSpecTitle('resource-optimization')(spec);
      patchRecommendationsListQueryParams(spec);
      patchGetRecommendationsByIdPath(spec);
      pathPlotDetailsComponent(spec);
    },
    saveAs: 'openapi.yaml',
  });
  console.log('Running OpenAPI client generator');
  generateClient(packageRootDir);
  patchGeneratedApiFiles(packageRootDir);
  patchGeneratedModelFiles(packageRootDir);
  patchGeneratedIndexFile(packageRootDir);
  console.log('Linting and formating generated files');
  lintAndFormatGeneratedFiles(packageRootDir);
}

try {
  await main(process.argv.slice(2));
} catch (error) {
  console.error(error);
}
