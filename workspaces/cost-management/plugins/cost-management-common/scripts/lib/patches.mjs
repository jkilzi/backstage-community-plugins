/* eslint-disable no-console */
import { createWriteStream } from 'node:fs';
import { writeFile, unlink, rename, readdir } from 'node:fs/promises';
import { basename } from 'node:path';
import { createFileLineIterator, parseLine } from './file-reader.mjs';

/**
 * The `getRecommendationsById` operation accepts a path parameter called 'recommendation-id'
 * that the code generator fails to transform it into a valid JavaScript identifier.
 * This patch converts the `-` into a `_` by mutating the input JSON OpenAPI spec.
 */
export function patchGetRecommendationsByIdPath(spec) {
    const getRecommendationsByIdPath = '/recommendations/openshift/{recommendation-id}';
    const getRecommendationsByIdDef = structuredClone(spec.paths[getRecommendationsByIdPath]);
    const getRecommendationsByIdParamDef = getRecommendationsByIdDef.get?.parameters
        .find(({name}) => name === 'recommendation-id');
    if (getRecommendationsByIdParamDef) {
        getRecommendationsByIdParamDef.name = getRecommendationsByIdParamDef.name.replace('-', '_');
    }

    Object.assign(spec.paths, { [getRecommendationsByIdPath.replace('-', '_')]: getRecommendationsByIdDef })
    delete spec.paths[getRecommendationsByIdPath];
}

export function patchExternalDefinitions(spec) {
    const pathsToBePatched = [
        '/recommendations/openshift',
        '/recommendations/openshift/{recommendation_id}'
    ];

    for (const pathToBePathed of pathsToBePatched) {
        spec.paths[pathToBePathed].$ref =
            spec.paths[pathToBePathed].$ref
                .replace(
                    '/api/cost-management/v1/recommendations/openshift/openapi.json',
                    'resource-optimizations.openapi.yaml',
                );
        if (/recommendation-id%7D$/.test(spec.paths[pathToBePathed].$ref)) {
            spec.paths[pathToBePathed].$ref =
                spec.paths[pathToBePathed].$ref
                    .replace('recommendation-id', 'recommendation_id');
        }
    }
}

export async function patchWellKnownProblematicModels(packageRootDir) {
    const modelsDir = `${packageRootDir}/src/generated/models`;
    const fileSuffix = '.model.ts';
    const wellKnownProblematicModels = [
        { modelName: 'ReportResolution' },
        { modelName: 'ReportResourceScope' },
        { modelName: 'ReportTimeScopeUnits' },
        { modelName: 'ReportTimeScopeValue' },
    ];
    
    for (const { modelName } of wellKnownProblematicModels) {
        const inputFilePath = `${modelsDir}/${modelName}${fileSuffix}`;
        const outputFilePath = `${inputFilePath}_tmp`;
        const outputFileStream = createWriteStream(outputFilePath);
        
        const lineIterator = createFileLineIterator(inputFilePath);
        for await (const [lineContent, lineNumber] of lineIterator) {
            if (/^\/{2}/.test(lineContent) || lineContent.length === 0) {
                outputFileStream.write(`${lineContent}\n`);
                continue;
            } else {
                const [ patternOrError, kind ] = parseLine(
                    lineContent,
                    lineNumber,
                    modelName
                );
                
                if (!kind) {
                    await unlink(outputFilePath);
                    console.error(`Error parsing file: ${inputFilePath}`);
                    outputFileStream.close();
                    throw patternOrError;
                } else {
                    switch (kind) {
                        case 'type-alias':
                            continue;
                        case 'object-def':
                            outputFileStream.write(`export const enum ${modelName} {\n`);
                            break;
                        case 'prop-def': {
                            const { propName, propValue } = patternOrError.exec(lineContent).groups;
                            outputFileStream.write(`    ${propName} = ${propValue},\n`);
                            break;
                        }
                        case 'curly-brace-close':
                            outputFileStream.write(`}\n`);
                            break;

                        default:
                            outputFileStream.close();
                            throw new Error('Unknown pattern kind');
                    }
                } 

            }
        }
        outputFileStream.close();
        await unlink(inputFilePath);
        await rename(outputFilePath, inputFilePath);
    }
}

/**
 *  Renames generated files ending with `*Api.client.ts` to `*Client.ts`
 */
export async function patchGeneratedApiFiles(packageRootDir) {
    const apisDir = `${packageRootDir}/src/generated/apis`;
    const fileNames = await readdir(apisDir);
    for (const fileName of fileNames) {
        const newFileName = `${fileName}`.replace(/Api\.client\.ts$/, 'ApiClient.ts');
        await rename(`${apisDir}/${fileName}`, `${apisDir}/${newFileName}`);
        // Append a type descibing the generated Client class;
        const content = `
export type ${basename(newFileName, '.ts').replace(/Client$/, '')} = InstanceType<typeof ${basename(newFileName, '.ts')}>;
`;
        await writeFile(`${apisDir}/${newFileName}`, content, { flag: 'a' })
    }
}
