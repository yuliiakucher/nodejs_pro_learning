import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProcessedAt1775078690117 implements MigrationInterface {
    name = 'AddProcessedAt1775078690117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "processed_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "processed_at"`);
    }

}
