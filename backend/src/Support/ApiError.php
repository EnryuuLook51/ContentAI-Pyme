<?php
declare(strict_types=1);

namespace ContentAI\Support;

use RuntimeException;

/**
 * Error de negocio o de validación con un código HTTP asociado.
 */
final class ApiError extends RuntimeException
{
    public function __construct(public readonly int $status, string $message)
    {
        parent::__construct($message);
    }
}
