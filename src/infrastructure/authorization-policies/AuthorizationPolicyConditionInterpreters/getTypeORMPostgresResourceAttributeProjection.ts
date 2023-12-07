import { IDatabaseAppResource } from '../../database/interfaces/IDatabaseAppResource';

export const getTypeORMPostgresResourceAttributeProjection = (
  alias: string,
  attribute: string,
  databaseAppResources: IDatabaseAppResource[] = [],
  aliasesMappings: Map<string, string> = new Map<string, string>(),
) => {
  const targetResource = aliasesMappings.has(alias) ? aliasesMappings.get(alias) : alias;

  const databaseAppResource = databaseAppResources.find((i) => i.targetResource === targetResource) ?? null;

  if (databaseAppResource) {
    if (databaseAppResource.projectedTo !== null) {
      return `${alias}.${databaseAppResource.projectedTo}->>'${attribute}'`;
    }
  }

  return `${alias}.${attribute}`;
};
