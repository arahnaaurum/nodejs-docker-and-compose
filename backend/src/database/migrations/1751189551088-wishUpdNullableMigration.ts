import { MigrationInterface, QueryRunner } from 'typeorm';

export class WishUpdNullableMigration1751189551088
  implements MigrationInterface
{
  name = 'WishUpdNullableMigration1751189551088';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wishes" ALTER COLUMN "copied" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wishes" ALTER COLUMN "copied" SET NOT NULL`,
    );
  }
}
