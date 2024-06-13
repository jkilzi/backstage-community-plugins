/* eslint-disable no-console */
import { basename } from 'node:path';
import { writeFile, readdir, unlink, rm, stat } from 'node:fs/promises';
import { fetchJson } from './fetch.mjs';
import { toYaml } from './yaml.mjs';
import { exec } from './exec.mjs';

export function patchSpecTitle(specTitle = 'resource-optimization') {
  return spec => {
    spec.info.title = specTitle;
    return spec;
  };
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
  if (afterDownloadCompletes) await afterDownloadCompletes(spec);

  const outputFile = `${packageRootDir}/src/schema/${saveAs}`;
  await writeFile(
    outputFile,
    saveAs.endsWith('.yaml') ? toYaml(spec) : JSON.stringify(spec, null, 2),
  );
}

export async function generateClient(packageRootDir) {
  const apisDir = `${packageRootDir}/src/generated/apis`;
  try {
    const dirInfo = await stat(apisDir);
    if (dirInfo.size > 0) {
      await rm(apisDir, { recursive: true, force: true });
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`WARN: ${apisDir} could not be found`);
    }
  }

  await exec(
    `yarn run -T backstage-repo-tools package schema openapi generate --client-package plugins/resource-optimization-common &>/dev/null || true`,
    { cwd: packageRootDir },
  );
}

export async function patchGeneratedModelFiles(packageRootDir) {
  const modelsDir = `${packageRootDir}/src/generated/models`;
  await unlink(`${modelsDir}/index.ts`);

  const fileNames = await readdir(modelsDir);
  for (const fileName of fileNames) {
    const aliasName = fileName.replace(/\.model\.ts$/, '');
    const content = `export type { ${aliasName} } from "./${basename(
      fileName,
      '.ts',
    )}";\n`;
    await writeFile(`${modelsDir}/index.ts`, content, { flag: 'a' });
  }
}

/**
 * Appends a type descibing the generated `*ApiClient` class; this type can later be consumed by `createApiRef` to provide type annotations.
 * Also, generates `apis/index.ts`.
 */
export async function patchGeneratedApiFiles(packageRootDir) {
  const apisDir = `${packageRootDir}/src/generated/apis`;
  await unlink(`${apisDir}/index.ts`);

  const fileNames = await readdir(apisDir);
  for (const fileName of fileNames) {
    const typeName = fileName.replace(/\.client\.ts$/, '');
    const className = fileName.replace(/\.client\.ts$/, 'Client');
    const content = `export type ${typeName} = InstanceType<typeof ${className}>;`;
    await writeFile(`${apisDir}/${fileName}`, content, { flag: 'a' });
    const indexFileContent = `
export type { ${typeName} } from "./${basename(fileName, '.ts')}";
export { ${className} } from "./${basename(fileName, '.ts')}";
`;
    await writeFile(`${apisDir}/index.ts`, indexFileContent, { flag: 'a' });
  }
}

export async function lintAndFormatGeneratedFiles(packageRootDir) {
  return await exec('yarn backstage-cli package lint --fix src/generated', {
    cwd: packageRootDir,
  });
}

export async function patchGeneratedIndexFile(packageRootDir) {
  const indexFile = `${packageRootDir}/src/generated/index.ts`;
  await unlink(indexFile);
  const content = `
export * as Apis from "./apis";
export * as Models from "./models";

`;
  await writeFile(`${indexFile}`, content.trimStart());
}
