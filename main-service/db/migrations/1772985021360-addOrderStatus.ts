import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderStatus1772985021360 implements MigrationInterface {
    name = 'AddOrderStatus1772985021360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_8ea75b2a26f83f3bc98b9c6aaf6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "order_status_id" uuid`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_f51b75ebdfdef60d264f982a60f" FOREIGN KEY ("order_status_id") REFERENCES "order_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_f51b75ebdfdef60d264f982a60f"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "order_status_id"`);
        await queryRunner.query(`DROP TABLE "order_status"`);
    }

}
