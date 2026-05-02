import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRolesData1773598252533 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO roles (name, claim_name)
                             VALUES ('Admin', 'admin')`);
    await queryRunner.query(`INSERT INTO roles (name, claim_name)
                             VALUES ('User', 'user')`);
    await queryRunner.query(`INSERT INTO roles (name, claim_name)
                             VALUES ('Support', 'support')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE
                             FROM roles
                             WHERE claim_name = "admin"`);
    await queryRunner.query(`DELETE
                             FROM roles
                             WHERE claim_name = "user" `);
    await queryRunner.query(`DELETE
                             FROM roles
                             WHERE claim_name = "support" `);
  }
}
