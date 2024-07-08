/* eslint-disable no-console */
import { basename } from 'node:path';
import { execSync } from 'node:child_process';
import { writeFileSync, readdirSync, unlinkSync, rmSync } from 'node:fs';
import { fetchJson } from './fetch.mjs';
import { toYaml } from './yaml.mjs';

export function patchSpecTitle(specTitle = 'resource-optimization') {
  return spec => {
    spec.info.title = specTitle;
    return spec;
  };
}

export function pathPlotDetailsComponent(spec) {
  const plotDetailsDef = spec.components.schemas.PlotDetails;
  delete plotDetailsDef.properties;
  plotDetailsDef.additionalProperties = {
    type: 'object',
    properties: {
      cpuUsage: {
        $ref: '#/components/schemas/cpuUsage',
      },
      memoryUsage: {
        $ref: '#/components/schemas/memoryUsage',
      },
    },
  };

  return spec;
}

export function patchRecommendationsListQueryParams(spec) {
  const PROBLEMATIC_QUERY_PARAM_NAMES =
    /(cluster|workload_type|workload|container|project)/;
  const { parameters } = spec.paths['/recommendations/openshift'].get;
  const problematicParams = parameters.filter(param =>
    PROBLEMATIC_QUERY_PARAM_NAMES.test(param.name),
  );
  for (const param of problematicParams) {
    if (param.schema.type === 'string') {
      param.schema = {
        type: 'array',
        items: {
          type: 'string',
        },
      };
    }
  }

  return spec;
}

/**
 * The `getRecommendationsById` operation accepts a path parameter called 'recommendation-id'
 * that the code generator fails to transform into a valid JavaScript identifier due to the
 * usage of a dash (`-`) as the word separator character.
 * This patch converts the `-` into a `_` by mutating the input JSON OpenAPI spec.
 */
export function patchGetRecommendationsByIdPath(spec) {
  const getRecommendationsByIdPath =
    '/recommendations/openshift/{recommendation-id}';
  const getRecommendationsByIdDef = structuredClone(
    spec.paths[getRecommendationsByIdPath],
  );
  const getRecommendationsByIdParamDef =
    getRecommendationsByIdDef.get?.parameters.find(
      ({ name }) => name === 'recommendation-id',
    );
  if (getRecommendationsByIdParamDef) {
    getRecommendationsByIdParamDef.name =
      getRecommendationsByIdParamDef.name.replace('-', '_');
  }

  Object.assign(spec.paths, {
    [getRecommendationsByIdPath.replace('-', '_')]: getRecommendationsByIdDef,
  });
  delete spec.paths[getRecommendationsByIdPath];

  return spec;
}

export async function updateSchema({
  packageRootDir,
  specUrl,
  saveAs = 'openapi.yaml',
  afterDownloadCompletes = null,
}) {
  const spec = await fetchJson(specUrl);
  if (afterDownloadCompletes) afterDownloadCompletes(spec);

  const outputFile = `${packageRootDir}/src/schema/${saveAs}`;
  writeFileSync(
    outputFile,
    saveAs.endsWith('.yaml') ? toYaml(spec) : JSON.stringify(spec, null, 2),
  );
}

export function generateClient(packageRootDir) {
  const generatedFilesDir = `${packageRootDir}/src/generated/*`;
  rmSync(generatedFilesDir, { recursive: true, force: true });

  execSync(
    `yarn run -T backstage-repo-tools package schema openapi generate --client-package plugins/resource-optimization-common`,
    { cwd: packageRootDir, stdio: ['ignore', 'inherit', 'inherit'] },
  );
}

export function patchGeneratedModelFiles(packageRootDir) {
  const modelsDir = `${packageRootDir}/src/generated/models`;
  unlinkSync(`${modelsDir}/index.ts`);

  const fileNames = readdirSync(modelsDir);
  for (const fileName of fileNames) {
    const aliasName = fileName.replace(/\.model\.ts$/, '');
    const content = `export type { ${aliasName} } from "./${basename(
      fileName,
      '.ts',
    )}";\n`;
    writeFileSync(`${modelsDir}/index.ts`, content, { flag: 'a' });
  }
}

/**
 * Appends a type descibing the generated `*ApiClient` class; this type can later be consumed by `createApiRef` to provide type annotations.
 * Also, generates `apis/index.ts`.
 */
export function patchGeneratedApiFiles(packageRootDir) {
  const apisDir = `${packageRootDir}/src/generated/apis`;
  unlinkSync(`${apisDir}/index.ts`);

  const fileNames = readdirSync(apisDir);
  for (const fileName of fileNames) {
    const typeName = fileName.replace(/\.client\.ts$/, '');
    const className = fileName.replace(/\.client\.ts$/, 'Client');
    const content = `
export type ${typeName} = InstanceType<typeof ${className}>;
`;
    writeFileSync(`${apisDir}/${fileName}`, content, { flag: 'a' });
    const indexFileContent = `
export type { ${typeName} } from "./${basename(fileName, '.ts')}";
export { ${className} } from "./${basename(fileName, '.ts')}";
`;
    writeFileSync(`${apisDir}/index.ts`, indexFileContent, { flag: 'a' });
  }
}

export function patchGeneratedIndexFile(packageRootDir) {
  const indexFile = `${packageRootDir}/src/generated/index.ts`;
  unlinkSync(indexFile);
  const content = `
export * as Apis from "./apis";
export * as Models from "./models";

`;
  writeFileSync(`${indexFile}`, content.trimStart());
}

export function lintAndFormatGeneratedFiles(packageRootDir) {
  execSync('yarn backstage-cli package lint --fix src/generated', {
    cwd: packageRootDir,
    stdio: ['ignore', 'inherit', 'inherit'],
  });
}
