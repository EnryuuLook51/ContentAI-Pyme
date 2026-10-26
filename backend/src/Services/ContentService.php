<?php
declare(strict_types=1);

namespace ContentAI\Services;

use ContentAI\Repositories\ContentRepository;
use ContentAI\Support\ApiError;
use ContentAI\Support\Validator;
use ContentAI\Services\Generation\ContentGenerator;

/**
 * Solicitudes de generación de contenido.
 */
final class ContentService
{
    public function __construct(
        private readonly ContentRepository $contents,
        private readonly ProductService $products,
        private readonly CompanyService $companies,
        private readonly ContentGenerator $generator,
    ) {
    }

    public function list(int $companyId): array
    {
        return $this->contents->all($companyId);
    }

    public function find(int $id, int $companyId): array
    {
        $content = $this->contents->find($id, $companyId);
        if ($content === null) {
            throw new ApiError(404, 'No se encontró el contenido.');
        }

        return $content;
    }

    /**
     * Genera (plantilla simulada), persiste la solicitud y devuelve la
     * publicación recién guardada.
     *
     * @param array{user: array{id: int, name: string, email: string}, company_id: int} $auth
     */
    public function generate(array $auth, array $input): array
    {
        $companyId = $auth['company_id'];
        $goal = Validator::requiredText($input, 'goal', 1000);
        $productId = Validator::requiredId($input, 'productId', 'Selecciona un producto o servicio válido.');

        $product = $this->products->forGeneration($productId, $companyId);
        $context = $this->companies->context($companyId);
        if ($context['audience_id'] === null) {
            throw new ApiError(409, 'Guarda el público objetivo de la empresa antes de generar.');
        }

        $contentTypeId = $this->contents->socialMediaTypeId();
        if ($contentTypeId === null) {
            throw new ApiError(500, 'No está configurado el tipo de publicación para redes sociales.');
        }

        $generated = $this->generator->generate($context['company'], $product, $goal);
        $snapshot = [
            'template_version' => $generated['templateVersion'],
            'simulated' => $generated['simulated'],
            'company' => $context['company'],
            'product' => $product,
            'audience_id' => $context['audience_id'],
        ];

        $requestId = $this->contents->create(
            $companyId,
            (int) $auth['user']['id'],
            $contentTypeId,
            $product['id'],
            $context['audience_id'],
            $goal,
            $snapshot,
            $generated['text'],
        );

        return $this->find($requestId, $companyId);
    }
}
