/* eslint-disable no-console */

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    generateClient,
    patchExternalDefinitions,
    patchGetRecommendationsByIdPath,
    updateSchema,
} from './lib/tasks.mjs';

async function main(_args) {
    const packageRootDir = dirname(fileURLToPath(dirname(import.meta.url)));

    console.log('Updating src/schema/resource-optimizations.openapi.yaml')
    await updateSchema({
        packageRootDir,
        specUrl: 'https://raw.githubusercontent.com/RedHatInsights/ros-ocp-backend/main/openapi.json',
        afterDownloadCompletes: patchGetRecommendationsByIdPath,
        saveAs: 'resource-optimizations.openapi.yaml',
    });
    console.log('Updating src/schema/openapi.yaml')
    await updateSchema({
        packageRootDir,
        specUrl: 'https://raw.githubusercontent.com/project-koku/koku/main/docs/specs/openapi.json',
        afterDownloadCompletes: async (spec) =>
            Promise.resolve(spec)
                .then(patchGetRecommendationsByIdPath)
                .then(patchExternalDefinitions),
        saveAs: 'openapi.yaml',
    })
    console.log('Running OpenAPI client generator')
    await generateClient(packageRootDir);
}

try {
    await main(process.argv.slice(2));
} catch (error) {
    console.error(error);
}
