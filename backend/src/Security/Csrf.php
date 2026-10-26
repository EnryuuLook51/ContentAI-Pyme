<?php
declare(strict_types=1);

namespace ContentAI\Security;

use ContentAI\Http\Request;
use ContentAI\Support\ApiError;

/**
 * Token CSRF de la sesión. El cliente lo envía en X-CSRF-Token.
 */
final class Csrf
{
    public static function token(): string
    {
        $token = Session::get('csrf_token');
        if (!is_string($token) || $token === '') {
            $token = bin2hex(random_bytes(32));
            $_SESSION['csrf_token'] = $token;
        }

        return $token;
    }

    public static function require(Request $request): void
    {
        $provided = $request->header('X-CSRF-Token');
        if (!hash_equals(self::token(), $provided)) {
            throw new ApiError(419, 'La sesión de seguridad expiró. Recarga la página e inténtalo de nuevo.');
        }
    }
}
