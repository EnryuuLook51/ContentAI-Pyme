<?php
declare(strict_types=1);

namespace ContentAI\Http\Controllers;

use ContentAI\Http\Request;
use ContentAI\Http\Response;
use ContentAI\Security\Csrf;
use ContentAI\Services\AuthService;

final class AuthController
{
    public function __construct(private readonly AuthService $auth)
    {
    }

    public function csrf(Request $request): void
    {
        Response::json(['csrf' => Csrf::token()]);
    }

    public function login(Request $request): void
    {
        Csrf::require($request);
        Response::json($this->auth->login($request->body()));
    }

    public function logout(Request $request): void
    {
        Csrf::require($request);
        $this->auth->logout();
        Response::json(['ok' => true]);
    }

    public function session(Request $request): void
    {
        $auth = $this->auth->credentials();
        Response::json($this->auth->state($auth));
    }
}
