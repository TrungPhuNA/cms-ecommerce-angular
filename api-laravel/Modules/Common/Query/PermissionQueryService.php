<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 9/29/24
 */

namespace Modules\Common\Query;

use Illuminate\Http\Request;
use Modules\Common\Base\ModelService;
use Spatie\Permission\Models\Permission;

class PermissionQueryService extends ModelService
{
    public static function getAll(Request $request, $items = null)
    {
        $items = Permission::query();
        return parent::getAll($request, $items);
    }

    public static function create(Request $request)
    {
        $dataInput = $request->all();
        return Permission::create($dataInput);
    }

    public static function update(Request $request, $id)
    {
        $dataInput = $request->all();
        return Permission::find($id)->update($dataInput);
    }

    public static function findById(Request $request, $id)
    {
        return Permission::find($id);
    }
}