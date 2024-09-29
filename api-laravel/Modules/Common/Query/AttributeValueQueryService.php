<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 8/25/24
 */

namespace Modules\Common\Query;

use Illuminate\Http\Request;
use Modules\Admin\App\Models\AttributeValue;
use Modules\Common\Base\ModelService;

class AttributeValueQueryService extends ModelService
{
    public static function getAll(Request $request, $items = null)
    {
        $items = AttributeValue::with("attribute:id,name");
        return parent::getAll($request, $items);
    }

    public static function create(Request $request)
    {
        $dataInput = $request->all();
        return AttributeValue::create($dataInput);
    }

    public static function update(Request $request, $id)
    {
        $dataInput = $request->all();
        return AttributeValue::find($id)->update($dataInput);
    }

    public static function findById(Request $request, $id)
    {
        return AttributeValue::find($id);
    }
}