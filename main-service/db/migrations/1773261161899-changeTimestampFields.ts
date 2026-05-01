import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTimestampFields1773261161899 implements MigrationInterface {
    name = 'ChangeTimestampFields1773261161899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order_status" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "order_status" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order_status" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "order_status" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order_status" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "order_status" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order_status" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "order_status" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
