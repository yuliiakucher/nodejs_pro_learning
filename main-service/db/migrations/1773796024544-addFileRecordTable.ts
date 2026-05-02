import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFileRecordTable1773796024544 implements MigrationInterface {
    name = 'AddFileRecordTable1773796024544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."file_records_status_enum" AS ENUM('pending', 'ready')`);
        await queryRunner.query(`CREATE TYPE "public"."file_records_visibility_enum" AS ENUM('private', 'public')`);
        await queryRunner.query(`CREATE TABLE "file_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "key" character varying NOT NULL, "content_type" character varying NOT NULL, "size" integer NOT NULL, "status" "public"."file_records_status_enum" NOT NULL DEFAULT 'pending', "visibility" "public"."file_records_visibility_enum" NOT NULL DEFAULT 'private', "user_id" uuid, CONSTRAINT "PK_17d6bda4e953aace5de8a299e34" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "file_records" ADD CONSTRAINT "FK_8045e79ea8d49df970da86985f5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_records" DROP CONSTRAINT "FK_8045e79ea8d49df970da86985f5"`);
        await queryRunner.query(`DROP TABLE "file_records"`);
        await queryRunner.query(`DROP TYPE "public"."file_records_visibility_enum"`);
        await queryRunner.query(`DROP TYPE "public"."file_records_status_enum"`);
    }

}
