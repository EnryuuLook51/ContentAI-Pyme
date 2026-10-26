<?php
declare(strict_types=1);

namespace ContentAI\Http\Controllers;

use ContentAI\Http\Request;
use ContentAI\Http\Response;
use ContentAI\Support\Database;

final class HealthController
{
    public function __construct(private readonly Database $database)
    {
    }

    public function __invoke(Request $request): void
    {
        $this->database->connection()->query('SELECT 1');
        Response::json(['status' => 'ok', 'database' => 'connected']);
    }
}
