import * as YAML from 'yaml';

export function toYaml(jsonObject) {
  const yaml = new YAML.Document(jsonObject);
  return yaml.toString();
}
