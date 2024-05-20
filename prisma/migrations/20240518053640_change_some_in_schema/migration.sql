/*
  Warnings:

  - You are about to drop the column `status` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `role` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `customer_name` on table `customers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `orderId` on table `orderproducts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productId` on table `orderproducts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity` on table `orderproducts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "orderproducts" DROP CONSTRAINT "orderproducts_orderId_fkey";

-- DropForeignKey
ALTER TABLE "orderproducts" DROP CONSTRAINT "orderproducts_productId_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_authorId_fkey";

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "role" SET NOT NULL;

-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "customer_name" SET NOT NULL;

-- AlterTable
ALTER TABLE "orderproducts" ALTER COLUMN "orderId" SET NOT NULL,
ALTER COLUMN "productId" SET NOT NULL,
ALTER COLUMN "quantity" SET NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "status",
ADD COLUMN     "orderStatusId" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "deliveryAt" SET DEFAULT NOW() + interval '1 day';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;

-- DropTable
DROP TABLE "posts";

-- CreateTable
CREATE TABLE "OrderStatus" (
    "id" SERIAL NOT NULL,
    "status" VARCHAR(100) NOT NULL,

    CONSTRAINT "OrderStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orderproducts" ADD CONSTRAINT "orderproducts_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderproducts" ADD CONSTRAINT "orderproducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_orderStatusId_fkey" FOREIGN KEY ("orderStatusId") REFERENCES "OrderStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
