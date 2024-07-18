import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

export async function* createFileLineIterator(filePath) {
  const fileStream = createReadStream(filePath);
  const lineReader = createInterface({ input: fileStream });
  let lineCounter = 0;

  for await (const line of lineReader) {
    yield [line, lineCounter++];
  }
}

export function parseLine(line, lineNumber, modelName) {
  const patterns = [
    [new RegExp(`^export type ${modelName} = .+$`), 'type-alias'],
    [new RegExp(`^export const ${modelName} = `), 'object-def'],
    [
      new RegExp(
        `^\\s{2,4}(?<propName>(?!\\d)[\\w$]+): (?<propValue>['\\w-]+) as ${modelName},?`,
        'i',
      ),
      'prop-def',
    ],
    [/^\};/, 'curly-brace-close'],
  ];

  let result;
  for (const [pattern, kind] of patterns) {
    if (pattern.test(line)) {
      result = [pattern, kind];
      break;
    }
  }

  if (!result) {
    result = [new Error(`Unknown syntax at line: ${lineNumber}`), null];
  }

  return result;
}
