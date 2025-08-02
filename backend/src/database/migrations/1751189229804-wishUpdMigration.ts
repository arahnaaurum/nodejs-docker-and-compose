import { MigrationInterface, QueryRunner } from 'typeorm';

export class WishUpdMigration1751189229804 implements MigrationInterface {
  name = 'WishUpdMigration1751189229804';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wishes" ALTER COLUMN "raised" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wishes" ALTER COLUMN "raised" SET NOT NULL`,
    );
  }
}
