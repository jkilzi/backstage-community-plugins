/* eslint-disable no-console */

import { createWriteStream } from 'node:fs';
import { writeFile, readdir, unlink, rename } from 'node:fs/promises';
import { dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchSpec } from './lib/fetch.mjs';
import { parseLine, createFileLineIterator } from './lib/file-reader.mjs';
import { toYaml } from './lib/yaml.mjs';
import { exec } from './lib/exec.mjs';


// const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(dirname(import.meta.url));
const packageRootDir = dirname(__dirname);

function toExportStatement(file) {
    const alias = file.replace(/Api\.c/, 'ApiC').replace(/\.ts$/, '');
    return `export * as ${alias} from './generated/apis/${basename(file, '.ts')}'`;
}

async function updateSchema() {
    const specUrl = 'https://raw.githubusercontent.com/project-koku/koku/main/docs/specs/openapi.json';
    const baseSpec = await fetchSpec(specUrl);
    
    /**
     * The following paths are excluded because the "recommendations" endpoints
     * are refered dynamically in the above spec file, this means that their
     * definition can only be resolved after the spec is deployed.
     * 
     * For the sake of simplicity, we'll create an additional client called
     * "cost-management-recommendations-client", that will be generated from the
     * following spec: https://console.redhat.com/api/cost-management/v1/recommendations/openshift/openapi.json
     */
    const excludedPaths = [
        '/recommendations/openshift',
        '/recommendations/openshift/{recommendation-id}'
    ];
    
    for (const excludedPath of excludedPaths) {
        delete baseSpec.paths[excludedPath];
    }

    const outputFile = `${packageRootDir}/src/schema/openapi.yaml`
    await writeFile(outputFile, toYaml(baseSpec));
}

async function generatePackageEntryFile() {
    const outputFile = `${packageRootDir}/src/index.ts`;
    const generatedFilesDir = `${packageRootDir}/src/generated`;
    const generatedFiles = await readdir(`${generatedFilesDir}/apis`);
    const exportStatements = generatedFiles.map(toExportStatement);
    const content = `
${exportStatements.join('\n')}

export * from './generated/models';
`.trim().concat('\n');
    console.log(content)
    await writeFile(outputFile, content);
}

async function patchWellKnownProblematicModels() {
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

async function generateClientIgnoringLintingIssues() {
    return await exec('yarn run -T backstage-repo-tools package schema openapi generate --client-package plugins/cost-management-client &>/dev/null || true', { cwd: packageRootDir });
}

async function lintAndFixGeneratedFiles() {
    return await exec('yarn backstage-cli package lint --fix src/generated', { cwd: packageRootDir });
}

async function main(_args) {
    console.log('Updating src/schema/openapi.yaml')
    await updateSchema();
    console.log('Running openapi client generator')
    await generateClientIgnoringLintingIssues();
    await unlink(`${packageRootDir}/src/generated/apis/index.ts`); // This file is automatically generated. We don't need it.
    await unlink(`${packageRootDir}/src/generated/index.ts`); // This file is automatically generated. We don't need it.
    console.log('Patching well known problematic models')
    await patchWellKnownProblematicModels(); // Change their definitions to be `const enum`s    
    console.log('Generating src/index.ts')
    await generatePackageEntryFile();
    console.log('Linting files')
    await lintAndFixGeneratedFiles();
}

main(process.argv.slice(2));
