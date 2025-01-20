/*
  Warnings:

  - You are about to drop the column `applicant_id` on the `payment_request` table. All the data in the column will be lost.
  - You are about to drop the column `beneficiary_id` on the `payment_request` table. All the data in the column will be lost.
  - Added the required column `request_by` to the `payment_request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `request_to` to the `payment_request` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `payment_request` DROP FOREIGN KEY `payment_request_applicant_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment_request` DROP FOREIGN KEY `payment_request_beneficiary_id_fkey`;

-- DropIndex
DROP INDEX `payment_request_applicant_id_fkey` ON `payment_request`;

-- DropIndex
DROP INDEX `payment_request_beneficiary_id_fkey` ON `payment_request`;

-- AlterTable
ALTER TABLE `payment_request` DROP COLUMN `applicant_id`,
    DROP COLUMN `beneficiary_id`,
    ADD COLUMN `request_by` INTEGER NOT NULL,
    ADD COLUMN `request_to` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `payment_request` ADD CONSTRAINT `payment_request_request_by_fkey` FOREIGN KEY (`request_by`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_request` ADD CONSTRAINT `payment_request_request_to_fkey` FOREIGN KEY (`request_to`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
