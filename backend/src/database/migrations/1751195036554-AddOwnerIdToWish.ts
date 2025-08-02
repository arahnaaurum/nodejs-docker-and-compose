import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOwnerIdToWish1751195036554 implements MigrationInterface {
  name = 'AddOwnerIdToWish1751195036554';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wishes_wishlists_wishlists" ("wishesId" integer NOT NULL, "wishlistsId" integer NOT NULL, CONSTRAINT "PK_68a5c15dfc1abe1c4df2e0c5508" PRIMARY KEY ("wishesId", "wishlistsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8191b99faf7cbb4009afb24ae4" ON "wishes_wishlists_wishlists" ("wishesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0beefb45a209ba627ef49ea6ad" ON "wishes_wishlists_wishlists" ("wishlistsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "wishes_wishlists_wishlists" ADD CONSTRAINT "FK_8191b99faf7cbb4009afb24ae46" FOREIGN KEY ("wishesId") REFERENCES "wishes"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishes_wishlists_wishlists" ADD CONSTRAINT "FK_0beefb45a209ba627ef49ea6ad6" FOREIGN KEY ("wishlistsId") REFERENCES "wishlists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wishes_wishlists_wishlists" DROP CONSTRAINT "FK_0beefb45a209ba627ef49ea6ad6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishes_wishlists_wishlists" DROP CONSTRAINT "FK_8191b99faf7cbb4009afb24ae46"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0beefb45a209ba627ef49ea6ad"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8191b99faf7cbb4009afb24ae4"`,
    );
    await queryRunner.query(`DROP TABLE "wishes_wishlists_wishlists"`);
  }
}
