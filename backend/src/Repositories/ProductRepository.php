<?php
declare(strict_types=1);

namespace ContentAI\Repositories;

use ContentAI\Support\ApiError;

/**
 * Catálogo de productos y servicios de la empresa.
 */
final class ProductRepository extends Repository
{
    public function all(int $companyId): array
    {
        $query = $this->db()->prepare(
            'SELECT id, item_type, name, description, features, benefits, restricted_terms
             FROM catalog_items WHERE company_id = ? AND is_active = 1 ORDER BY id'
        );
        $query->execute([$companyId]);

        return array_map($this->map(...), $query->fetchAll());
    }

    public function findActive(int $id, int $companyId): ?array
    {
        $query = $this->db()->prepare(
            'SELECT id, item_type, name, description, features, benefits, restricted_terms
             FROM catalog_items WHERE id = ? AND company_id = ? AND is_active = 1 LIMIT 1'
        );
        $query->execute([$id, $companyId]);
        $row = $query->fetch();

        return $row ? $this->map($row) : null;
    }

    /**
     * Crea o actualiza un producto o servicio y devuelve su representación pública.
     *
     * @param array{item_type: string, name: string, category: string, description: string, features: string, benefits: string, restrictions: string} $product
     */
    public function save(int $companyId, ?int $audienceId, array $product, ?int $productId = null): array
    {
        $db = $this->db();

        if ($productId !== null) {
            $query = $db->prepare(
                'UPDATE catalog_items SET item_type = ?, name = ?, category = ?, description = ?,
                   features = ?, benefits = ?, restricted_terms = ?, target_audience_id = ?
                 WHERE id = ? AND company_id = ? AND is_active = 1'
            );
            $query->execute([
                $product['item_type'],
                $product['name'],
                $product['category'],
                $product['description'],
                $product['features'],
                $product['benefits'],
                $product['restrictions'],
                $audienceId,
                $productId,
                $companyId,
            ]);

            if ($query->rowCount() === 0 && $this->findActive($productId, $companyId) === null) {
                throw new ApiError(404, 'No se encontró el producto o servicio.');
            }

            $id = $productId;
        } else {
            $query = $db->prepare(
                'INSERT INTO catalog_items
                   (company_id, target_audience_id, item_type, name, category, description, features, benefits, restricted_terms)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $query->execute([
                $companyId,
                $audienceId,
                $product['item_type'],
                $product['name'],
                $product['category'],
                $product['description'],
                $product['features'],
                $product['benefits'],
                $product['restrictions'],
            ]);
            $id = (int) $db->lastInsertId();
        }

        $query = $db->prepare(
            'SELECT id, item_type, name, description, features, benefits, restricted_terms
             FROM catalog_items WHERE id = ? AND company_id = ?'
        );
        $query->execute([$id, $companyId]);
        $row = $query->fetch();
        if (!$row) {
            throw new ApiError(404, 'No se encontró el producto o servicio.');
        }

        return $this->map($row);
    }

    private function map(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'type' => $row['item_type'] === 'product' ? 'Producto' : 'Servicio',
            'name' => $row['name'],
            'description' => $row['description'],
            'features' => $row['features'],
            'benefits' => $row['benefits'],
            'restrictions' => $row['restricted_terms'] ?? '',
        ];
    }
}
