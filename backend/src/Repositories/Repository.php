<?php
declare(strict_types=1);

namespace ContentAI\Repositories;

use ContentAI\Support\Database;
use PDO;

/**
 * Base de los repositorios: obtiene la conexión PDO cuando se necesita.
 */
abstract class Repository
{
    public function __construct(protected readonly Database $database)
    {
    }

    protected function db(): PDO
    {
        return $this->database->connection();
    }
}
