<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 8/24/24
 */

namespace Modules\Common\Query;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Modules\Admin\App\Models\Category;
use Modules\Admin\App\Models\Order;
use Modules\Admin\App\Models\PaymentMethod;
use Modules\Admin\App\Models\Transaction;
use Modules\Common\Base\ModelService;
use Modules\Common\Helpers\HelpersClass;

class OrderQueryService extends ModelService
{

    const LIKE_FULL = ['name'];
    const EQUAL = [
        "user_id",
        "supplier_id",
        "status_payment",
        "status"
    ];

    public static function getAll(Request $request, $items = null)
    {
        $items = Order::with('user:id,name,email,phone', 'transactions', 'supplier:id,name', 'stockOuts');
        return parent::getAll($request, $items);
    }

    public static function create(Request $request)
    {
        $dataInput = $request->all();
        $dataInput["created_at"] = Carbon::now();
        $dataInput["code"] = HelpersClass::generateOrderCode();
        $dataInput["user_id"] = Arr::get($dataInput, "user_id")  ?? $request->user()->id;

        if(!$request->payment_method_id) {
            $dataInput["payment_method_id"] = PaymentMethod::where("is_default", true)->first()->id ?? 1;
        }
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
        $order = Order::find($id);
        $dataInput["user_id"] = Arr::get($dataInput, "user_id")  ?? $request->user()->id;
        $update = Order::find($id)->update($dataInput);
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
                if(Arr::get($item, 'transaction_id')) {
                    Transaction::find($item['transaction_id'])->update($data);
                }else {
                    Transaction::create($data);
                }

            }
        }

        return self::findById($request, $id);
    }

    public static function findById(Request $request, $id)
    {
        return Order::with('user:id,name,email,phone', 'transactions','transactions.product:id,name,avatar', 'supplier:id,name', 'stockOuts', "stockOuts.agency")->find($id);
    }

    public static function updateColumnOrder(Request $request, $id)
    {
        $order = Order::find($id);

        if($order) {
            $order->update([
                $request->column => $request->value,
                'updated_at' => Carbon::now()
            ]);
        }

        return self::findById($request, $id);
    }
}