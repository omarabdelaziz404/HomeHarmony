/*
  Warnings:

  - You are about to drop the column `depth` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "depth",
DROP COLUMN "height",
DROP COLUMN "width";
