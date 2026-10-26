<?php
declare(strict_types=1);

namespace ContentAI\Repositories;

use Throwable;

/**
 * Solicitudes de generación y su primera versión de contenido.
 *
 * La generación actual es simulada: se guarda origin = 'simulated' y el
 * proveedor local-template para no etiquetarla como generada por IA.
 */
final class ContentRepository extends Repository
{
    public function all(int $companyId): array
    {
        $query = $this->db()->prepare(
            'SELECT r.id, r.created_at, r.user_instruction, r.compiled_context_json,
                    v.version_number, v.content_body, v.created_at AS version_created_at
             FROM content_requests r
             JOIN content_versions v ON v.content_request_id = r.id AND v.version_number = 1
             WHERE r.company_id = ? ORDER BY r.created_at DESC, r.id DESC'
        );
        $query->execute([$companyId]);

        return array_map($this->map(...), $query->fetchAll());
    }

    public function find(int $id, int $companyId): ?array
    {
        $query = $this->db()->prepare(
            'SELECT r.id, r.created_at, r.user_instruction, r.compiled_context_json,
                    v.version_number, v.content_body, v.created_at AS version_created_at
             FROM content_requests r
             JOIN content_versions v ON v.content_request_id = r.id AND v.version_number = 1
             WHERE r.id = ? AND r.company_id = ? LIMIT 1'
        );
        $query->execute([$id, $companyId]);
        $row = $query->fetch();

        return $row ? $this->map($row) : null;
    }

    public function socialMediaTypeId(): ?int
    {
        $query = $this->db()->query("SELECT id FROM content_types WHERE slug = 'social_media_post' LIMIT 1");
        $id = $query->fetchColumn();

        return $id === false ? null : (int) $id;
    }

    /**
     * Guarda la solicitud y su primera versión en una sola transacción.
     */
    public function create(
        int $companyId,
        int $userId,
        int $contentTypeId,
        int $productId,
        ?int $audienceId,
        string $goal,
        array $snapshot,
        string $text,
    ): int {
        $db = $this->db();
        $db->beginTransaction();

        try {
            $query = $db->prepare(
                "INSERT INTO content_requests
                   (company_id, user_id, content_type_id, catalog_item_id, target_audience_id,
                    prompt_strategy, user_instruction, compiled_context_json, final_prompt_sent,
                    llm_provider, llm_model, status)
                 VALUES (?, ?, ?, ?, ?, 'contextualized_pyme', ?, ?, ?, 'local-template', 'demo-template-v1', 'completed')"
            );
            $query->execute([
                $companyId,
                $userId,
                $contentTypeId,
                $productId,
                $audienceId,
                $goal,
                json_encode($snapshot, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                'Simulación local determinista. No se envió solicitud a un proveedor de IA.',
            ]);
            $requestId = (int) $db->lastInsertId();

            $query = $db->prepare(
                "INSERT INTO content_versions
                   (content_request_id, version_number, origin, content_body, review_status)
                 VALUES (?, 1, 'simulated', ?, 'generated')"
            );
            $query->execute([$requestId, $text]);

            $db->commit();
        } catch (Throwable $error) {
            $db->rollBack();
            throw $error;
        }

        return $requestId;
    }

    private function map(array $row): array
    {
        $snapshot = json_decode((string) $row['compiled_context_json'], true) ?: [];

        return [
            'id' => (int) $row['id'],
            'createdAt' => $row['created_at'],
            'company' => $snapshot['company'] ?? [],
            'product' => $snapshot['product'] ?? [],
            'goal' => $row['user_instruction'],
            'type' => 'Publicación para redes sociales',
            'text' => $row['content_body'],
            'status' => 'Borrador',
            'versions' => [[
                'number' => (int) $row['version_number'],
                'text' => $row['content_body'],
                'createdAt' => $row['version_created_at'],
                'source' => 'Resultado ilustrativo; no generado por IA',
            ]],
        ];
    }
}
