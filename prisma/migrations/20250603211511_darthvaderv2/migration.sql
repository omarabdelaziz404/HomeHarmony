/*
  Warnings:

  - The primary key for the `OrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- AlterTable
ALTER TABLE "OrderItem" DROP CONSTRAINT "orderitems_orderId_productId_pk",
ALTER COLUMN "productId" SET DATA TYPE TEXT,
ADD CONSTRAINT "orderitems_orderId_productId_pk" PRIMARY KEY ("orderId", "productId");

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
ALTER COLUMN "item_id" DROP DEFAULT,
ALTER COLUMN "item_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("item_id");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("item_id") ON DELETE CASCADE ON UPDATE CASCADE;
