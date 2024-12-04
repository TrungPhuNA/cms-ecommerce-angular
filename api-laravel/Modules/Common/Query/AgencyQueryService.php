<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 8/24/24
 */

namespace Modules\Common\Query;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Modules\Admin\App\Models\AgencyModel;
use Modules\Admin\App\Models\StockOut;
use Modules\Common\Base\ModelService;

class AgencyQueryService extends ModelService
{
    const LIKE_FULL = ["name"];
    const EQUAL = ["status"];
    public static function getAll(Request $request, $items = null)
    {
        $items = AgencyModel::query();
        return parent::getAll($request, $items);
    }

    public static function create($dataInput)
    {
        if(isset($dataInput["name"])) {
            $dataInput["slug"] = Str::slug($dataInput["name"]);
        }
        return AgencyModel::create($dataInput);
    }

    public static function update($dataInput, $id)
    {
        if(isset($dataInput["name"])) {
            $dataInput["slug"] = Str::slug($dataInput["name"]);
        }
        return AgencyModel::find($id)->update($dataInput);
    }

    public static function findById(Request $request, $id)
    {
        return AgencyModel::query()->find($id);
    }

    public static function deleteById(Request $request, $id)
    {
        return AgencyModel::query()->where("id", $id)->delete();
    }
}