import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProcessedMessagesTable1775683727221 implements MigrationInterface {
    name = 'AddProcessedMessagesTable1775683727221'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "processed_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "message_id" character varying NOT NULL, "processed_at" character varying NOT NULL, "orderId" uuid, CONSTRAINT "UQ_e357ddfac536c6c9708130ec3bc" UNIQUE ("message_id"), CONSTRAINT "PK_61d06681389f1e78ca233e08d55" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "processed_messages" ADD CONSTRAINT "FK_c2c3bc4a91f0e0726e29f9beb57" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processed_messages" DROP CONSTRAINT "FK_c2c3bc4a91f0e0726e29f9beb57"`);
        await queryRunner.query(`DROP TABLE "processed_messages"`);
    }

}
