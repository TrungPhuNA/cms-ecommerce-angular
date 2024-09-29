<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 7/18/24
 */

namespace Modules\Common\Query;

use App\Models\UserBankAccount;
use Illuminate\Http\Request;
use Modules\Common\Base\ModelService;

class UserBankAccountQueryService extends ModelService
{
    const EQUAL = [
        'user_id'
    ];
    public static function getAll(Request $request, $items = null)
    {
        $items = UserBankAccount::with('user','bank');
        return parent::getAll($request, $items);
    }

    public static function create(Request $request)
    {
        $dataInput = $request->all();
        return UserBankAccount::create($dataInput);
    }

    public static function update(Request $request, $id)
    {
        $dataInput = $request->all();
        return UserBankAccount::find($id)->update($dataInput);
    }

    public static function findById(Request $request, $id)
    {
        return UserBankAccount::with('user','bank')->find($id);
    }
}