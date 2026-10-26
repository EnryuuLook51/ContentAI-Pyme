<?php
declare(strict_types=1);

namespace ContentAI;

use ContentAI\Http\Controllers\AuthController;
use ContentAI\Http\Controllers\CompanyController;
use ContentAI\Http\Controllers\ContentController;
use ContentAI\Http\Controllers\HealthController;
use ContentAI\Http\Controllers\ProductController;
use ContentAI\Http\Cors;
use ContentAI\Http\Request;
use ContentAI\Http\Response;
use ContentAI\Http\Router;
use ContentAI\Repositories\CompanyRepository;
use ContentAI\Repositories\ContentRepository;
use ContentAI\Repositories\ProductRepository;
use ContentAI\Repositories\UserRepository;
use ContentAI\Security\Auth;
use ContentAI\Security\Session;
use ContentAI\Services\AuthService;
use ContentAI\Services\CompanyService;
use ContentAI\Services\ContentService;
use ContentAI\Services\Generation\TemplateContentGenerator;
use ContentAI\Services\ProductService;
use ContentAI\Support\ApiError;
use ContentAI\Support\Database;

/**
 * Punto de entrada: CORS, sesión, dependencias y rutas de la API.
 */
final class App
{
    public function run(): void
    {
        $request = Request::fromGlobals();

        Cors::fromEnvironment()->apply($request->origin());
        if ($request->method() === 'OPTIONS') {
            Response::empty(204);
        }

        Session::start();

        $database = Database::fromEnvironment();
        $users = new UserRepository($database);
        $companies = new CompanyService(new CompanyRepository($database));
        $products = new ProductService(new ProductRepository($database), $companies);
        $contents = new ContentService(
            new ContentRepository($database),
            $products,
            $companies,
            new TemplateContentGenerator(),
        );
        $auth = new Auth($users);
        $authService = new AuthService($users, $auth, $companies, $products, $contents);

        $authController = new AuthController($authService);
        $companyController = new CompanyController($auth, $companies);
        $productController = new ProductController($auth, $products);
        $contentController = new ContentController($auth, $contents);

        $router = new Router();
        $router->get('/api/v1/health', new HealthController($database));
        $router->get('/api/v1/csrf', [$authController, 'csrf']);
        $router->post('/api/v1/login', [$authController, 'login']);
        $router->post('/api/v1/logout', [$authController, 'logout']);
        $router->get('/api/v1/session', [$authController, 'session']);
        $router->get('/api/v1/company', [$companyController, 'show']);
        $router->put('/api/v1/company', [$companyController, 'update']);
        $router->get('/api/v1/products', [$productController, 'index']);
        $router->post('/api/v1/products', [$productController, 'create']);
        $router->post('/api/v1/products/{id}', [$productController, 'update']);
        $router->get('/api/v1/contents', [$contentController, 'index']);
        $router->post('/api/v1/contents', [$contentController, 'create']);
        $router->get('/api/v1/contents/{id}', [$contentController, 'show']);

        // Cualquier otra ruta exige sesión, igual que las rutas de negocio.
        $router->fallback(static function (Request $request) use ($auth): void {
            $auth->credentials();
            throw new ApiError(404, 'Ruta de API no encontrada.');
        });

        $router->dispatch($request);
    }
}
