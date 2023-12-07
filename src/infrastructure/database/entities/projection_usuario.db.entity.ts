import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { ProjectionUsuarioModel, UsuarioModel } from '../../../domain';

@Entity('projection_usuario')
export class ProjectionUsuarioDbEntity implements ProjectionUsuarioModel {
  @PrimaryColumn({ name: 'id' })
  id!: string;

  // ...

  @Column({ name: 'data', nullable: true, type: 'jsonb' })
  data!: UsuarioModel | null;

  // ...

  @CreateDateColumn({ name: 'date_created', type: 'timestamptz', nullable: false })
  dateCreated!: Date;

  @UpdateDateColumn({ name: 'date_updated', type: 'timestamptz', nullable: false })
  dateUpdated!: Date;
}
