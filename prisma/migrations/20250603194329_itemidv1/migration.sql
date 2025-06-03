/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `item_id` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
*/

-- Drop foreign key constraint on OrderItem
ALTER TABLE "OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_productId_fkey";

-- Alter productId column type to uuid, casting existing values
ALTER TABLE "OrderItem" 
  ALTER COLUMN "productId" TYPE uuid USING "productId"::uuid;

-- Drop Product primary key constraint
ALTER TABLE "Product" DROP CONSTRAINT IF EXISTS "Product_pkey";

-- Drop and recreate the item_id column with default gen_random_uuid()
ALTER TABLE "Product" DROP COLUMN IF EXISTS "item_id";

ALTER TABLE "Product" ADD COLUMN "item_id" UUID NOT NULL DEFAULT gen_random_uuid();

-- Add primary key constraint back on item_id
ALTER TABLE "Product" ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("item_id");

-- Ensure default on item_id is set
ALTER TABLE "Product" ALTER COLUMN "item_id" SET DEFAULT gen_random_uuid();

-- Re-add foreign key constraint with updated types
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("item_id") ON DELETE CASCADE ON UPDATE CASCADE;
