import { AppResourceUsuario } from '../../app-resources';
import { ProjectionUsuarioDbEntity } from '../entities/projection_usuario.db.entity';
import { IDatabaseAppResource } from '../interfaces/IDatabaseAppResource';
import { getProjectionUsuarioRepository } from '../repositories/projection_usuario.repository';

export const DatabaseAppResourceUsuario = {
  targetResource: AppResourceUsuario.resource,

  projectedTo: 'data',

  getEntity() {
    return ProjectionUsuarioDbEntity;
  },

  getRepositoryFactory() {
    return getProjectionUsuarioRepository;
  },
} satisfies IDatabaseAppResource;
