<?php
declare(strict_types=1);

namespace ContentAI\Http;

/**
 * Respuestas JSON del prototipo.
 */
final class Response
{
    public static function json(array $body, int $status = 200): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function empty(int $status): never
    {
        http_response_code($status);
        exit;
    }
}
