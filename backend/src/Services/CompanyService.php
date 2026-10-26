<?php
declare(strict_types=1);

namespace ContentAI\Services;

use ContentAI\Repositories\CompanyRepository;
use ContentAI\Support\Validator;

/**
 * Perfil de la empresa, identidad de marca y público objetivo.
 */
final class CompanyService
{
    public function __construct(private readonly CompanyRepository $companies)
    {
    }

    /**
     * @return array{company: array<string, string>, audience_id: ?int}
     */
    public function context(int $companyId): array
    {
        return $this->companies->context($companyId);
    }

    public function get(int $companyId): array
    {
        return $this->context($companyId)['company'];
    }

    public function save(int $companyId, array $input): array
    {
        $this->companies->saveProfile($companyId, [
            'name' => Validator::requiredText($input, 'name', 180),
            'activity' => Validator::requiredText($input, 'activity', 120),
            'description' => Validator::optionalText($input, 'description', 10000),
            'audienceName' => Validator::requiredText($input, 'audienceName', 150),
            'audience' => Validator::requiredText($input, 'audience', 10000),
            'tone' => Validator::requiredText($input, 'tone', 120),
            'restrictions' => Validator::optionalText($input, 'restrictions', 10000),
        ]);

        return $this->get($companyId);
    }
}
