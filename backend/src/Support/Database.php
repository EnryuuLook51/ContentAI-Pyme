<?php
declare(strict_types=1);

namespace ContentAI\Support;

use PDO;

/**
 * Conexión PDO única. Se abre en el primer uso para que las rutas que no
 * consultan MySQL (por ejemplo /csrf) funcionen sin base de datos.
 */
final class Database
{
    private ?PDO $connection = null;

    private function __construct(
        private readonly string $dsn,
        private readonly string $user,
        private readonly string $password,
    ) {
    }

    public static function fromEnvironment(): self
    {
        $host = getenv('DB_HOST') ?: 'localhost';
        $port = getenv('DB_PORT') ?: '3306';
        $name = getenv('DB_NAME') ?: 'contentai_pyme';

        return new self(
            "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4",
            getenv('DB_USER') ?: 'contentai_app',
            getenv('DB_PASSWORD') ?: '',
        );
    }

    public function connection(): PDO
    {
        if ($this->connection instanceof PDO) {
            return $this->connection;
        }

        $this->connection = new PDO($this->dsn, $this->user, $this->password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);

        return $this->connection;
    }
}
