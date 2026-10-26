<?php
declare(strict_types=1);

namespace ContentAI\Http;

use ContentAI\Support\ApiError;

/**
 * CORS con lista blanca de un solo origen.
 */
final class Cors
{
    public function __construct(private readonly string $allowedOrigin)
    {
    }

    public static function fromEnvironment(): self
    {
        return new self(getenv('CORS_ORIGIN') ?: 'http://localhost:5173');
    }

    public function apply(string $origin): void
    {
        if ($origin !== '' && !hash_equals($this->allowedOrigin, $origin)) {
            throw new ApiError(403, 'Origen no permitido.');
        }

        if ($origin !== '') {
            header("Access-Control-Allow-Origin: {$origin}");
            header('Access-Control-Allow-Credentials: true');
            header('Vary: Origin');
        }
        header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
        header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
    }
}
