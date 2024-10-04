<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 8/24/24
 */

namespace Modules\Common\Query;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Modules\Admin\App\Models\Category;
use Modules\Admin\App\Models\Order;
use Modules\Admin\App\Models\Transaction;
use Modules\Common\Base\ModelService;

class OrderQueryService extends ModelService
{

    const LIKE_FULL = ['name'];
    const EQUAL = [
        "user_id",
        "status_payment",
        "status"
    ];

    public static function getAll(Request $request, $items = null)
    {
        $items = Order::with('user:id,name,email','transactions');
        return parent::getAll($request, $items);
    }

    public static function create(Request $request)
    {
        $dataInput = $request->all();
        $dataInput["created_at"]  = Carbon::now();
        $order = Order::create($dataInput);
        if ($order) {
            if (!empty($request->products)) {
                foreach ($request->products ?? [] as $item) {
                    $data = [
                        "price"       => $item["price"],
                        "order_id"    => $order->id,
                        "product_id"  => $item["id"],
                        "qty"         => $item["qty"],
                        "total_price" => $item["qty"] * $item["price"],
                        "status"      => $order->status,
                        "created_at"  => Carbon::now()
                    ];

                    Transaction::create($data);
                }
            }
        }

        return $order;
    }

    public static function update(Request $request, $id)
    {
        $dataInput = $request->all();
        $update =  Order::find($id)->update($dataInput);
        if (!empty($request->products)) {
            foreach ($request->products ?? [] as $item) {
                $data = [
                    "price"       => $item["price"],
                    "order_id"    => $id,
                    "product_id"  => $item["id"],
                    "qty"         => $item["qty"],
                    "total_price" => $item["qty"] * $item["price"],
                    "status"      => $order->status,
                    "created_at"  => Carbon::now()
                ];

                Transaction::create($data);
            }
        }
    }

    public static function findById(Request $request, $id)
    {
        return Order::with('user:id,name,email','transactions')->find($id);
    }
}