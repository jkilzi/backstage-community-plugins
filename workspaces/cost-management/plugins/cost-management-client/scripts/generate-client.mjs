/* eslint-disable no-console */

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    updateSchema,
    generateClient,
} from './lib/tasks.mjs';

/**
 * The `getRecommendationsById` operation accepts a path parameter called 'recommendation-id'
 * that the code generator fails to transform it into a valid JavaScript identifier.
 * This patch converts the `-` into a `_` by mutating the input JSON OpenAPI spec to solve this issue.
 */
function patchGetRecommendationsByIdPath(spec) {
    const getRecommendationsByIdPath = '/recommendations/openshift/{recommendation-id}';
    const getRecommendationsByIdDef = structuredClone(spec.paths[getRecommendationsByIdPath]);
    const getRecommendationsByIdParamDef = getRecommendationsByIdDef.get.parameters.find(({name}) => name === 'recommendation-id');
    getRecommendationsByIdParamDef.name = getRecommendationsByIdParamDef.name.replace('-', '_');
    Object.assign(spec.paths, { [getRecommendationsByIdPath.replace('-', '_')]: getRecommendationsByIdDef })
    delete spec.paths[getRecommendationsByIdPath];
}

async function main(_args) {
    const packageRootDir = dirname(fileURLToPath(dirname(import.meta.url)));

    console.log('Updating src/schema/openapi.yaml')
    await updateSchema({
        packageRootDir,
        specUrl: 'https://raw.githubusercontent.com/RedHatInsights/ros-ocp-backend/main/openapi.json',
        afterDownloadCompletes: patchGetRecommendationsByIdPath
    });
    console.log('Running openapi client generator')
    await generateClient({ cwd: packageRootDir });
}

main(process.argv.slice(2));
