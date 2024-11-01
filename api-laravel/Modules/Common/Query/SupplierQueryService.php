<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 8/24/24
 */

namespace Modules\Common\Query;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Modules\Admin\App\Models\Supplier;
use Modules\Common\Base\ModelService;

class SupplierQueryService extends ModelService
{

    const LIKE_FULL = ['name'];

    public static function getAll(Request $request, $items = null)
    {
        $items = Supplier::query();
        return parent::getAll($request, $items);
    }

    public static function create(Request $request)
    {
        $dataInput = $request->all();
        $dataInput["slug"] = Str::slug(Arr::get($request->all(), 'name'));
        $dataInput["created_at"] = Carbon::now();
        $order = Supplier::create($dataInput);
        return $order;
    }

    public static function update(Request $request, $id)
    {
        $dataInput = $request->all();
        $dataInput["slug"] = Str::slug(Arr::get($request->all(), 'name'));

        $update = Supplier::find($id)->update($dataInput);
        return self::findById($request, $id);
    }

    public static function findById(Request $request, $id)
    {
        return Supplier::query()->find($id);
    }

    public static function deleteById(Request $request, $id)
    {
        return Supplier::query()->where('id', $id);
    }


}