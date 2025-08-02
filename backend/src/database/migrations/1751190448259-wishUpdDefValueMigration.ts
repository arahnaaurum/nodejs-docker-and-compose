import { MigrationInterface, QueryRunner } from 'typeorm';

export class WishUpdDefValueMigration1751190448259
  implements MigrationInterface
{
  name = 'WishUpdDefValueMigration1751190448259';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wishes" ALTER COLUMN "raised" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishes" ALTER COLUMN "raised" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishes" ALTER COLUMN "copied" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishes" ALTER COLUMN "copied" SET DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wishes" ALTER COLUMN "copied" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishes" ALTER COLUMN "copied" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishes" ALTER COLUMN "raised" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishes" ALTER COLUMN "raised" DROP NOT NULL`,
    );
  }
}
