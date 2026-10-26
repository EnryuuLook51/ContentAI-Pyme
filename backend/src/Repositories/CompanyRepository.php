<?php
declare(strict_types=1);

namespace ContentAI\Repositories;

use ContentAI\Support\ApiError;
use Throwable;

/**
 * Perfil de la empresa, identidad de marca y público objetivo.
 */
final class CompanyRepository extends Repository
{
    /**
     * @return array{company: array<string, string>, audience_id: ?int}
     */
    public function context(int $companyId): array
    {
        $query = $this->db()->prepare(
            'SELECT c.business_name, c.economic_sector, c.business_description,
                    b.communication_tone, b.restricted_terms,
                    a.id AS audience_id, a.segment_name, a.demographic_profile
             FROM companies c
             LEFT JOIN brand_identities b ON b.company_id = c.id
             LEFT JOIN target_audiences a ON a.company_id = c.id
             WHERE c.id = ? AND c.is_active = 1
             ORDER BY a.id LIMIT 1'
        );
        $query->execute([$companyId]);
        $row = $query->fetch();
        if (!$row) {
            throw new ApiError(404, 'No se encontró el perfil de la empresa.');
        }

        return [
            'company' => [
                'name' => $row['business_name'],
                'activity' => $row['economic_sector'],
                'description' => $row['business_description'],
                'audienceName' => $row['segment_name'] ?? '',
                'audience' => $row['demographic_profile'] ?? '',
                'tone' => $row['communication_tone'] ?? '',
                'restrictions' => $row['restricted_terms'] ?? '',
            ],
            'audience_id' => $row['audience_id'] === null ? null : (int) $row['audience_id'],
        ];
    }

    /**
     * @param array{name: string, activity: string, description: string, audienceName: string, audience: string, tone: string, restrictions: string} $profile
     */
    public function saveProfile(int $companyId, array $profile): void
    {
        $db = $this->db();
        $db->beginTransaction();

        try {
            $summary = $profile['description'] !== ''
                ? $profile['description']
                : 'Descripción no especificada por la empresa.';

            $query = $db->prepare(
                'UPDATE companies
                 SET business_name = ?, economic_sector = ?, business_description = ?, value_proposition = ?
                 WHERE id = ? AND is_active = 1'
            );
            $query->execute([
                $profile['name'],
                $profile['activity'],
                $summary,
                $summary,
                $companyId,
            ]);

            $query = $db->prepare(
                'INSERT INTO brand_identities
                   (company_id, communication_tone, writing_style, brand_values, restricted_terms)
                 VALUES (?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE communication_tone = VALUES(communication_tone),
                   writing_style = VALUES(writing_style), restricted_terms = VALUES(restricted_terms)'
            );
            $query->execute([
                $companyId,
                $profile['tone'],
                $profile['tone'],
                'No especificados por la empresa.',
                $profile['restrictions'],
            ]);

            $query = $db->prepare('SELECT id FROM target_audiences WHERE company_id = ? ORDER BY id LIMIT 1');
            $query->execute([$companyId]);
            $audienceId = $query->fetchColumn();

            if ($audienceId) {
                $query = $db->prepare(
                    'UPDATE target_audiences
                     SET segment_name = ?, demographic_profile = ?, needs_and_pain_points = ?
                     WHERE id = ? AND company_id = ?'
                );
                $query->execute([
                    $profile['audienceName'],
                    $profile['audience'],
                    $profile['audience'],
                    $audienceId,
                    $companyId,
                ]);
            } else {
                $query = $db->prepare(
                    "INSERT INTO target_audiences
                       (company_id, segment_name, customer_type, demographic_profile, needs_and_pain_points)
                     VALUES (?, ?, 'MIXED', ?, ?)"
                );
                $query->execute([
                    $companyId,
                    $profile['audienceName'],
                    $profile['audience'],
                    $profile['audience'],
                ]);
            }

            $db->commit();
        } catch (Throwable $error) {
            $db->rollBack();
            throw $error;
        }
    }
}
