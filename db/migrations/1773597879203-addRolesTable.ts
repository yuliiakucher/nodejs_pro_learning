import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRolesTable1773597879203 implements MigrationInterface {
    name = 'AddRolesTable1773597879203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "claim_name" character varying(255) NOT NULL, CONSTRAINT "UQ_35820b8ca953bff9fbd39150a0f" UNIQUE ("claim_name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
