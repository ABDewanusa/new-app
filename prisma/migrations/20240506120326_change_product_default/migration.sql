/*
  Warnings:

  - Made the column `product_name` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gramPerUnit` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `unitPerPack` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "deliveryAt" SET DEFAULT NOW() + interval '1 day';

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "product_name" SET NOT NULL,
ALTER COLUMN "product_name" SET DEFAULT '',
ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "type" SET DEFAULT '',
ALTER COLUMN "gramPerUnit" SET NOT NULL,
ALTER COLUMN "gramPerUnit" SET DEFAULT 0,
ALTER COLUMN "unitPerPack" SET NOT NULL,
ALTER COLUMN "unitPerPack" SET DEFAULT 0;
