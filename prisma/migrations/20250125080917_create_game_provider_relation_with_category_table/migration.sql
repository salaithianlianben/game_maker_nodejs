-- CreateTable
CREATE TABLE `game_provider` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `order_number` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `game_provider_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_category_provider_relation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `game_provider_id` INTEGER NOT NULL,
    `game_category_id` INTEGER NOT NULL,
    `image_path` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `game_category_provider_relation` ADD CONSTRAINT `game_category_provider_relation_game_provider_id_fkey` FOREIGN KEY (`game_provider_id`) REFERENCES `game_provider`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_category_provider_relation` ADD CONSTRAINT `game_category_provider_relation_game_category_id_fkey` FOREIGN KEY (`game_category_id`) REFERENCES `game_category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
