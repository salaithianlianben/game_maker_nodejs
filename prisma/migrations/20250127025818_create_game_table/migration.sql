-- CreateTable
CREATE TABLE `game` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `game_provider_id` INTEGER NOT NULL,
    `game_category_id` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `image_path` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `game_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `game` ADD CONSTRAINT `game_game_provider_id_fkey` FOREIGN KEY (`game_provider_id`) REFERENCES `game_provider`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game` ADD CONSTRAINT `game_game_category_id_fkey` FOREIGN KEY (`game_category_id`) REFERENCES `game_category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
