import { DataSource, EntityManager } from 'typeorm';
import { ProjectionUsuarioDbEntity } from '../entities/projection_usuario.db.entity';

export type IProjectionUsuarioRepository = ReturnType<typeof getProjectionUsuarioRepository>;

export const getProjectionUsuarioRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(ProjectionUsuarioDbEntity).extend({});
