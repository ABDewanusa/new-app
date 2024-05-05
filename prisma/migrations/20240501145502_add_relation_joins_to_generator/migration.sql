/*
  Warnings:

  - A unique constraint covering the columns `[customer_name]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "customers_customer_name_key" ON "customers"("customer_name");
