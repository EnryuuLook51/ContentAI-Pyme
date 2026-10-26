<?php
declare(strict_types=1);

namespace ContentAI\Http;

use ContentAI\Support\ApiError;

/**
 * Datos de la petición HTTP actual (método, ruta, cabeceras y cuerpo JSON).
 */
final class Request
{
    private ?array $body = null;

    private function __construct(
        private readonly string $method,
        private readonly string $path,
        private readonly string $origin,
        private readonly array $server,
    ) {
    }

    public static function fromGlobals(): self
    {
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

        return new self(
            strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET'),
            $path,
            (string) ($_SERVER['HTTP_ORIGIN'] ?? ''),
            $_SERVER,
        );
    }

    public function method(): string
    {
        return $this->method;
    }

    public function path(): string
    {
        return $this->path;
    }

    public function origin(): string
    {
        return $this->origin;
    }

    public function header(string $name): string
    {
        $key = 'HTTP_' . strtoupper(str_replace('-', '_', $name));

        return (string) ($this->server[$key] ?? '');
    }

    public function body(): array
    {
        if ($this->body !== null) {
            return $this->body;
        }

        $decoded = json_decode(file_get_contents('php://input') ?: '', true);
        if (!is_array($decoded)) {
            throw new ApiError(400, 'El cuerpo debe ser un objeto JSON válido.');
        }

        return $this->body = $decoded;
    }
}
