import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1724798506048 implements MigrationInterface {
    name = 'AutoMigration1724798506048';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Rename the email column to role
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "email" TO "role"`);
        
        // Drop the existing username column
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
        
        // Add the new username column allowing nulls
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying`);
        
        // Populate existing records with a default username
        await queryRunner.query(`UPDATE "users" SET "username" = 'default_username' WHERE "username" IS NULL`);
        
        // Alter the column to set it as NOT NULL
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL`);
        
        // Drop the existing password column and recreate it
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying`);
        
        // Populate existing records with a default password
        await queryRunner.query(`UPDATE "users" SET "password" = 'default_password' WHERE "password" IS NULL`);
        
        // Alter the column to set it as NOT NULL
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
        
        // Drop the existing role column and create a new enum type for roles
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert changes in the reverse order
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "role" TO "email"`);
    }
}
