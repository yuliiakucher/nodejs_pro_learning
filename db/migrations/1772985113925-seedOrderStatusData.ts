import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedOrderStatusData1772985113925 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO order_status (name)
                             VALUES ('NEW')`);
    await queryRunner.query(`INSERT INTO order_status (name)
                             VALUES ('PENDING_PAYMENT')`);
    await queryRunner.query(`INSERT INTO order_status (name)
                             VALUES ('PROCESSING')`);
    await queryRunner.query(`INSERT INTO order_status (name)
                             VALUES ('DELIVERED')`);
    await queryRunner.query(`INSERT INTO order_status (name)
                             VALUES ('CANCELLED')`);
    await queryRunner.query(`INSERT INTO order_status (name)
                             VALUES ('RETURNED')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
