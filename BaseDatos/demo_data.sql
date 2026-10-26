USE `contentai_pyme`;

INSERT INTO `users` (`role_id`, `name`, `email`, `password`, `is_active`)
VALUES (
  (SELECT `id` FROM `roles` WHERE `slug` = 'pyme_manager'),
  'Cuenta de demostración',
  'demo@contentai-pyme.local',
  '$2y$12$oN/5gkKkNzDrCDtFGvcNQeVgBEKFwIdvdHAx3YP06qHpwve9cJXQW',
  1
)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `is_active` = 1;

SET @demo_user_id = (SELECT `id` FROM `users` WHERE `email` = 'demo@contentai-pyme.local');

INSERT INTO `companies` (
  `user_id`, `business_name`, `economic_sector`, `business_description`,
  `value_proposition`, `location`, `is_active`
)
SELECT
  @demo_user_id,
  'TecnoBarrio',
  'Mantenimiento de computadoras',
  'Negocio ficticio de mantenimiento de computadoras para pequeños comercios de la zona.',
  'Limpieza interna y revisión básica para ayudar a prevenir fallas por acumulación de polvo.',
  'Datos de ejemplo',
  1
WHERE NOT EXISTS (SELECT 1 FROM `companies` WHERE `user_id` = @demo_user_id);

SET @demo_company_id = (SELECT `id` FROM `companies` WHERE `user_id` = @demo_user_id ORDER BY `id` LIMIT 1);

INSERT INTO `brand_identities` (
  `company_id`, `communication_tone`, `writing_style`, `brand_values`, `restricted_terms`
)
VALUES (
  @demo_company_id,
  'Cercano y profesional',
  'Claro y coherente con el tono de comunicación',
  'Servicio responsable y comunicación clara (datos ficticios)',
  'No prometer que el equipo nunca fallará'
)
ON DUPLICATE KEY UPDATE
  `communication_tone` = VALUES(`communication_tone`),
  `writing_style` = VALUES(`writing_style`),
  `brand_values` = VALUES(`brand_values`),
  `restricted_terms` = VALUES(`restricted_terms`);

INSERT INTO `target_audiences` (
  `company_id`, `segment_name`, `customer_type`, `demographic_profile`,
  `needs_and_pain_points`
)
SELECT
  @demo_company_id,
  'Pequeños negocios de la zona',
  'B2B',
  'Pequeños comercios locales (datos ficticios)',
  'Buscan mantener sus computadoras con limpieza interna y revisión básica (datos ficticios)'
WHERE NOT EXISTS (SELECT 1 FROM `target_audiences` WHERE `company_id` = @demo_company_id);

SET @demo_audience_id = (
  SELECT `id` FROM `target_audiences`
  WHERE `company_id` = @demo_company_id ORDER BY `id` LIMIT 1
);

INSERT INTO `catalog_items` (
  `company_id`, `target_audience_id`, `item_type`, `name`, `category`,
  `description`, `features`, `benefits`, `restricted_terms`, `is_active`
)
SELECT
  @demo_company_id,
  @demo_audience_id,
  'service',
  'Mantenimiento preventivo de computadoras',
  'Mantenimiento de computadoras',
  'Mantenimiento preventivo para las computadoras de tu negocio.',
  'Limpieza interna y revisión básica',
  'Ayudar a prevenir fallas por acumulación de polvo',
  'No prometer que el equipo nunca fallará',
  1
WHERE NOT EXISTS (
  SELECT 1 FROM `catalog_items`
  WHERE `company_id` = @demo_company_id
    AND `name` = 'Mantenimiento preventivo de computadoras'
);
