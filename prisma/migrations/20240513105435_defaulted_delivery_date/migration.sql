/*
  Warnings:

  - Made the column `deliveryAt` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "deliveryAt" SET NOT NULL,
ALTER COLUMN "deliveryAt" SET DEFAULT NOW() + interval '1 day';
