<?php
declare(strict_types=1);

ini_set('display_errors', '0');
ini_set('log_errors', '1');

final class ApiError extends RuntimeException
{
    public function __construct(public readonly int $status, string $message)
    {
        parent::__construct($message);
    }
}

function respond(array $body, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function requestBody(): array
{
    $decoded = json_decode(file_get_contents('php://input') ?: '', true);
    if (!is_array($decoded)) {
        throw new ApiError(400, 'El cuerpo debe ser un objeto JSON válido.');
    }
    return $decoded;
}

function database(): PDO
{
    static $connection;
    if ($connection instanceof PDO) {
        return $connection;
    }

    $host = getenv('DB_HOST') ?: 'localhost';
    $port = getenv('DB_PORT') ?: '3306';
    $name = getenv('DB_NAME') ?: 'contentai_pyme';
    $user = getenv('DB_USER') ?: 'contentai_app';
    $password = getenv('DB_PASSWORD') ?: '';
    $dsn = "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4";
    $connection = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $connection;
}

function csrfToken(): string
{
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function requireCsrf(): void
{
    $provided = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!is_string($provided) || !hash_equals(csrfToken(), $provided)) {
        throw new ApiError(419, 'La sesión de seguridad expiró. Recarga la página e inténtalo de nuevo.');
    }
}

function authenticatedUser(PDO $db): array
{
    $userId = $_SESSION['user_id'] ?? null;
    if (!is_int($userId) && !ctype_digit((string) $userId)) {
        throw new ApiError(401, 'Inicia sesión para continuar.');
    }
    $query = $db->prepare('SELECT id, name, email FROM users WHERE id = ? AND is_active = 1 LIMIT 1');
    $query->execute([(int) $userId]);
    $user = $query->fetch();
    if (!$user) {
        $_SESSION = [];
        throw new ApiError(401, 'Inicia sesión para continuar.');
    }
    $query = $db->prepare('SELECT id FROM companies WHERE user_id = ? AND is_active = 1 ORDER BY id LIMIT 1');
    $query->execute([(int) $user['id']]);
    $company = $query->fetch();
    if (!$company) {
        throw new ApiError(409, 'La cuenta no tiene una empresa activa asociada.');
    }
    return ['user' => $user, 'company_id' => (int) $company['id']];
}

function requiredText(array $data, string $key, int $maximum): string
{
    $value = $data[$key] ?? null;
    if (!is_string($value)) {
        throw new ApiError(422, "El campo {$key} es obligatorio.");
    }
    $value = trim($value);
    if ($value === '' || mb_strlen($value) > $maximum) {
        throw new ApiError(422, "El campo {$key} debe tener entre 1 y {$maximum} caracteres.");
    }
    return $value;
}

function optionalText(array $data, string $key, int $maximum): string
{
    $value = $data[$key] ?? '';
    if (!is_string($value)) {
        throw new ApiError(422, "El campo {$key} no es válido.");
    }
    $value = trim($value);
    if (mb_strlen($value) > $maximum) {
        throw new ApiError(422, "El campo {$key} supera el máximo de {$maximum} caracteres.");
    }
    return $value;
}

function companyContext(PDO $db, int $companyId): array
{
    $query = $db->prepare(
        'SELECT c.business_name, c.economic_sector, c.business_description,
                b.communication_tone, b.restricted_terms,
                a.id AS audience_id, a.segment_name, a.demographic_profile
         FROM companies c
         LEFT JOIN brand_identities b ON b.company_id = c.id
         LEFT JOIN target_audiences a ON a.company_id = c.id
         WHERE c.id = ? AND c.is_active = 1
         ORDER BY a.id LIMIT 1'
    );
    $query->execute([$companyId]);
    $row = $query->fetch();
    if (!$row) {
        throw new ApiError(404, 'No se encontró el perfil de la empresa.');
    }
    return [
        'company' => [
            'name' => $row['business_name'],
            'activity' => $row['economic_sector'],
            'description' => $row['business_description'],
            'audienceName' => $row['segment_name'] ?? '',
            'audience' => $row['demographic_profile'] ?? '',
            'tone' => $row['communication_tone'] ?? '',
            'restrictions' => $row['restricted_terms'] ?? '',
        ],
        'audience_id' => $row['audience_id'] === null ? null : (int) $row['audience_id'],
        'brand_restrictions' => $row['restricted_terms'] ?? '',
    ];
}

function productFromRow(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'type' => $row['item_type'] === 'product' ? 'Producto' : 'Servicio',
        'name' => $row['name'],
        'description' => $row['description'],
        'features' => $row['features'],
        'benefits' => $row['benefits'],
        'restrictions' => $row['restricted_terms'] ?? '',
    ];
}

function listProducts(PDO $db, int $companyId): array
{
    $query = $db->prepare(
        'SELECT id, item_type, name, description, features, benefits, restricted_terms
         FROM catalog_items WHERE company_id = ? AND is_active = 1 ORDER BY id'
    );
    $query->execute([$companyId]);
    return array_map('productFromRow', $query->fetchAll());
}

function contentFromRow(array $row): array
{
    $snapshot = json_decode((string) $row['compiled_context_json'], true) ?: [];
    $version = [
        'number' => (int) $row['version_number'],
        'text' => $row['content_body'],
        'createdAt' => $row['version_created_at'],
        'source' => 'Resultado ilustrativo; no generado por IA',
    ];
    return [
        'id' => (int) $row['id'],
        'createdAt' => $row['created_at'],
        'company' => $snapshot['company'] ?? [],
        'product' => $snapshot['product'] ?? [],
        'goal' => $row['user_instruction'],
        'type' => 'Publicación para redes sociales',
        'text' => $row['content_body'],
        'status' => 'Borrador',
        'versions' => [$version],
    ];
}

function listContents(PDO $db, int $companyId): array
{
    $query = $db->prepare(
        'SELECT r.id, r.created_at, r.user_instruction, r.compiled_context_json,
                v.version_number, v.content_body, v.created_at AS version_created_at
         FROM content_requests r
         JOIN content_versions v ON v.content_request_id = r.id AND v.version_number = 1
         WHERE r.company_id = ? ORDER BY r.created_at DESC, r.id DESC'
    );
    $query->execute([$companyId]);
    return array_map('contentFromRow', $query->fetchAll());
}

function currentState(PDO $db, array $auth): array
{
    $companyId = $auth['company_id'];
    $company = companyContext($db, $companyId)['company'];
    return [
        'user' => $auth['user'],
        'state' => [
            'company' => $company,
            'products' => listProducts($db, $companyId),
            'contents' => listContents($db, $companyId),
            'campaigns' => [],
            'channels' => [],
            'observations' => [],
        ],
        'csrf' => csrfToken(),
    ];
}

function saveCompany(PDO $db, int $companyId, array $data): array
{
    $name = requiredText($data, 'name', 180);
    $activity = requiredText($data, 'activity', 120);
    $description = optionalText($data, 'description', 10000);
    $audienceName = requiredText($data, 'audienceName', 150);
    $audience = requiredText($data, 'audience', 10000);
    $tone = requiredText($data, 'tone', 120);
    $restrictions = optionalText($data, 'restrictions', 10000);

    $db->beginTransaction();
    try {
        $query = $db->prepare(
            'UPDATE companies
             SET business_name = ?, economic_sector = ?, business_description = ?, value_proposition = ?
             WHERE id = ? AND is_active = 1'
        );
        $summary = $description !== '' ? $description : 'Descripción no especificada por la empresa.';
        $query->execute([$name, $activity, $summary, $summary, $companyId]);

        $query = $db->prepare(
            'INSERT INTO brand_identities
               (company_id, communication_tone, writing_style, brand_values, restricted_terms)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE communication_tone = VALUES(communication_tone),
               writing_style = VALUES(writing_style), restricted_terms = VALUES(restricted_terms)'
        );
        $query->execute([$companyId, $tone, $tone, 'No especificados por la empresa.', $restrictions]);

        $query = $db->prepare('SELECT id FROM target_audiences WHERE company_id = ? ORDER BY id LIMIT 1');
        $query->execute([$companyId]);
        $audienceId = $query->fetchColumn();
        if ($audienceId) {
            $query = $db->prepare(
                'UPDATE target_audiences SET segment_name = ?, demographic_profile = ?, needs_and_pain_points = ?
                 WHERE id = ? AND company_id = ?'
            );
            $query->execute([$audienceName, $audience, $audience, $audienceId, $companyId]);
        } else {
            $query = $db->prepare(
                "INSERT INTO target_audiences
                   (company_id, segment_name, customer_type, demographic_profile, needs_and_pain_points)
                 VALUES (?, ?, 'MIXED', ?, ?)"
            );
            $query->execute([$companyId, $audienceName, $audience, $audience]);
        }
        $db->commit();
    } catch (Throwable $error) {
        $db->rollBack();
        throw $error;
    }
    return companyContext($db, $companyId)['company'];
}

function saveProduct(PDO $db, int $companyId, array $data, ?int $productId = null): array
{
    $type = requiredText($data, 'type', 20);
    if (!in_array($type, ['Producto', 'Servicio'], true)) {
        throw new ApiError(422, 'El tipo debe ser Producto o Servicio.');
    }
    $name = requiredText($data, 'name', 180);
    $description = requiredText($data, 'description', 10000);
    $features = requiredText($data, 'features', 10000);
    $benefits = requiredText($data, 'benefits', 10000);
    $restrictions = optionalText($data, 'restrictions', 10000);
    $context = companyContext($db, $companyId);
    $itemType = $type === 'Producto' ? 'product' : 'service';
    $category = $context['company']['activity'];

    if ($productId !== null) {
        $query = $db->prepare(
            'UPDATE catalog_items SET item_type = ?, name = ?, category = ?, description = ?,
               features = ?, benefits = ?, restricted_terms = ?, target_audience_id = ?
             WHERE id = ? AND company_id = ? AND is_active = 1'
        );
        $query->execute([$itemType, $name, $category, $description, $features, $benefits, $restrictions, $context['audience_id'], $productId, $companyId]);
        if ($query->rowCount() === 0) {
            $check = $db->prepare('SELECT id FROM catalog_items WHERE id = ? AND company_id = ? AND is_active = 1');
            $check->execute([$productId, $companyId]);
            if (!$check->fetchColumn()) {
                throw new ApiError(404, 'No se encontró el producto o servicio.');
            }
        }
        $id = $productId;
    } else {
        $query = $db->prepare(
            'INSERT INTO catalog_items
               (company_id, target_audience_id, item_type, name, category, description, features, benefits, restricted_terms)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $query->execute([$companyId, $context['audience_id'], $itemType, $name, $category, $description, $features, $benefits, $restrictions]);
        $id = (int) $db->lastInsertId();
    }
    $query = $db->prepare(
        'SELECT id, item_type, name, description, features, benefits, restricted_terms
         FROM catalog_items WHERE id = ? AND company_id = ?'
    );
    $query->execute([$id, $companyId]);
    return productFromRow($query->fetch());
}

function createContent(PDO $db, array $auth, array $data): array
{
    $goal = requiredText($data, 'goal', 1000);
    $productId = $data['productId'] ?? null;
    if (!is_int($productId) && !(is_string($productId) && ctype_digit($productId))) {
        throw new ApiError(422, 'Selecciona un producto o servicio válido.');
    }
    $companyId = $auth['company_id'];
    $query = $db->prepare(
        'SELECT id, item_type, name, description, features, benefits, restricted_terms
         FROM catalog_items WHERE id = ? AND company_id = ? AND is_active = 1 LIMIT 1'
    );
    $query->execute([(int) $productId, $companyId]);
    $product = $query->fetch();
    if (!$product) {
        throw new ApiError(404, 'El producto o servicio seleccionado no está disponible.');
    }
    $product = productFromRow($product);
    $context = companyContext($db, $companyId);
    if (!$context['audience_id']) {
        throw new ApiError(409, 'Guarda el público objetivo de la empresa antes de generar.');
    }

    $offer = $product['type'] === 'Producto' ? 'producto' : 'servicio';
    $text = sprintf(
        '¿Buscas %s para %s? En %s ofrecemos %s para %s. Escríbenos para conocer nuestro %s.',
        mb_strtolower($product['name']),
        mb_strtolower($context['company']['audienceName']),
        $context['company']['name'],
        mb_strtolower($product['features']),
        mb_strtolower($product['benefits']),
        $offer
    );
    $snapshot = [
        'template_version' => 'social-post-demo-v1',
        'simulated' => true,
        'company' => $context['company'],
        'product' => $product,
        'audience_id' => $context['audience_id'],
    ];
    $db->beginTransaction();
    try {
        $typeQuery = $db->query("SELECT id FROM content_types WHERE slug = 'social_media_post' LIMIT 1");
        $typeId = $typeQuery->fetchColumn();
        if (!$typeId) {
            throw new ApiError(500, 'No está configurado el tipo de publicación para redes sociales.');
        }
        $query = $db->prepare(
            "INSERT INTO content_requests
               (company_id, user_id, content_type_id, catalog_item_id, target_audience_id,
                prompt_strategy, user_instruction, compiled_context_json, final_prompt_sent,
                llm_provider, llm_model, status)
             VALUES (?, ?, ?, ?, ?, 'contextualized_pyme', ?, ?, ?, 'local-template', 'demo-template-v1', 'completed')"
        );
        $query->execute([
            $companyId,
            (int) $auth['user']['id'],
            (int) $typeId,
            $product['id'],
            $context['audience_id'],
            $goal,
            json_encode($snapshot, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'Simulación local determinista. No se envió solicitud a un proveedor de IA.',
        ]);
        $requestId = (int) $db->lastInsertId();
        $query = $db->prepare(
            "INSERT INTO content_versions
               (content_request_id, version_number, origin, content_body, review_status)
             VALUES (?, 1, 'simulated', ?, 'generated')"
        );
        $query->execute([$requestId, $text]);
        $db->commit();
    } catch (Throwable $error) {
        $db->rollBack();
        throw $error;
    }

    $query = $db->prepare(
        'SELECT r.id, r.created_at, r.user_instruction, r.compiled_context_json,
                v.version_number, v.content_body, v.created_at AS version_created_at
         FROM content_requests r
         JOIN content_versions v ON v.content_request_id = r.id AND v.version_number = 1
         WHERE r.id = ? AND r.company_id = ?'
    );
    $query->execute([$requestId, $companyId]);
    return contentFromRow($query->fetch());
}

$allowedOrigin = getenv('CORS_ORIGIN') ?: 'http://localhost:5173';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !hash_equals($allowedOrigin, $origin)) {
    respond(['error' => 'Origen no permitido.'], 403);
}
if ($origin !== '') {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
}
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => filter_var(getenv('SESSION_SECURE') ?: 'false', FILTER_VALIDATE_BOOLEAN),
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

try {
    if ($method === 'GET' && $path === '/api/v1/health') {
        database()->query('SELECT 1');
        respond(['status' => 'ok', 'database' => 'connected']);
    }
    if ($method === 'GET' && $path === '/api/v1/csrf') {
        respond(['csrf' => csrfToken()]);
    }
    if ($method === 'POST' && $path === '/api/v1/login') {
        requireCsrf();
        $data = requestBody();
        $email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
        $password = $data['password'] ?? '';
        if (!$email || !is_string($password) || $password === '' || mb_strlen($password) > 200) {
            throw new ApiError(422, 'Revisa el correo y la contraseña.');
        }
        $db = database();
        $query = $db->prepare('SELECT id, password FROM users WHERE email = ? AND is_active = 1 LIMIT 1');
        $query->execute([$email]);
        $user = $query->fetch();
        if (!$user || !password_verify($password, $user['password'])) {
            throw new ApiError(401, 'El correo o la contraseña no son correctos.');
        }
        session_regenerate_id(true);
        $_SESSION = ['user_id' => (int) $user['id']];
        respond(currentState($db, authenticatedUser($db)));
    }

    if ($method === 'POST' && $path === '/api/v1/logout') {
        requireCsrf();
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'] ?? '', $params['secure'], $params['httponly']);
        }
        session_destroy();
        respond(['ok' => true]);
    }

    $db = database();
    $auth = authenticatedUser($db);
    $companyId = $auth['company_id'];
    if ($method === 'GET' && $path === '/api/v1/session') {
        respond(currentState($db, $auth));
    }
    if ($method === 'GET' && $path === '/api/v1/company') {
        respond(['company' => companyContext($db, $companyId)['company'], 'csrf' => csrfToken()]);
    }
    if ($method === 'PUT' && $path === '/api/v1/company') {
        requireCsrf();
        respond(['company' => saveCompany($db, $companyId, requestBody()), 'csrf' => csrfToken()]);
    }
    if ($method === 'GET' && $path === '/api/v1/products') {
        respond(['products' => listProducts($db, $companyId), 'csrf' => csrfToken()]);
    }
    if ($method === 'POST' && $path === '/api/v1/products') {
        requireCsrf();
        respond(['product' => saveProduct($db, $companyId, requestBody()), 'csrf' => csrfToken()], 201);
    }
    if ($method === 'POST' && preg_match('#^/api/v1/products/([0-9]+)$#', $path, $match)) {
        requireCsrf();
        respond(['product' => saveProduct($db, $companyId, requestBody(), (int) $match[1]), 'csrf' => csrfToken()]);
    }
    if ($method === 'GET' && $path === '/api/v1/contents') {
        respond(['contents' => listContents($db, $companyId), 'csrf' => csrfToken()]);
    }
    if ($method === 'POST' && $path === '/api/v1/contents') {
        requireCsrf();
        respond(['content' => createContent($db, $auth, requestBody()), 'csrf' => csrfToken()], 201);
    }
    if ($method === 'GET' && preg_match('#^/api/v1/contents/([0-9]+)$#', $path, $match)) {
        foreach (listContents($db, $companyId) as $content) {
            if ($content['id'] === (int) $match[1]) {
                respond(['content' => $content, 'csrf' => csrfToken()]);
            }
        }
        throw new ApiError(404, 'No se encontró el contenido.');
    }
    throw new ApiError(404, 'Ruta de API no encontrada.');
} catch (ApiError $error) {
    respond(['error' => $error->getMessage()], $error->status);
} catch (PDOException $error) {
    error_log('Fallo de base de datos en ContentAI-PYME: ' . $error->getMessage());
    respond(['error' => 'No se pudo completar la operación de base de datos. Revisa la configuración del servidor.'], 503);
} catch (Throwable $error) {
    error_log('Fallo inesperado en ContentAI-PYME: ' . $error->getMessage());
    respond(['error' => 'Ocurrió un error interno. Inténtalo de nuevo.'], 500);
}
