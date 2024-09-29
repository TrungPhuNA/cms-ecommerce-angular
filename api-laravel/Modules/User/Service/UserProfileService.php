<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 7/18/24
 */

namespace Modules\User\Service;

use Carbon\Carbon;
use Illuminate\Http\Request;

class UserProfileService
{
    public static function updateProfile(Request $request)
    {
        $user = auth()->user();
        $user->name = $request->name ?? $user->name;
        $user->updated_at = Carbon::now();
        $user->save();
        return $user;
    }
}