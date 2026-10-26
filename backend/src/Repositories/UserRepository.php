<?php
declare(strict_types=1);

namespace ContentAI\Repositories;

/**
 * Consultas de usuarios y de su empresa activa.
 */
final class UserRepository extends Repository
{
    public function findActiveById(int $id): ?array
    {
        $query = $this->db()->prepare(
            'SELECT id, name, email FROM users WHERE id = ? AND is_active = 1 LIMIT 1'
        );
        $query->execute([$id]);
        $user = $query->fetch();

        return $user ?: null;
    }

    public function findActiveByEmail(string $email): ?array
    {
        $query = $this->db()->prepare(
            'SELECT id, password FROM users WHERE email = ? AND is_active = 1 LIMIT 1'
        );
        $query->execute([$email]);
        $user = $query->fetch();

        return $user ?: null;
    }

    public function activeCompanyId(int $userId): ?int
    {
        $query = $this->db()->prepare(
            'SELECT id FROM companies WHERE user_id = ? AND is_active = 1 ORDER BY id LIMIT 1'
        );
        $query->execute([$userId]);
        $companyId = $query->fetchColumn();

        return $companyId === false ? null : (int) $companyId;
    }
}
