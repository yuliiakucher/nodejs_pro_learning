import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenHashColumn1773503355076 implements MigrationInterface {
    name = 'AddRefreshTokenHashColumn1773503355076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "refresh_token_hash" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refresh_token_hash"`);
    }

}
