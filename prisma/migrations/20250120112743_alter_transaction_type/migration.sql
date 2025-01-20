-- AlterTable
ALTER TABLE `payment_request` MODIFY `type` ENUM('DEPOSIT', 'WITHDRAW', 'TRANSFER') NOT NULL;

-- AlterTable
ALTER TABLE `transaction_history` MODIFY `type` ENUM('DEPOSIT', 'WITHDRAW', 'TRANSFER') NOT NULL;
