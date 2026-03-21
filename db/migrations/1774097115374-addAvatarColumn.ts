import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarColumn1774097115374 implements MigrationInterface {
    name = 'AddAvatarColumn1774097115374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
    }

}
