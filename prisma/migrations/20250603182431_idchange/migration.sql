/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[item_id]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- Step 1: Drop the foreign key from OrderItem
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";
-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "Product_item_id_key" ON "Product"("item_id");
