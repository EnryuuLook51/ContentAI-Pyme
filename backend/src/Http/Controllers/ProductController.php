<?php
declare(strict_types=1);

namespace ContentAI\Http\Controllers;

use ContentAI\Http\Request;
use ContentAI\Http\Response;
use ContentAI\Security\Auth;
use ContentAI\Security\Csrf;
use ContentAI\Services\ProductService;

final class ProductController
{
    public function __construct(
        private readonly Auth $auth,
        private readonly ProductService $products,
    ) {
    }

    public function index(Request $request): void
    {
        $credentials = $this->auth->credentials();

        Response::json([
            'products' => $this->products->list($credentials['company_id']),
            'csrf' => Csrf::token(),
        ]);
    }

    public function create(Request $request): void
    {
        $credentials = $this->auth->credentials();
        Csrf::require($request);

        Response::json([
            'product' => $this->products->save($credentials['company_id'], $request->body()),
            'csrf' => Csrf::token(),
        ], 201);
    }

    public function update(Request $request, string $id): void
    {
        $credentials = $this->auth->credentials();
        Csrf::require($request);

        Response::json([
            'product' => $this->products->save($credentials['company_id'], $request->body(), (int) $id),
            'csrf' => Csrf::token(),
        ]);
    }
}
