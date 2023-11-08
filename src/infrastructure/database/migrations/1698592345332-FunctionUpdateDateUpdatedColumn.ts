import { MigrationInterface, QueryRunner } from 'typeorm';

export class FunctionUpdateDateUpdatedColumn1698592345332 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE OR REPLACE FUNCTION update_date_updated_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.date_updated = now(); 
      RETURN NEW;
    END;
    $$ language 'plpgsql';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP FUNCTION update_date_updated_column;');
  }
}
