<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 10/12/24
 */

namespace Modules\Common\Query;

use Illuminate\Http\Request;
use Modules\Admin\App\Models\PaymentMethod;
use Modules\Common\Base\ModelService;

class PaymentMethodQueryService extends ModelService
{
    const EQUAL = [
        "is_default",
        "status"
    ];
    const LIKE_FULL = ['name'];
    public static function getAll(Request $request, $items = null)
    {
        $items = PaymentMethod::query();
        return parent::getAll($request, $items);
    }

    public static function create(Request $request)
    {
        $dataInput = $request->all();
        return PaymentMethod::create($dataInput);
    }

    public static function update(Request $request, $id)
    {
        $dataInput = $request->all();
        return PaymentMethod::find($id)->update($dataInput);
    }

    public static function findById(Request $request, $id)
    {
        return PaymentMethod::find($id);
    }
}