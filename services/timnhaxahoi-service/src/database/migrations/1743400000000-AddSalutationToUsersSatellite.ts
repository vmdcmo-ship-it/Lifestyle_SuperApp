import { MigrationInterface, QueryRunner } from 'typeorm';

/** Danh xưng từ quiz NOXH (anh | chi). */
export class AddSalutationToUsersSatellite1743400000000 implements MigrationInterface {
  name = 'AddSalutationToUsersSatellite1743400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_satellite" ADD "salutation" character varying(8)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users_satellite" DROP COLUMN "salutation"`);
  }
}
