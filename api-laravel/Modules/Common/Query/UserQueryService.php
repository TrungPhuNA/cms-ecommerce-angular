<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 7/19/24
 */

namespace Modules\Common\Query;

use App\Models\User;
use App\Models\UserApi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Common\Base\ModelService;
use Modules\User\Service\UserTypeService;

class UserQueryService extends ModelService
{
    public static function findById($id)
    {
        return User::with('types','rolesAccount')->find($id);
    }

    public static function getAll(Request $request, $items = null)
    {
        $items = User::with('types','rolesAccount');
        return parent::getAll($request, $items);
    }

    public static function create(Request $request)
    {
        DB::beginTransaction();
        $dataInput = $request->all();
        $dataInput['password'] = bcrypt($request->password);
        $user =  UserApi::create($dataInput);

        if ($request->roles && $user)
            $user->assignRole($request->roles);

        $userType = UserTypeService::findByName($request->type_name);
        $user->types()->attach($userType->id);

        DB::commit();

        return $user;
    }

    public static function update(Request $request, $id)
    {
        $dataInput = $request->all();
        if($request->password) {
            $dataInput['password'] = bcrypt($request->password);
        }
        $userUpdate =  UserApi::find($id)->update($dataInput);
        if($userUpdate) {
            if ($request->roles) {
                $user = UserApi::find($id);
                $roleActive = DB::table('acl_model_has_roles')->where('model_id', $id)->pluck('role_id')->toArray();
                if (!empty($roleActive)) {
                    foreach ($roleActive as $item)
                        $user->removeRole($item);
                }

                $user->assignRole($request->roles);
            }
        }

        return $userUpdate;
    }
}