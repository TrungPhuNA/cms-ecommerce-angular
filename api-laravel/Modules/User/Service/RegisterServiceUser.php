<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 7/18/24
 */

namespace Modules\User\Service;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RegisterServiceUser
{
    public static function register(Request $request)
    {
        DB::beginTransaction();
        $userCreate = $request->all();
        $userCreate['password'] = bcrypt($request->password);

        $user = User::create($userCreate);
        $userType = UserTypeService::findByName($request->type_name);
        $user->types()->attach($userType->id);
        DB::commit();

        return $user;
    }

    public static function login(Request $request)
    {
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();
            $user->load('types');
            $user->access_token = $user->createToken('MyApp')->plainTextToken;
            return $user;
        }
        return null;
    }
}