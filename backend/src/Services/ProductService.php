<?php
declare(strict_types=1);

namespace ContentAI\Services;

use ContentAI\Repositories\ProductRepository;
use ContentAI\Support\ApiError;
use ContentAI\Support\Validator;

/**
 * Catálogo de productos y servicios.
 */
final class ProductService
{
    public function __construct(
        private readonly ProductRepository $products,
        private readonly CompanyService $companies,
    ) {
    }

    public function list(int $companyId): array
    {
        return $this->products->all($companyId);
    }

    /**
     * Producto autorizado para generar contenido.
     */
    public function forGeneration(int $productId, int $companyId): array
    {
        $product = $this->products->findActive($productId, $companyId);
        if ($product === null) {
            throw new ApiError(404, 'El producto o servicio seleccionado no está disponible.');
        }

        return $product;
    }

    public function save(int $companyId, array $input, ?int $productId = null): array
    {
        $type = Validator::requiredText($input, 'type', 20);
        if (!in_array($type, ['Producto', 'Servicio'], true)) {
            throw new ApiError(422, 'El tipo debe ser Producto o Servicio.');
        }

        $product = [
            'item_type' => $type === 'Producto' ? 'product' : 'service',
            'name' => Validator::requiredText($input, 'name', 180),
            'category' => '',
            'description' => Validator::requiredText($input, 'description', 10000),
            'features' => Validator::requiredText($input, 'features', 10000),
            'benefits' => Validator::requiredText($input, 'benefits', 10000),
            'restrictions' => Validator::optionalText($input, 'restrictions', 10000),
        ];

        $context = $this->companies->context($companyId);
        $product['category'] = $context['company']['activity'];

        return $this->products->save($companyId, $context['audience_id'], $product, $productId);
    }
}
