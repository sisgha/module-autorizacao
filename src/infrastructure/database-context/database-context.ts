import { DataSource, EntityManager, Repository } from 'typeorm';
import { GenericProjection } from '../../domain';
import { IAppResourceKey } from '../../domain/sisgea/IAppResourceKey';
import { IProjectionUsuarioRepository, getProjectionUsuarioRepository } from '../database/repositories/projection_usuario.repository';

export class DatabaseContext {
  constructor(readonly ds: DataSource | EntityManager) {}

  static new(ds: DataSource | EntityManager) {
    return new DatabaseContext(ds);
  }

  get projectionUsuarioRepository() {
    return getProjectionUsuarioRepository(this.ds);
  }

  getProjectionRepositoryForResource(resource: IAppResourceKey.USUARIO): IProjectionUsuarioRepository;
  getProjectionRepositoryForResource(resource: string | IAppResourceKey): Repository<GenericProjection> | null;

  getProjectionRepositoryForResource(resource: string | IAppResourceKey) {
    switch (resource) {
      case IAppResourceKey.USUARIO: {
        return this.projectionUsuarioRepository;
      }

      default: {
        return null;
      }
    }
  }
}
