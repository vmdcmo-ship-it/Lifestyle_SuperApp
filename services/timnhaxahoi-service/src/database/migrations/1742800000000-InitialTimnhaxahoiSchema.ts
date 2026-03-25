import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Schema ban đầu — khớp entities TypeORM (users_satellite, quiz_analytic, housing_projects).
 * Chạy trên PostgreSQL ≥ 12 (uuid-ossp).
 */
export class InitialTimnhaxahoiSchema1742800000000 implements MigrationInterface {
  name = 'InitialTimnhaxahoiSchema1742800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(
      `CREATE TYPE "public"."housing_projects_status_enum" AS ENUM('UPCOMING', 'BUILDING', 'SELLING')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."housing_projects_kind_enum" AS ENUM('NOXH', 'AFFORDABLE_COMMERCIAL')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_satellite_lead_segment_enum" AS ENUM('GREEN', 'YELLOW', 'RED', 'ORANGE_SPECIAL')`,
    );

    await queryRunner.query(`
      CREATE TABLE "housing_projects" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "slug" character varying(255) NOT NULL,
        "lat" double precision NOT NULL,
        "lng" double precision NOT NULL,
        "province" character varying(255),
        "district" character varying(255),
        "price_per_m2" integer NOT NULL,
        "typical_area_m2" integer NOT NULL DEFAULT 70,
        "total_units" integer,
        "status" "public"."housing_projects_status_enum" NOT NULL DEFAULT 'SELLING',
        "legal_score" smallint NOT NULL DEFAULT 80,
        "images" jsonb,
        "videos_url" jsonb,
        "legal_info" text,
        "kind" "public"."housing_projects_kind_enum" NOT NULL DEFAULT 'NOXH',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_housing_projects" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_housing_projects_slug" UNIQUE ("slug")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "users_satellite" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "superapp_uid" character varying(128),
        "phone_number" character varying(32) NOT NULL,
        "email" character varying(255) NOT NULL,
        "full_name" character varying(255),
        "lead_segment" "public"."users_satellite_lead_segment_enum",
        "profile_score" smallint,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users_satellite" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_satellite_superapp_uid" UNIQUE ("superapp_uid"),
        CONSTRAINT "UQ_users_satellite_phone_number" UNIQUE ("phone_number")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "quiz_analytic" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "raw_data" jsonb NOT NULL,
        "calculated_score" smallint NOT NULL,
        "recommended_project_ids" jsonb NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_quiz_analytic" PRIMARY KEY ("id"),
        CONSTRAINT "FK_quiz_analytic_user" FOREIGN KEY ("user_id") REFERENCES "users_satellite"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "quiz_analytic"`);
    await queryRunner.query(`DROP TABLE "users_satellite"`);
    await queryRunner.query(`DROP TABLE "housing_projects"`);
    await queryRunner.query(`DROP TYPE "public"."users_satellite_lead_segment_enum"`);
    await queryRunner.query(`DROP TYPE "public"."housing_projects_kind_enum"`);
    await queryRunner.query(`DROP TYPE "public"."housing_projects_status_enum"`);
  }
}
