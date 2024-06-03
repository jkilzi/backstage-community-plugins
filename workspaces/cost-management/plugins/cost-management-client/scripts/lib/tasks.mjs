/* eslint-disable no-console */
import { basename } from 'node:path';
import { writeFile, readdir, rename, unlink, rm, stat } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { createFileLineIterator, parseLine } from './file-reader.mjs';
import { fetchJson } from './fetch.mjs';
import { toYaml } from './yaml.mjs';
import { exec } from './exec.mjs';

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

    return spec;
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

    return spec;
}

export async function updateSchema({ packageRootDir, specUrl, saveAs = 'openapi.yaml', afterDownloadCompletes = null }) {
    const spec = await fetchJson(specUrl);
    if (afterDownloadCompletes) await afterDownloadCompletes(spec);

    const outputFile = `${packageRootDir}/src/schema/${saveAs}`
    await writeFile(outputFile, saveAs.endsWith('.yaml') ? toYaml(spec) : JSON.stringify(spec, null, 2));
}

export async function generateClient(packageRootDir) {
    const apisDir = `${packageRootDir}/src/generated/apis`;
    const dirInfo = await stat(apisDir);
    if (dirInfo.size > 0) {
        await rm(apisDir, { recursive: true, force: true });
    }

    await exec(
        `yarn run -T backstage-repo-tools package schema openapi generate --client-package plugins/cost-management-client &>/dev/null || true`,
        { cwd: packageRootDir }
    );

    await patchWellKnownProblematicModels(packageRootDir);
    await patchGeneratedApiFiles(packageRootDir);

    // The following file is not useful the way it gets generated, we won't use it.
    await unlink(`${packageRootDir}/src/generated/index.ts`);
    await generatePackageEntryFile(packageRootDir);
    await lintAndFixGeneratedFiles(packageRootDir);
}

async function patchWellKnownProblematicModels(packageRootDir) {
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
async function patchGeneratedApiFiles(packageRootDir) {
    const apisDir = `${packageRootDir}/src/generated/apis`;
    
    // src/generated/apis/index.ts is not generated correctly, we won't use it anyway.
    await unlink(`${apisDir}/index.ts`);

    const fileNames = await readdir(apisDir);
    for (const fileName of fileNames) {
        const newFileName = `${fileName}`.replace(/Api\.client\.ts$/, 'ApiClient.ts');
        await rename(`${apisDir}/${fileName}`, `${apisDir}/${newFileName}`);
        // Append a type descibing the generated Client class; these will be consumed by createApiRef to provide type annotations. 
        const content = `
export type ${basename(newFileName, '.ts').replace(/Client$/, '')} = InstanceType<typeof ${basename(newFileName, '.ts')}>;
`;
        await writeFile(`${apisDir}/${newFileName}`, content, { flag: 'a' })
    }
}

function toExportStatement(filename) {
    const fileBaseName = basename(filename, '.ts');
    return `export * as ${fileBaseName}Namespace from './generated/apis/${fileBaseName}'`;
}

async function generatePackageEntryFile(packageRootDir) {
    const outputFile = `${packageRootDir}/src/index.ts`;
    const generatedFilesDir = `${packageRootDir}/src/generated`;
    const generatedFiles = await readdir(`${generatedFilesDir}/apis`);
    const exportStatements = generatedFiles.map(toExportStatement);
    const content = `
${exportStatements.join('\n')}

export * from './generated/models';

`;
    await writeFile(outputFile, content);
}

async function lintAndFixGeneratedFiles(packageRootDir) {
    return await exec('yarn backstage-cli package lint --fix src/generated', { cwd: packageRootDir });
}
