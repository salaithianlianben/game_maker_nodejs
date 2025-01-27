/*
  Warnings:

  - Added the required column `order_number` to the `game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `game` ADD COLUMN `order_number` INTEGER NOT NULL;
