<?php

namespace Modules\Admin\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Admin\App\Http\Requests\Api\RequestApiStoreProduct;
use Modules\Admin\App\Models\Product;
use Modules\Admin\App\Models\ProductVariant;
use Modules\Admin\App\Models\VariantAttribute;
use Modules\Common\Query\ProductQueryService;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;

class ApiAdminProductController extends Controller
{
    /**
     * AdmGetListProduct
     */
    public function index(Request $request)
    {
        try {
            $paginator = ProductQueryService::getAll($request);
            $products = $paginator->getCollection();

            $meta = [
                "total"        => $paginator->total(),
                "per_page"     => (int) $paginator->perPage(),
                "current_page" => $paginator->currentPage(),
                "last_page"    => $paginator->lastPage()
            ];

            $data = [
                'meta'     => $meta,
                'products' => $products
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmCreateProduct
     */
    public function store(RequestApiStoreProduct $request): \Illuminate\Http\JsonResponse
    {
        try {
            $product = ProductQueryService::create($request);
            $data = [
                'product' => $product
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmShowCategory
     */
    public function show(Request $request, $id)
    {
        try {
            $product = ProductQueryService::findById($request, $id);
            $data = [
                'product' => $product
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmUpdateProduct
     */
    public function update(RequestApiStoreProduct $request, $id)
    {
        try {
            ProductQueryService::update($request, $id);
            $data = [
                'product' => ProductQueryService::findById($request, $id)
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    public function storeV2(Request $request)
    {
        try{
            // Validate the request
            $request->validate([
                'category_id'                                => 'required|exists:categories,id',
                'name'                                       => 'required|string|max:255',
                'description'                                => 'nullable|string',
                'avatar'                                     => 'nullable|string',
                'variants'                                   => 'required|array',
                'variants.*.price'                           => 'required|numeric',
                'variants.*.stock'                           => 'required|integer',
                'variants.*.attributes'                      => 'required|array',
                'variants.*.attributes.*.attribute_value_id' => 'required|exists:attribute_values,id',
            ]);

            // Create the product
            $product = Product::create([
                'category_id' => $request->category_id,
                'name'        => $request->name,
                'description' => $request->description,
                'avatar'      => $request->avatar,
            ]);

            // Create the variants and variant attributes
            foreach ($request->variants as $variantData) {
                $variant = ProductVariant::create([
                    'product_id' => $product->id,
                    'price'      => $variantData['price'],
                    'stock'      => $variantData['stock'],
                    'image'      => $variantData['image'] ?? null,
                ]);

                foreach ($variantData['attributes'] as $attributeData) {
                    VariantAttribute::create([
                        'variant_id'         => $variant->id,
                        'attribute_value_id' => $attributeData['attribute_value_id'],
                    ]);
                }
            }

            $data = [
                'product' => $product
            ];
            return ResponseService::sendSuccess($data);
        }catch (\Exception $exception){
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    public function showV2(Request $request, $id)
    {
        try {
            $product = Product::with(['variants.variantAttributes.attributeValue', 'variants.variantAttributes.attributeValue.attribute'])
                ->findOrFail($id);
            $data = [
                'product' => $product
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }
}
