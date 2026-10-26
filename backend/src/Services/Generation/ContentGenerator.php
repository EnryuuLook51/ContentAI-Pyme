<?php
declare(strict_types=1);

namespace ContentAI\Services\Generation;

/**
 * Contrato del generador de contenido. Permite cambiar la plantilla simulada
 * por un proveedor real sin tocar el servicio que persiste el resultado.
 */
interface ContentGenerator
{
    /**
     * @param array{name: string, activity: string, description: string, audienceName: string, audience: string, tone: string, restrictions: string} $company
     * @param array{id: int, type: string, name: string, description: string, features: string, benefits: string, restrictions: string} $product
     *
     * @return array{text: string, templateVersion: string, simulated: bool}
     */
    public function generate(array $company, array $product, string $goal): array;
}
