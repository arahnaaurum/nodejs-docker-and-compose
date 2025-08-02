import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableDescritionInWishlist1751206679803
  implements MigrationInterface
{
  name = 'NullableDescritionInWishlist1751206679803';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wishlists" ALTER COLUMN "description" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wishlists" ALTER COLUMN "description" SET NOT NULL`,
    );
  }
}
