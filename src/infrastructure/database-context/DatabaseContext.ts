import { DataSource, EntityManager, Repository } from 'typeorm';
import { GenericProjection, IAppResourceKey } from '../../domain';
import { IProjectionUsuarioRepository, getProjectionUsuarioRepository } from '../database/repositories/projection_usuario.repository';

export class DatabaseContext {
  constructor(readonly ds: DataSource | EntityManager) {}

  get dataSource() {
    if (this.ds instanceof DataSource) {
      return this.ds;
    } else {
      return this.ds.connection;
    }
  }

  get manager() {
    if (this.ds instanceof DataSource) {
      return this.ds.manager;
    } else {
      return this.ds;
    }
  }

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
