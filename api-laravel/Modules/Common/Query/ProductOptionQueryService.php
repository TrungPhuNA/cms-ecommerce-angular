<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 9/29/24
 */

namespace Modules\Common\Query;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Modules\Admin\App\Models\Attribute;
use Modules\Admin\App\Models\ProductOption;
use Modules\Admin\App\Models\ProductOptionValue;
use Modules\Common\Base\ModelService;

class ProductOptionQueryService extends ModelService
{
    public static function getAll(Request $request, $items = null)
    {
        $items = ProductOption::with("productOptionValue");
        return parent::getAll($request, $items);
    }

    public static function create(Request $request)
    {
        DB::beginTransaction();
        $dataInput = $request->all();
        $dataInput["slug"] = Str::slug($request->name);
        $productOption = ProductOption::create($dataInput);
        if ($productOption) {
            if ($request->option_value && !empty($request->option_value)) {
                (new ProductOptionQueryService)->createOrUpdateOptionValue($request->option_value, $productOption->id);
            }
        }
        DB::commit();

        return $productOption;
    }

    public static function update(Request $request, $id)
    {
        DB::beginTransaction();
        $dataInput = $request->all();
        $dataInput["slug"] = Str::slug($request->name);

        $productOption = ProductOption::find($id)->update($dataInput);

        if ($request->option_value && !empty($request->option_value)) {
            (new ProductOptionQueryService)->createOrUpdateOptionValue($request->option_value, $id);
        }

        DB::commit();
        return $productOption;
    }

    public static function findById(Request $request, $id)
    {
        return ProductOption::with("productOptionValue")->find($id);
    }

    protected function createOrUpdateOptionValue($optionValues, $id)
    {
        foreach ($optionValues ?? [] as $item) {
            $option = [
                "product_option_id" => $id,
                "name"              => $item["name"],
                "value"             => $item["value"] ?? null,
                "created_at"        => Carbon::now()
            ];
            if (isset($item['id'])) {
                ProductOptionValue::find($item["id"])->update($option);
            } else {
                ProductOptionValue::create($option);
            }
        }
    }
}