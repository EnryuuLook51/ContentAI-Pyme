SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `contentai_pyme`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `contentai_pyme`;

-- -------------------------------------------------------------------------------------
-- 1. TABLA: roles (Control de acceso basado en roles - RBAC)
-- Modelo Eloquent: App\Models\Role
-- -------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(50) NOT NULL COMMENT 'Identificador técnico: admin, pyme_manager, content_creator, evaluator',
  `name` VARCHAR(100) NOT NULL COMMENT 'Nombre visible del rol',
  `description` VARCHAR(255) NULL COMMENT 'Alcance de permisos del rol en la plataforma',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_roles_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------------------
-- 2. TABLA: users (Usuarios autenticados del sistema)
-- Modelo Eloquent: App\Models\User
-- -------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt/argon2 gestionado por Laravel Auth',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `remember_token` VARCHAR(100) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  KEY `idx_users_role_id` (`role_id`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------------------
-- 3. TABLA: companies (Perfil digital del negocio / PYME)
-- Modelo Eloquent: App\Models\Company
-- -------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `companies`;
CREATE TABLE `companies` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'Usuario propietario o gestor principal de la PYME',
  `business_name` VARCHAR(180) NOT NULL COMMENT 'Razón social o nombre comercial de la PYME',
  `tax_id` VARCHAR(20) NULL COMMENT 'RUC o identificador tributario opcional',
  `economic_sector` VARCHAR(120) NOT NULL COMMENT 'Actividad económica (ej. Agroindustria, Soporte TI, Comercio)',
  `business_description` TEXT NOT NULL COMMENT 'Resumen del giro de negocio, historia y actividad principal',
  `value_proposition` TEXT NOT NULL COMMENT 'Propuesta de valor y diferenciadores frente a la competencia',
  `location` VARCHAR(150) NULL COMMENT 'Ciudad / Región de operación',
  `website_url` VARCHAR(255) NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_companies_user_id` (`user_id`),
  KEY `idx_companies_sector` (`economic_sector`),
  CONSTRAINT `fk_companies_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------------------
-- 4. TABLA: brand_identities (Identidad de marca y tono de comunicación de la PYME)
-- Modelo Eloquent: App\Models\BrandIdentity
-- -------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `brand_identities`;
CREATE TABLE `brand_identities` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id` BIGINT UNSIGNED NOT NULL,
  `communication_tone` VARCHAR(120) NOT NULL COMMENT 'Ej. Cercano y técnico, Profesional y confiable, Joven y dinámico',
  `writing_style` VARCHAR(150) NOT NULL COMMENT 'Ej. Persuasivo orientado a beneficios, Educativo claro, Directo',
  `brand_values` TEXT NOT NULL COMMENT 'Valores centrales de la marca (ej. Sostenibilidad, Puntualidad, Innovación)',
  `key_terms` TEXT NULL COMMENT 'Palabras clave o expresiones propias de la marca a priorizar',
  `restricted_terms` TEXT NULL COMMENT 'Palabras o promesas que el modelo de IA debe evitar',
  `default_cta_style` VARCHAR(200) NULL COMMENT 'Estilo habitual de llamada a la acción (ej. Contacto por WhatsApp)',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_brand_company` (`company_id`),
  CONSTRAINT `fk_brand_identities_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------------------
-- 5. TABLA: target_audiences (Público objetivo y perfiles de clientes de la PYME)
-- Modelo Eloquent: App\Models\TargetAudience
-- -------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `target_audiences`;
CREATE TABLE `target_audiences` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id` BIGINT UNSIGNED NOT NULL,
  `segment_name` VARCHAR(150) NOT NULL COMMENT 'Nombre del segmento (ej. Productores agrícolas de costa, Estudiantes universitarios)',
  `customer_type` ENUM('B2C', 'B2B', 'B2G', 'MIXED') NOT NULL DEFAULT 'B2C',
  `demographic_profile` TEXT NOT NULL COMMENT 'Rango de edad, ubicación, ocupación o tamaño de empresa cliente',
  `needs_and_pain_points` TEXT NOT NULL COMMENT 'Necesidades principales y problemas que busca resolver el cliente',
  `buying_motivations` TEXT NULL COMMENT 'Factores decisivos de compra (precio, garantía, rapidez, asesoría)',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_audiences_company` (`company_id`),
  CONSTRAINT `fk_target_audiences_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------------------
-- 6. TABLA: catalog_items (Registro de Productos y Servicios de la PYME)
-- Modelo Eloquent: App\Models\CatalogItem
-- -------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `catalog_items`;
CREATE TABLE `catalog_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id` BIGINT UNSIGNED NOT NULL,
  `target_audience_id` BIGINT UNSIGNED NULL COMMENT 'Segmento principal al que se dirige este producto o servicio',
  `item_type` ENUM('product', 'service') NOT NULL COMMENT 'Distingue entre Producto físico/digital o Servicio',
  `name` VARCHAR(180) NOT NULL COMMENT 'Ej. Fertilizante Orgánico Foliar / Mantenimiento preventivo de computadoras',
  `category` VARCHAR(120) NOT NULL COMMENT 'Categoría comercial dentro de la PYME',
  `description` TEXT NOT NULL COMMENT 'Descripción comercial del producto o servicio',
  `features` TEXT NOT NULL COMMENT 'Características técnicas, componentes o alcance del servicio',
  `benefits` TEXT NOT NULL COMMENT 'Beneficios tangibles para el cliente final',
  `restricted_terms` TEXT NULL COMMENT 'Afirmaciones o promesas que deben evitarse',
  `price_reference` VARCHAR(100) NULL COMMENT 'Precio referencial, rango o modalidad de cotización',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_catalog_company_type` (`company_id`, `item_type`),
  KEY `idx_catalog_audience` (`target_audience_id`),
  CONSTRAINT `fk_catalog_items_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_catalog_items_audience` FOREIGN KEY (`target_audience_id`) REFERENCES `target_audiences` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------------------
-- 7. TABLA: communication_channels (Canales de comunicación donde publica la PYME)
-- Modelo Eloquent: App\Models\CommunicationChannel
-- -------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `communication_channels`;
CREATE TABLE `communication_channels` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL COMMENT 'Ej. instagram, facebook, linkedin, whatsapp_business, email, web_landing',
  `name` VARCHAR(100) NOT NULL,
  `max_length_chars` INT UNSIGNED NULL COMMENT 'Longitud máxima sugerida en caracteres para el canal',
  `formatting_guidelines` TEXT NULL COMMENT 'Reglas de estructura (uso de hashtags, párrafos cortos, asunto de correo)',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_channels_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------------------
-- 8. TABLA: campaigns (Campañas comerciales de la PYME)
-- Modelo Eloquent: App\Models\Campaign
-- -------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `campaigns`;
CREATE TABLE `campaigns` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id` BIGINT UNSIGNED NOT NULL,
  `target_audience_id` BIGINT UNSIGNED NULL,
  `communication_channel_id` BIGINT UNSIGNED NULL,
  `name` VARCHAR(180) NOT NULL COMMENT 'Nombre de la campaña comercial',
  `objective` VARCHAR(255) NOT NULL COMMENT 'Objetivo comercial (captación de leads, lanzamiento, fidelización, promoción)',
  `key_message` TEXT NOT NULL COMMENT 'Mensaje central o promesa principal de la campaña',
  `start_date` DATE NULL,
  `end_date` DATE NULL,
  `status` ENUM('draft', 'active', 'completed', 'archived') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_campaigns_company_status` (`company_id`, `status`),
  KEY `idx_campaigns_audience` (`target_audience_id`),
  KEY `idx_campaigns_channel` (`communication_channel_id`),
  CONSTRAINT `fk_campaigns_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_campaigns_audience` FOREIGN KEY (`target_audience_id`) REFERENCES `target_audiences` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_campaigns_channel` FOREIGN KEY (`communication_channel_id`) REFERENCES `communication_channels` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------------------
-- 9. TABLA: content_types (Catálogo de los 11 tipos de contenido comercial requeridos)
-- Modelo Eloquent: App\Models\ContentType
-- -------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `content_types`;
CREATE TABLE `content_types` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(60) NOT NULL COMMENT 'Identificador técnico del tipo de contenido',
  `name` VARCHAR(120) NOT NULL COMMENT 'Nombre oficial según especificación del Grupo 07',
  `description` VARCHAR(255) NOT NULL,
  `expected_structure` TEXT NOT NULL COMMENT 'Estructura esperada (ej. Título + Cuerpo + Beneficios + Llamada a la acción)',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_content_types_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------------------
-- 10. TABLA: content_requests (Solicitudes de generación y registro experimental IA)
-- Modelo Eloquent: App\Models\ContentRequest
-- -------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `content_requests`;
CREATE TABLE `content_requests` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `company_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'Usuario que solicita la generación',
  `content_type_id` BIGINT UNSIGNED NOT NULL,
  `catalog_item_id` BIGINT UNSIGNED NULL COMMENT 'Producto o servicio promocionado (opcional)',
  `campaign_id` BIGINT UNSIGNED NULL COMMENT 'Campaña comercial asociada (opcional)',
  `target_audience_id` BIGINT UNSIGNED NULL COMMENT 'Público objetivo específico (opcional)',
  `communication_channel_id` BIGINT UNSIGNED NULL COMMENT 'Canal destino (opcional)',
  `experiment_case_code` VARCHAR(50) NULL COMMENT 'Código de caso del dataset experimental para reproducibilidad',
  `prompt_strategy` ENUM('baseline_generic', 'contextualized_pyme') NOT NULL DEFAULT 'contextualized_pyme' COMMENT 'Enfoque comparado: Línea base (genérico) vs Contextualizado con perfil PYME',
  `user_instruction` TEXT NOT NULL COMMENT 'Instrucción original escrita por el usuario',
  `compiled_context_json` JSON NULL COMMENT 'Snapshot exacto del contexto empresarial inyectado al momento de generar',
  `final_prompt_sent` LONGTEXT NOT NULL COMMENT 'Prompt completo enviado al servicio externo de IA (reproducibilidad)',
  `llm_provider` VARCHAR(60) NOT NULL DEFAULT 'openai_compatible' COMMENT 'Proveedor de API REST de IA utilizado',
  `llm_model` VARCHAR(80) NOT NULL COMMENT 'Nombre exacto del modelo de lenguaje invocado',
  `temperature` DECIMAL(3,2) NOT NULL DEFAULT 0.70,
  `response_time_ms` INT UNSIGNED NULL COMMENT 'Tiempo de respuesta de la API externa en milisegundos',
  `prompt_tokens` INT UNSIGNED NULL COMMENT 'Tokens de entrada consumidos',
  `completion_tokens` INT UNSIGNED NULL COMMENT 'Tokens de salida generados',
  `status` ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'completed',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_requests_company_strategy` (`company_id`, `prompt_strategy`),
  KEY `idx_requests_case_code` (`experiment_case_code`),
  KEY `idx_requests_content_type` (`content_type_id`),
  KEY `idx_requests_catalog_item` (`catalog_item_id`),
  KEY `idx_requests_campaign` (`campaign_id`),
  CONSTRAINT `fk_requests_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_requests_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_requests_content_type` FOREIGN KEY (`content_type_id`) REFERENCES `content_types` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_requests_catalog_item` FOREIGN KEY (`catalog_item_id`) REFERENCES `catalog_items` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_requests_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_requests_audience` FOREIGN KEY (`target_audience_id`) REFERENCES `target_audiences` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_requests_channel` FOREIGN KEY (`communication_channel_id`) REFERENCES `communication_channels` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------------------
-- 11. TABLA: content_versions (Versiones generadas, revisadas, modificadas, aprobadas o descartadas)
-- Modelo Eloquent: App\Models\ContentVersion
-- -------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `content_versions`;
CREATE TABLE `content_versions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `content_request_id` BIGINT UNSIGNED NOT NULL,
  `version_number` INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '1 = Generación inicial de IA; >=2 = Revisiones o regeneraciones',
  `origin` ENUM('ai_generated', 'user_edited', 'simulated') NOT NULL DEFAULT 'ai_generated',
  `generated_title` VARCHAR(255) NULL COMMENT 'Título o encabezado comercial propuesto',
  `content_body` LONGTEXT NOT NULL COMMENT 'Cuerpo principal del contenido comercial',
  `call_to_action` VARCHAR(255) NULL COMMENT 'Llamada a la acción (CTA) específica',
  `hashtags_or_keywords` VARCHAR(255) NULL COMMENT 'Etiquetas o palabras clave sugeridas',
  `review_status` ENUM('generated', 'under_review', 'modified', 'approved', 'discarded') NOT NULL DEFAULT 'generated' COMMENT 'Estado del flujo de revisión exigido por el proyecto',
  `edit_distance_ratio` DECIMAL(5,4) NULL DEFAULT 0.0000 COMMENT 'Proporción de edición respecto a la versión original de IA (0.0000 a 1.0000)',
  `reviewed_by` BIGINT UNSIGNED NULL COMMENT 'Usuario que revisó, modificó, aprobó o descartó la versión',
  `review_notes` TEXT NULL COMMENT 'Observaciones del usuario al modificar, aprobar o descartar',
  `reviewed_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_request_version` (`content_request_id`, `version_number`),
  KEY `idx_versions_status` (`review_status`),
  KEY `idx_versions_reviewer` (`reviewed_by`),
  CONSTRAINT `fk_versions_request` FOREIGN KEY (`content_request_id`) REFERENCES `content_requests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_versions_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------------------
-- 12. TABLA: content_evaluations (Evaluación de resultados y métricas de investigación)
-- Modelo Eloquent: App\Models\ContentEvaluation
-- -------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `content_evaluations`;
CREATE TABLE `content_evaluations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `content_version_id` BIGINT UNSIGNED NOT NULL,
  `evaluator_user_id` BIGINT UNSIGNED NOT NULL,
  `brand_alignment_score` TINYINT UNSIGNED NOT NULL COMMENT 'Escala 1-5: Coherencia con identidad y tono de marca de la PYME',
  `audience_relevance_score` TINYINT UNSIGNED NOT NULL COMMENT 'Escala 1-5: Adecuación al público objetivo y sus necesidades',
  `commercial_clarity_score` TINYINT UNSIGNED NOT NULL COMMENT 'Escala 1-5: Claridad de beneficios del producto/servicio y persuasión',
  `cta_effectiveness_score` TINYINT UNSIGNED NOT NULL COMMENT 'Escala 1-5: Fuerza y pertinencia del llamado a la acción',
  `overall_score` DECIMAL(3,2) NOT NULL COMMENT 'Promedio ponderado de calidad del contenido (1.00 a 5.00)',
  `requires_manual_correction` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 = Requirió corrección humana antes de publicarse; 0 = Aprobado directo',
  `perceived_utility` ENUM('useful', 'partially_useful', 'not_useful') NOT NULL DEFAULT 'useful',
  `qualitative_feedback` TEXT NULL COMMENT 'Comentarios del evaluador sobre aciertos o alucinaciones del modelo',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_evaluations_version` (`content_version_id`),
  KEY `idx_evaluations_evaluator` (`evaluator_user_id`),
  CONSTRAINT `fk_evaluations_version` FOREIGN KEY (`content_version_id`) REFERENCES `content_versions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_evaluations_user` FOREIGN KEY (`evaluator_user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------------------
-- 13. TABLA: audit_logs (Historial y auditoría de operaciones de la aplicación)
-- Modelo Eloquent: App\Models\AuditLog
-- -------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NULL,
  `action` VARCHAR(80) NOT NULL COMMENT 'Ej. CREATE_COMPANY, GENERATE_AI_CONTENT, APPROVE_VERSION, DISCARD_VERSION',
  `entity_type` VARCHAR(80) NOT NULL COMMENT 'Nombre de la entidad o modelo Eloquent afectado',
  `entity_id` BIGINT UNSIGNED NULL COMMENT 'ID del registro afectado',
  `ip_address` VARCHAR(45) NULL,
  `details_json` JSON NULL COMMENT 'Metadatos anteriores y nuevos de la operación',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_audit_user_action` (`user_id`, `action`),
  KEY `idx_audit_entity` (`entity_type`, `entity_id`),
  CONSTRAINT `fk_audit_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================================
-- DATOS SEMILLA (SEEDERS INICIALES) ALINEADOS AL ENUNCIADO DEL GRUPO 07
-- =====================================================================================

INSERT INTO `roles` (`id`, `slug`, `name`, `description`) VALUES
(1, 'admin', 'Administrador', 'Gestión global de usuarios, roles, catálogos maestros, parámetros de IA y auditoría.'),
(2, 'pyme_manager', 'Gestor PYME', 'Administración del perfil digital de la empresa, productos, servicios, campañas y aprobación de contenido.'),
(3, 'content_creator', 'Creador de Contenido', 'Generación asistida por IA, edición y versionamiento de piezas comerciales.'),
(4, 'evaluator', 'Evaluador / Investigador', 'Evaluación comparativa entre prompts genéricos y contextualizados para el componente de investigación.');

INSERT INTO `communication_channels` (`id`, `code`, `name`, `max_length_chars`, `formatting_guidelines`) VALUES
(1, 'instagram', 'Instagram (Feed / Reels Copy)', 2200, 'Gancho inicial en primera línea, beneficios en viñetas breves, llamado a la acción y 5 a 8 hashtags relevantes.'),
(2, 'facebook', 'Facebook Comercial', 1500, 'Tono conversacional y cercano, enfoque en beneficios prácticos, enlace o contacto directo por mensaje.'),
(3, 'linkedin', 'LinkedIn Corporativo / B2B', 3000, 'Tono profesional y consultivo, énfasis en propuesta de valor, eficiencia y resultados empresariales.'),
(4, 'whatsapp_business', 'WhatsApp Business / Difusión', 600, 'Mensaje breve, directo, personalizado, con oferta clara y respuesta rápida.'),
(5, 'email_marketing', 'Correo Comercial (Email)', 4000, 'Línea de asunto atractiva, saludo personalizado, problema, solución, propuesta de valor y CTA único.'),
(6, 'web_landing', 'Página Web / Landing Page', 5000, 'Estructura jerárquica con H1 persuasivo, subtítulo de propuesta de valor, bloques de beneficios, prueba social y CTA.');

INSERT INTO `content_types` (`id`, `slug`, `name`, `description`, `expected_structure`) VALUES
(1, 'social_media_post', 'Publicaciones para redes sociales', 'Piezas dinámicas para redes sociales adaptadas al canal y público objetivo.', 'Título/Gancho + Cuerpo persuasivo + Llamado a la acción + Hashtags'),
(2, 'product_description', 'Descripciones de productos', 'Fichas comerciales orientadas a destacar características técnicas y beneficios del producto.', 'Nombre comercial + Resumen atractivo + Características + Beneficios clave + CTA'),
(3, 'service_description', 'Descripciones de servicios', 'Presentación detallada de servicios profesionales o técnicos ofrecidos por la PYME.', 'Título del servicio + Problema que resuelve + Alcance/Metodología + Beneficios + CTA'),
(4, 'ad_copy', 'Anuncios publicitarios', 'Textos cortos de alta conversión para pauta digital en buscadores o redes sociales.', 'Titular principal + Texto primario + Descripción corta + Botón CTA'),
(5, 'commercial_email', 'Correos comerciales', 'Secuencias o correos de prospección, promoción y fidelización de clientes.', 'Asunto + Preheader + Saludo + Cuerpo comercial + Cierre con CTA'),
(6, 'blog_article', 'Artículos', 'Contenido informativo o educativo de valor vinculado al giro de negocio de la PYME.', 'Título SEO + Introducción + Subtemas desarrollados + Conclusión + CTA comercial'),
(7, 'promotional_message', 'Mensajes promocionales', 'Textos breves para ofertas de temporada, descuentos o lanzamientos.', 'Encabezado de oferta + Beneficio/Descuento + Vigencia + Llamada a la acción'),
(8, 'website_copy', 'Textos para páginas web', 'Secciones institucionales (Quiénes somos, Propuesta de valor, Servicios) para el sitio web.', 'Encabezado de sección + Párrafo de propuesta de valor + Bloques secundarios'),
(9, 'landing_page', 'Landing pages', 'Estructura completa de página de aterrizaje enfocada en conversión de leads o ventas.', 'Hero Title + Subtítulo + Problema + Solución/Beneficios + Garantía + Formulario/CTA'),
(10, 'call_to_action', 'Llamados a la acción', 'Variaciones de cierres persuasivos (CTA) según etapa de compra y canal.', 'Lista de llamadas a la acción directas orientadas a clic, contacto o compra'),
(11, 'campaign_ideas', 'Ideas para campañas', 'Propuestas estratégicas de campañas comerciales alineadas a los productos/servicios de la PYME.', 'Concepto creativo + Objetivo + Público meta + Canales sugeridos + Piezas clave');

SET FOREIGN_KEY_CHECKS = 1;