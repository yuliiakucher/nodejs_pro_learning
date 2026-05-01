import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedColumns1775690517181 implements MigrationInterface {
    name = 'FixedColumns1775690517181'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processed_messages" DROP CONSTRAINT "UQ_e357ddfac536c6c9708130ec3bc"`);
        await queryRunner.query(`ALTER TABLE "processed_messages" DROP COLUMN "message_id"`);
        await queryRunner.query(`ALTER TABLE "processed_messages" ADD "message_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "processed_messages" ADD CONSTRAINT "UQ_e357ddfac536c6c9708130ec3bc" UNIQUE ("message_id")`);
        await queryRunner.query(`ALTER TABLE "processed_messages" DROP COLUMN "processed_at"`);
        await queryRunner.query(`ALTER TABLE "processed_messages" ADD "processed_at" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processed_messages" DROP COLUMN "processed_at"`);
        await queryRunner.query(`ALTER TABLE "processed_messages" ADD "processed_at" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "processed_messages" DROP CONSTRAINT "UQ_e357ddfac536c6c9708130ec3bc"`);
        await queryRunner.query(`ALTER TABLE "processed_messages" DROP COLUMN "message_id"`);
        await queryRunner.query(`ALTER TABLE "processed_messages" ADD "message_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "processed_messages" ADD CONSTRAINT "UQ_e357ddfac536c6c9708130ec3bc" UNIQUE ("message_id")`);
    }

}
