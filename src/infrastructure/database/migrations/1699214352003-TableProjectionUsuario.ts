import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableProjectionUsuario1699214352003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'projection_usuario',

        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },

          // ...

          {
            name: 'data',
            type: 'jsonb',
            isNullable: true,
          },

          //

          {
            name: 'date_created',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },

          {
            name: 'date_updated',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.query(`
      CREATE TRIGGER track_projection_usuario_updated_at 
        BEFORE UPDATE ON projection_usuario FOR EACH ROW EXECUTE PROCEDURE 
        update_date_updated_column();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('projection_usuario', true);
  }
}
