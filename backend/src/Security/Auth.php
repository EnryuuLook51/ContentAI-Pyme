<?php
declare(strict_types=1);

namespace ContentAI\Security;

use ContentAI\Repositories\UserRepository;
use ContentAI\Support\ApiError;

/**
 * Autoriza la petición actual y resuelve la empresa desde el usuario
 * autenticado; nunca desde un identificador enviado por el cliente.
 */
final class Auth
{
    public function __construct(private readonly UserRepository $users)
    {
    }

    /**
     * @return array{user: array{id: int, name: string, email: string}, company_id: int}
     */
    public function credentials(): array
    {
        $userId = Session::get('user_id');
        if (!is_int($userId) && !ctype_digit((string) $userId)) {
            throw new ApiError(401, 'Inicia sesión para continuar.');
        }

        $user = $this->users->findActiveById((int) $userId);
        if ($user === null) {
            Session::clear();
            throw new ApiError(401, 'Inicia sesión para continuar.');
        }

        $companyId = $this->users->activeCompanyId((int) $user['id']);
        if ($companyId === null) {
            throw new ApiError(409, 'La cuenta no tiene una empresa activa asociada.');
        }

        return ['user' => $user, 'company_id' => $companyId];
    }
}
