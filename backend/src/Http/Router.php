<?php
declare(strict_types=1);

namespace ContentAI\Http;

use ContentAI\Support\ApiError;

/**
 * Enrutador mínimo: relaciona método + ruta con un controlador.
 * Los segmentos variables solo admiten identificadores numéricos.
 */
final class Router
{
    /** @var array<int, array{method: string, regex: string, handler: callable}> */
    private array $routes = [];

    private mixed $fallback = null;

    public function get(string $pattern, callable $handler): void
    {
        $this->add('GET', $pattern, $handler);
    }

    public function post(string $pattern, callable $handler): void
    {
        $this->add('POST', $pattern, $handler);
    }

    public function put(string $pattern, callable $handler): void
    {
        $this->add('PUT', $pattern, $handler);
    }

    public function fallback(callable $handler): void
    {
        $this->fallback = $handler;
    }

    public function dispatch(Request $request): void
    {
        foreach ($this->routes as $route) {
            if ($route['method'] !== $request->method()) {
                continue;
            }
            if (preg_match($route['regex'], $request->path(), $matches) === 1) {
                ($route['handler'])($request, ...array_slice($matches, 1));
                return;
            }
        }

        if (is_callable($this->fallback)) {
            ($this->fallback)($request);
            return;
        }

        throw new ApiError(404, 'Ruta de API no encontrada.');
    }

    private function add(string $method, string $pattern, callable $handler): void
    {
        $regex = '#^' . preg_replace('#\{[a-zA-Z_]+\}#', '([0-9]+)', $pattern) . '$#';

        $this->routes[] = [
            'method' => $method,
            'regex' => $regex,
            'handler' => $handler,
        ];
    }
}
