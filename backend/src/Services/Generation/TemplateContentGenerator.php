<?php
declare(strict_types=1);

namespace ContentAI\Services\Generation;

/**
 * Generador local determinista del prototipo. No llama a ningún proveedor
 * de IA: solo compone una publicación con el contexto autorizado.
 */
final class TemplateContentGenerator implements ContentGenerator
{
    public const TEMPLATE_VERSION = 'social-post-demo-v1';

    public function generate(array $company, array $product, string $goal): array
    {
        $offer = $product['type'] === 'Producto' ? 'producto' : 'servicio';
        $text = sprintf(
            '¿Buscas %s para %s? En %s ofrecemos %s para %s. Escríbenos para conocer nuestro %s.',
            mb_strtolower($product['name']),
            mb_strtolower($company['audienceName']),
            $company['name'],
            mb_strtolower($product['features']),
            mb_strtolower($product['benefits']),
            $offer,
        );

        return [
            'text' => $text,
            'templateVersion' => self::TEMPLATE_VERSION,
            'simulated' => true,
        ];
    }
}
