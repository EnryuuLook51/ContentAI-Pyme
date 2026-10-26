<?php
declare(strict_types=1);

use ContentAI\App;
use ContentAI\Http\Response;
use ContentAI\Support\ApiError;

ini_set('display_errors', '0');
ini_set('log_errors', '1');

require __DIR__ . '/../src/bootstrap.php';

try {
    (new App())->run();
} catch (ApiError $error) {
    Response::json(['error' => $error->getMessage()], $error->status);
} catch (PDOException $error) {
    error_log('Fallo de base de datos en ContentAI-PYME: ' . $error->getMessage());
    Response::json(['error' => 'No se pudo completar la operación de base de datos. Revisa la configuración del servidor.'], 503);
} catch (Throwable $error) {
    error_log('Fallo inesperado en ContentAI-PYME: ' . $error->getMessage());
    Response::json(['error' => 'Ocurrió un error interno. Inténtalo de nuevo.'], 500);
}
