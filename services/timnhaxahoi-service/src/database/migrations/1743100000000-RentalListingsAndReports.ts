import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * R1 — rental_listings + rental_listing_reports (§19, §19.1a).
 * Không trộn với housing_projects.
 */
export class RentalListingsAndReports1743100000000 implements MigrationInterface {
  name = 'RentalListingsAndReports1743100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."rental_listing_reports_status_enum" AS ENUM('OPEN', 'REVIEWED', 'DISMISSED')`,
    );

    await queryRunner.query(`
      CREATE TABLE "rental_listings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "owner_user_id" uuid NOT NULL,
        "title" character varying(255) NOT NULL,
        "description" text,
        "province" character varying(255),
        "district" character varying(255),
        "address_line" text,
        "lat" double precision,
        "lng" double precision,
        "price_monthly" integer NOT NULL,
        "area_m2" integer,
        "contact_phone" character varying(32) NOT NULL,
        "slug" character varying(255) NOT NULL,
        "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "visible_public" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_rental_listings" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_rental_listings_slug" UNIQUE ("slug"),
        CONSTRAINT "FK_rental_listings_owner" FOREIGN KEY ("owner_user_id") REFERENCES "users_satellite"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_rental_listings_owner" ON "rental_listings" ("owner_user_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_rental_listings_province_district" ON "rental_listings" ("province", "district")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_rental_listings_expires" ON "rental_listings" ("expires_at")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_rental_listings_visible_public" ON "rental_listings" ("visible_public")
    `);

    await queryRunner.query(`
      CREATE TABLE "rental_listing_reports" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "listing_id" uuid NOT NULL,
        "reporter_user_id" uuid,
        "reason" character varying(500) NOT NULL,
        "status" "public"."rental_listing_reports_status_enum" NOT NULL DEFAULT 'OPEN',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_rental_listing_reports" PRIMARY KEY ("id"),
        CONSTRAINT "FK_rental_reports_listing" FOREIGN KEY ("listing_id") REFERENCES "rental_listings"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_rental_reports_reporter" FOREIGN KEY ("reporter_user_id") REFERENCES "users_satellite"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_rental_reports_listing" ON "rental_listing_reports" ("listing_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_rental_reports_status" ON "rental_listing_reports" ("status")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "rental_listing_reports"`);
    await queryRunner.query(`DROP TABLE "rental_listings"`);
    await queryRunner.query(`DROP TYPE "public"."rental_listing_reports_status_enum"`);
  }
}
