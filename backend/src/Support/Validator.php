<?php
declare(strict_types=1);

namespace ContentAI\Support;

/**
 * Validación de los campos que llegan en el cuerpo JSON.
 */
final class Validator
{
    public static function requiredText(array $data, string $key, int $maximum): string
    {
        $value = $data[$key] ?? null;
        if (!is_string($value)) {
            throw new ApiError(422, "El campo {$key} es obligatorio.");
        }

        $value = trim($value);
        if ($value === '' || mb_strlen($value) > $maximum) {
            throw new ApiError(422, "El campo {$key} debe tener entre 1 y {$maximum} caracteres.");
        }

        return $value;
    }

    public static function optionalText(array $data, string $key, int $maximum): string
    {
        $value = $data[$key] ?? '';
        if (!is_string($value)) {
            throw new ApiError(422, "El campo {$key} no es válido.");
        }

        $value = trim($value);
        if (mb_strlen($value) > $maximum) {
            throw new ApiError(422, "El campo {$key} supera el máximo de {$maximum} caracteres.");
        }

        return $value;
    }

    public static function requiredId(array $data, string $key, string $message): int
    {
        $value = $data[$key] ?? null;
        if (is_int($value)) {
            return $value;
        }
        if (is_string($value) && ctype_digit($value)) {
            return (int) $value;
        }

        throw new ApiError(422, $message);
    }
}
