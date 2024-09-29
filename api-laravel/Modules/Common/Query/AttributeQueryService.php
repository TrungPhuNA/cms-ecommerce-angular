<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 8/24/24
 */

namespace Modules\Common\Query;

use Illuminate\Http\Request;
use Modules\Admin\App\Models\Attribute;
use Modules\Common\Base\ModelService;

class AttributeQueryService extends ModelService
{
    public static function getAll(Request $request, $items = null)
    {
        $items = Attribute::query();
        return parent::getAll($request, $items);
    }

    public static function create(Request $request)
    {
        $dataInput = $request->all();
        return Attribute::create($dataInput);
    }

    public static function update(Request $request, $id)
    {
        $dataInput = $request->all();
        return Attribute::find($id)->update($dataInput);
    }

    public static function findById(Request $request, $id)
    {
        return Attribute::find($id);
    }
}