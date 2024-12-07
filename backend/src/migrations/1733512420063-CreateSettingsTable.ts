import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSettingsTable1733512420063 implements MigrationInterface {
    name = 'CreateSettingsTable1733512420063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "company"`);
        await queryRunner.query(`ALTER TABLE "settings" ADD "company" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "invoice"`);
        await queryRunner.query(`ALTER TABLE "settings" ADD "invoice" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "settings" ADD "email" text`);
        await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "emailTemplates"`);
        await queryRunner.query(`ALTER TABLE "settings" ADD "emailTemplates" text`);
        await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "ui"`);
        await queryRunner.query(`ALTER TABLE "settings" ADD "ui" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "ui"`);
        await queryRunner.query(`ALTER TABLE "settings" ADD "ui" json`);
        await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "emailTemplates"`);
        await queryRunner.query(`ALTER TABLE "settings" ADD "emailTemplates" json`);
        await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "settings" ADD "email" json`);
        await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "invoice"`);
        await queryRunner.query(`ALTER TABLE "settings" ADD "invoice" json`);
        await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "company"`);
        await queryRunner.query(`ALTER TABLE "settings" ADD "company" json`);
    }

}
