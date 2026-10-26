<?php
declare(strict_types=1);

// Autoload propio del prototipo: no usa Composer ni dependencias externas.
// Mapea el prefijo ContentAI\ al directorio src/.
spl_autoload_register(static function (string $class): void {
    $prefix = 'ContentAI\\';
    if (!str_starts_with($class, $prefix)) {
        return;
    }

    $relative = substr($class, strlen($prefix));
    $file = __DIR__ . '/' . str_replace('\\', '/', $relative) . '.php';
    if (is_file($file)) {
        require_once $file;
    }
});
