import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndex1772411370950 implements MigrationInterface {
    name = 'AddIndex1772411370950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_c30f00a871de74c8e8c213acc4" ON "products" ("title") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_c30f00a871de74c8e8c213acc4"`);
    }

}
