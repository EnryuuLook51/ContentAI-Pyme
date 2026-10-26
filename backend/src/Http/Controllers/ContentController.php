<?php
declare(strict_types=1);

namespace ContentAI\Http\Controllers;

use ContentAI\Http\Request;
use ContentAI\Http\Response;
use ContentAI\Security\Auth;
use ContentAI\Security\Csrf;
use ContentAI\Services\ContentService;

final class ContentController
{
    public function __construct(
        private readonly Auth $auth,
        private readonly ContentService $contents,
    ) {
    }

    public function index(Request $request): void
    {
        $credentials = $this->auth->credentials();

        Response::json([
            'contents' => $this->contents->list($credentials['company_id']),
            'csrf' => Csrf::token(),
        ]);
    }

    public function create(Request $request): void
    {
        $credentials = $this->auth->credentials();
        Csrf::require($request);

        Response::json([
            'content' => $this->contents->generate($credentials, $request->body()),
            'csrf' => Csrf::token(),
        ], 201);
    }

    public function show(Request $request, string $id): void
    {
        $credentials = $this->auth->credentials();

        Response::json([
            'content' => $this->contents->find((int) $id, $credentials['company_id']),
            'csrf' => Csrf::token(),
        ]);
    }
}
