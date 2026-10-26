<?php
declare(strict_types=1);

namespace ContentAI\Services;

use ContentAI\Repositories\UserRepository;
use ContentAI\Security\Auth;
use ContentAI\Security\Csrf;
use ContentAI\Security\Session;
use ContentAI\Support\ApiError;

/**
 * Inicio y cierre de sesión y estado inicial del espacio de trabajo.
 */
final class AuthService
{
    public function __construct(
        private readonly UserRepository $users,
        private readonly Auth $auth,
        private readonly CompanyService $companies,
        private readonly ProductService $products,
        private readonly ContentService $contents,
    ) {
    }

    public function credentials(): array
    {
        return $this->auth->credentials();
    }

    public function login(array $input): array
    {
        $email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
        $password = $input['password'] ?? '';

        if (!$email || !is_string($password) || $password === '' || mb_strlen($password) > 200) {
            throw new ApiError(422, 'Revisa el correo y la contraseña.');
        }

        $user = $this->users->findActiveByEmail($email);
        if ($user === null || !password_verify($password, $user['password'])) {
            throw new ApiError(401, 'El correo o la contraseña no son correctos.');
        }

        Session::regenerate();
        Session::replace(['user_id' => (int) $user['id']]);

        return $this->state($this->auth->credentials());
    }

    public function logout(): void
    {
        Session::destroy();
    }

    public function state(array $auth): array
    {
        $companyId = $auth['company_id'];

        return [
            'user' => $auth['user'],
            'state' => [
                'company' => $this->companies->get($companyId),
                'products' => $this->products->list($companyId),
                'contents' => $this->contents->list($companyId),
                'campaigns' => [],
                'channels' => [],
                'observations' => [],
            ],
            'csrf' => Csrf::token(),
        ];
    }
}
