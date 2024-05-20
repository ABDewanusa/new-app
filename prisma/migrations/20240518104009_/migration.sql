-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "deliveryAt" SET DEFAULT NOW() + interval '1 day';
