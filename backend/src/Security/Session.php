<?php
declare(strict_types=1);

namespace ContentAI\Security;

/**
 * Envoltorio de la sesión PHP (cookie, regeneración y cierre).
 */
final class Session
{
    public static function start(): void
    {
        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'secure' => filter_var(getenv('SESSION_SECURE') ?: 'false', FILTER_VALIDATE_BOOLEAN),
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
        session_start();
    }

    public static function get(string $key): mixed
    {
        return $_SESSION[$key] ?? null;
    }

    public static function replace(array $values): void
    {
        $_SESSION = $values;
    }

    public static function clear(): void
    {
        $_SESSION = [];
    }

    public static function regenerate(): void
    {
        session_regenerate_id(true);
    }

    public static function destroy(): void
    {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'] ?? '',
                $params['secure'],
                $params['httponly'],
            );
        }
        session_destroy();
    }
}
