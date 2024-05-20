-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "deliveryAt" SET DEFAULT NOW() + interval '1 day';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE TEXT;
