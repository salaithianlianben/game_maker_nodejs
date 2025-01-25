/*
  Warnings:

  - You are about to drop the column `order_number` on the `game_provider` table. All the data in the column will be lost.
  - Added the required column `order_number` to the `game_category_provider_relation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `game_category_provider_relation` ADD COLUMN `order_number` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `game_provider` DROP COLUMN `order_number`;
