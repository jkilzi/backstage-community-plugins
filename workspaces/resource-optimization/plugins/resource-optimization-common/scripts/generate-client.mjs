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
    patchRecommendationsListQueryParams,
    patchSpecTitle,
    updateSchema,
} from './lib/tasks.mjs';

async function main(_args) {
    const packageRootDir = dirname(fileURLToPath(dirname(import.meta.url)));

    console.log('Updating src/schema/openapi.yaml')
    await updateSchema({
        packageRootDir,
        specUrl: 'https://raw.githubusercontent.com/RedHatInsights/ros-ocp-backend/main/openapi.json',
        afterDownloadCompletes: async (spec) =>
            Promise.resolve(spec)
                .then(patchSpecTitle('resource-optimization'))
                .then(patchRecommendationsListQueryParams)
                .then(patchGetRecommendationsByIdPath),
        saveAs: 'openapi.yaml',
    });
    console.log('Running OpenAPI client generator')
    await generateClient(packageRootDir);
    await patchGeneratedApiFiles(packageRootDir);
    await patchGeneratedModelFiles(packageRootDir);
    await patchGeneratedIndexFile(packageRootDir);
    console.log('Linting and formating generated files')
    await lintAndFormatGeneratedFiles(packageRootDir);
}

try {
    await main(process.argv.slice(2));
} catch (error) {
    console.error(error);
}
