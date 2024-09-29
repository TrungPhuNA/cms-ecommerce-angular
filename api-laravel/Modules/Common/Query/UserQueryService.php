<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 7/19/24
 */

namespace Modules\Common\Query;

use App\Models\User;
use Illuminate\Http\Request;
use Modules\Common\Base\ModelService;

class UserQueryService extends ModelService
{
    public static function findById($id)
    {
        return User::find($id);
    }

    public static function getAll(Request $request, $items = null)
    {
        $items = User::query();
        return parent::getAll($request, $items);
    }

    public static function create(Request $request)
    {
        $dataInput = $request->all();
        $dataInput['password'] = bcrypt($request->password);
        return User::create($dataInput);
    }

    public static function update(Request $request, $id)
    {
        $dataInput = $request->all();
        if($request->password) {
            $dataInput['password'] = bcrypt($request->password);
        }
        return User::find($id)->update($dataInput);
    }
}