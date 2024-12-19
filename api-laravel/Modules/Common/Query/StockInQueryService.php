<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 8/24/24
 */

namespace Modules\Common\Query;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Modules\Admin\App\Models\Product;
use Modules\Admin\App\Models\StockIn;
use Modules\Common\Base\ModelService;

class StockInQueryService extends ModelService
{
    public static function getAll(Request $request, $items = null)
    {
        $items = StockIn::with(['user:id,name,email', 'product:id,avatar,name']);
        return parent::getAll($request, $items);
    }

    public static function create(Request $request)
    {
        $dataInput = $request->all();
        $product = Product::query()->where("id", Arr::get($dataInput, 'product_id'))->first();
        if($product) {
            $product->number = ($product->number ?? 0) + (int)(Arr::get($dataInput, 'quantity') ?? 0);
            $product->save();
        }
        return StockIn::create($dataInput);
    }

    public static function update(Request $request, $id)
    {
        $dataInput = $request->all();
        return StockIn::find($id)->update($dataInput);
    }

    public static function findById(Request $request, $id)
    {
        return StockIn::with(['user:id,name,email', 'product:id,avatar,name'])->find($id);
    }
}