<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 9/29/24
 */

namespace Modules\Common\Query;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Common\Base\ModelService;
use Spatie\Permission\Models\Role;

class RoleQueryService extends ModelService
{
    public static function getAll(Request $request, $items = null)
    {
        $items = Role::with("permissions");
        return parent::getAll($request, $items);
    }

    public static function create(Request $request)
    {
        DB::beginTransaction();
        $dataInput = $request->except("permissions");
        $role = Role::create($dataInput);
        if ($role && !empty($request->permissions))
            $role->givePermissionTo($request->permissions);

        DB::commit();
        return $role;
    }

    public static function update(Request $request, $id)
    {
        DB::beginTransaction();
        $dataInput = $request->all();
        $update = Role::find($id)->update($dataInput);
        if ($update && !empty($request->permissions))
        {
            $role = Role::find($id);
            $permissionActive = DB::table('acl_role_has_permissions')
                ->where('role_id', $id)
                ->pluck('permission_id')
                ->toArray();

            if ($permissionActive) {
                foreach ($permissionActive as $item)
                    $role->revokePermissionTo($item);
            }

            $role->givePermissionTo($request->permissions);
        }
        DB::commit();
        return self::findById($request, $id);
    }

    public static function findById(Request $request, $id)
    {
        return Role::with("permissions")->find($id);
    }
}