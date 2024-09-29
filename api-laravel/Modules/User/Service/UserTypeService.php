<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 9/28/24
 */

namespace Modules\User\Service;

use App\Models\UserType;

class UserTypeService
{
    public static function findByName($name)
    {
        return UserType::where("name", $name)->first();
    }
}