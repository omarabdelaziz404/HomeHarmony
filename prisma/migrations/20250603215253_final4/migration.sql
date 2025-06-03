/*
  Warnings:

  - You are about to drop the column `designer` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `other_colors` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sellable_online` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "designer",
DROP COLUMN "link",
DROP COLUMN "other_colors",
DROP COLUMN "sellable_online";
