import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHandlerColumn1775683935395 implements MigrationInterface {
    name = 'AddHandlerColumn1775683935395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processed_messages" ADD "handler" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processed_messages" DROP COLUMN "handler"`);
    }

}
