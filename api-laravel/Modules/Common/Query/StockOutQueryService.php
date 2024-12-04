<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 8/24/24
 */

namespace Modules\Common\Query;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Modules\Admin\App\Models\Order;
use Modules\Admin\App\Models\StockOut;
use Modules\Common\Base\ModelService;

class StockOutQueryService extends ModelService
{
    public static function getAll(Request $request, $items = null)
    {
        $items = StockOut::with(['user:id,name,email', 'product:id,avatar,name', 'order', 'order.transactions', 'agency']);
        return parent::getAll($request, $items);
    }

    public static function getAllStockOutV2(Request $request)
    {
        $items = Order::with(['stockOuts','stockOuts.product', 'stockOuts.agency','supplier'])->whereHas('stockOuts', function ($q){
            $q->whereNotNull('id');
        });
        return parent::getAll($request, $items);
    }

    public static function create(Request $request)
    {
        $dataInput = $request->all();
        return StockOut::create($dataInput);
    }

    public static function storeData($dataInput)
    {
        $data = Arr::get($dataInput, 'stock_out');
        if($data && !empty($data)) {
            foreach ($data as $item) {
                StockOut::create($item);
            }
        }
        return $data;
    }

    public static function update(Request $request, $id)
    {
        $dataInput = $request->all();
        return StockOut::find($id)->update($dataInput);
    }

    public static function findById(Request $request, $id)
    {
        return StockOut::with(['user:id,name,email', 'product:id,avatar,name', 'agency'])->find($id);
    }


}