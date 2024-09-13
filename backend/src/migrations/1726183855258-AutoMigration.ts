import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1726183855258 implements MigrationInterface {
    name = 'AutoMigration1726183855258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop constraints if they exist
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT IF EXISTS "order_items_order_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT IF EXISTS "order_items_product_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "orders_user_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT IF EXISTS "product_categories_product_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT IF EXISTS "product_categories_category_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_role_check"`);

        // Rename columns
        await queryRunner.query(`ALTER TABLE "order_items" RENAME COLUMN "deletedat" TO "deletedAt"`);

        // Drop columns if they exist
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN IF EXISTS "customername"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN IF EXISTS "shippingaddress"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN IF EXISTS "totalamount"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN IF EXISTS "createdat"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN IF EXISTS "deletedat"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "entityname"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "entityid"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "performedby"`);

        // Add new columns with defaults
        await queryRunner.query(`ALTER TABLE "orders" ADD "customerName" character varying(255) NOT NULL DEFAULT 'name'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "shippingAddress" text NOT NULL DEFAULT 'address'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "totalAmount" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "entityName" character varying NOT NULL DEFAULT 'Product'`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "entityId" integer NOT NULL DEFAULT '-1'`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "performedBy" character varying(255) DEFAULT 'ADMIN'`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "stock" SET DEFAULT '0'`);

        // Handle users table column addition
        // Check if column exists before adding it
        const columnExists = await queryRunner.query(`SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='password'`);
        if (columnExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL DEFAULT ''`);
        }

        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "role"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'user'`);

        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "action"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "action" character varying NOT NULL DEFAULT 'N/A'`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ALTER COLUMN "timestamp" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ALTER COLUMN "timestamp" SET DEFAULT now()`);

        // Create indexes and foreign key constraints
        await queryRunner.query(`CREATE INDEX "IDX_8748b4a0e8de6d266f2bbc877f" ON "product_categories" ("product_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_9148da8f26fc248e77a387e311" ON "product_categories" ("category_id")`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "FK_8748b4a0e8de6d266f2bbc877f6" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "FK_9148da8f26fc248e77a387e3112" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "FK_9148da8f26fc248e77a387e3112"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "FK_8748b4a0e8de6d266f2bbc877f6"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_9263386c35b6b242540f9493b00"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9148da8f26fc248e77a387e311"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8748b4a0e8de6d266f2bbc877f"`);

        await queryRunner.query(`ALTER TABLE "audit_logs" ALTER COLUMN "timestamp" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ALTER COLUMN "timestamp" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "action"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "action" character varying(50) DEFAULT 'N/A'`);

        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying(50) DEFAULT 'user'`);

        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`);

        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "stock" DROP DEFAULT`);

        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "performedBy"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "entityId"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "entityName"`);

        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "totalAmount"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "shippingAddress"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "customerName"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "performedby" character varying(255) DEFAULT 'ADMIN'`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "entityid" integer DEFAULT '-1'`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "entityname" character varying(255) DEFAULT 'Product'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "deletedat" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "createdat" TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "totalamount" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "shippingaddress" text`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "customername" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "order_items" RENAME COLUMN "deletedAt" TO "deletedat"`);
    }
}
