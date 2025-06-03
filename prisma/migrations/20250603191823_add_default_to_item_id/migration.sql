-- AlterTable
ALTER TABLE "Product" ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("item_id");

-- DropIndex
DROP INDEX "Product_item_id_key";

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("item_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Product" ALTER COLUMN "item_id" SET DEFAULT gen_random_uuid();
