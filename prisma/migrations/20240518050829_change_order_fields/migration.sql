/*
  Warnings:

  - You are about to drop the column `isDelivered` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `isMade` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "isDelivered",
DROP COLUMN "isMade",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Queued',
ALTER COLUMN "deliveryAt" SET DEFAULT NOW() + interval '1 day';
