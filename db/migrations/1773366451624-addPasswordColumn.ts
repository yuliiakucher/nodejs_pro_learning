import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordColumn1773366451624 implements MigrationInterface {
    name = 'AddPasswordColumn1773366451624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password_hash" character varying NOT NULL DEFAULT 'temp_password'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password_hash"`);
    }

}
