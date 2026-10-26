USE `contentai_pyme`;

ALTER TABLE `catalog_items`
  ADD COLUMN `description` TEXT NULL COMMENT 'Descripción comercial del producto o servicio',
  ADD COLUMN `restricted_terms` TEXT NULL COMMENT 'Afirmaciones o promesas que deben evitarse';

UPDATE `catalog_items` SET `description` = '' WHERE `description` IS NULL;

ALTER TABLE `catalog_items`
  MODIFY COLUMN `description` TEXT NOT NULL COMMENT 'Descripción comercial del producto o servicio';

ALTER TABLE `content_versions`
  MODIFY COLUMN `origin` ENUM('ai_generated', 'user_edited', 'simulated') NOT NULL DEFAULT 'ai_generated';
