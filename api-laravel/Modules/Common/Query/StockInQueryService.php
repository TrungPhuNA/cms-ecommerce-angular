<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 8/24/24
 */

namespace Modules\Common\Query;

use Illuminate\Http\Request;
use Modules\Admin\App\Models\StockIn;
use Modules\Common\Base\ModelService;

class StockInQueryService extends ModelService
{
    public static function getAll(Request $request, $items = null)
    {
        $items = StockIn::query();
        return parent::getAll($request, $items);
    }

    public static function create(Request $request)
    {
        $dataInput = $request->all();
        return StockIn::create($dataInput);
    }

    public static function update(Request $request, $id)
    {
        $dataInput = $request->all();
        return StockIn::find($id)->update($dataInput);
    }

    public static function findById(Request $request, $id)
    {
        return StockIn::find($id);
    }
}