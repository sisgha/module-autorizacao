import { DataSource, EntityManager, ObjectLiteral, Repository } from 'typeorm';

export type IDatabaseAppResource<
  TEntity extends ObjectLiteral = ObjectLiteral,
  TRepository extends Repository<TEntity> = Repository<TEntity>,
> = {
  targetResource: string;

  projectedTo: string | null;

  getEntity(): TEntity;
  getRepositoryFactory(): (dataSource: DataSource | EntityManager) => TRepository;
};
