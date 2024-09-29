<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 8/24/24
 */

namespace Modules\Common\Query;

use Illuminate\Http\Request;
use Modules\Admin\App\Models\StockOut;
use Modules\Common\Base\ModelService;

class StockOutQueryService extends ModelService
{
    public static function getAll(Request $request, $items = null)
    {
        $items = StockOut::query();
        return parent::getAll($request, $items);
    }

    public static function create(Request $request)
    {
        $dataInput = $request->all();
        return StockOut::create($dataInput);
    }

    public static function update(Request $request, $id)
    {
        $dataInput = $request->all();
        return StockOut::find($id)->update($dataInput);
    }

    public static function findById(Request $request, $id)
    {
        return StockOut::find($id);
    }
}