<?php
declare(strict_types=1);

namespace ContentAI\Http\Controllers;

use ContentAI\Http\Request;
use ContentAI\Http\Response;
use ContentAI\Security\Auth;
use ContentAI\Security\Csrf;
use ContentAI\Services\CompanyService;

final class CompanyController
{
    public function __construct(
        private readonly Auth $auth,
        private readonly CompanyService $companies,
    ) {
    }

    public function show(Request $request): void
    {
        $credentials = $this->auth->credentials();

        Response::json([
            'company' => $this->companies->get($credentials['company_id']),
            'csrf' => Csrf::token(),
        ]);
    }

    public function update(Request $request): void
    {
        $credentials = $this->auth->credentials();
        Csrf::require($request);

        Response::json([
            'company' => $this->companies->save($credentials['company_id'], $request->body()),
            'csrf' => Csrf::token(),
        ]);
    }
}
