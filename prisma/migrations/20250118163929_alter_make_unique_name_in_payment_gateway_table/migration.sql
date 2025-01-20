/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `payment_gateway` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `payment_gateway_name_key` ON `payment_gateway`(`name`);
