-- DropForeignKey
ALTER TABLE `payment_request` DROP FOREIGN KEY `payment_request_agent_payment_account_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment_request` DROP FOREIGN KEY `payment_request_applicant_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment_request` DROP FOREIGN KEY `payment_request_beneficiary_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment_request` DROP FOREIGN KEY `payment_request_payment_gateway_id_fkey`;

-- DropForeignKey
ALTER TABLE `transaction_history` DROP FOREIGN KEY `transaction_history_payment_request_id_fkey`;

-- DropForeignKey
ALTER TABLE `transaction_history` DROP FOREIGN KEY `transaction_history_receiver_id_fkey`;

-- DropForeignKey
ALTER TABLE `transaction_history` DROP FOREIGN KEY `transaction_history_sender_id_fkey`;

-- DropIndex
DROP INDEX `payment_request_agent_payment_account_id_fkey` ON `payment_request`;

-- DropIndex
DROP INDEX `payment_request_applicant_id_fkey` ON `payment_request`;

-- DropIndex
DROP INDEX `payment_request_beneficiary_id_fkey` ON `payment_request`;

-- DropIndex
DROP INDEX `payment_request_payment_gateway_id_fkey` ON `payment_request`;

-- DropIndex
DROP INDEX `transaction_history_payment_request_id_fkey` ON `transaction_history`;

-- DropIndex
DROP INDEX `transaction_history_receiver_id_fkey` ON `transaction_history`;

-- DropIndex
DROP INDEX `transaction_history_sender_id_fkey` ON `transaction_history`;

-- AddForeignKey
ALTER TABLE `payment_request` ADD CONSTRAINT `payment_request_applicant_id_fkey` FOREIGN KEY (`applicant_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_request` ADD CONSTRAINT `payment_request_beneficiary_id_fkey` FOREIGN KEY (`beneficiary_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_request` ADD CONSTRAINT `payment_request_agent_payment_account_id_fkey` FOREIGN KEY (`agent_payment_account_id`) REFERENCES `agent_payment_account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_request` ADD CONSTRAINT `payment_request_payment_gateway_id_fkey` FOREIGN KEY (`payment_gateway_id`) REFERENCES `payment_gateway`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_history` ADD CONSTRAINT `transaction_history_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_history` ADD CONSTRAINT `transaction_history_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_history` ADD CONSTRAINT `transaction_history_payment_request_id_fkey` FOREIGN KEY (`payment_request_id`) REFERENCES `payment_request`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
