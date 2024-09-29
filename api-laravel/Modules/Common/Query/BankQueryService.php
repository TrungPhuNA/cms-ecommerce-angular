<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 7/18/24
 */

namespace Modules\Common\Query;

use App\Models\Bank;
use Illuminate\Http\Request;
use Modules\Common\Base\ModelService;

class BankQueryService extends ModelService
{
    public static function getAll(Request $request, $items = null)
    {
        $items = Bank::query();
        return parent::getAll($request, $items);
    }
}