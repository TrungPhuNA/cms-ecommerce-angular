<?php

namespace Modules\Admin\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Modules\Admin\App\Models\Order;
use Modules\Admin\App\Models\Product;
use Modules\Admin\App\Models\StockIn;
use Modules\Admin\App\Models\StockOut;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;

class ApiAdminDashboardController extends Controller
{
    public function getDashboard(Request $request)
    {
        try {
            $totalUser = User::select('id')->count();
            $totalIncome = StockIn::sum('quantity');
            $totalOutcome = StockOut::sum('quantity');

            $totalProduct = Product::select('id')->count();
            $totalOrder = Order::select('id')->count();
            $totalProductQuantity = Product::sum('number');
            $totalRevenue = Order::sum('sub_total');

            $orderDayInMonth = $this->getDailyRevenue();
            $orderMonthInYear = $this->getMonthlyRevenue();


            $data = [
                'total_user'          => $totalUser,
                'total_product'       => $totalProduct,
                'total_product_quantity'       => $totalProductQuantity,
                'stock_ins'       => $this->getIncomeGroup('ec_stock_ins'),
                'stock_outs'       => $this->getIncomeGroup('ec_stock_outs'),
                'total_order'         => $totalOrder,
                'total_revenue'       => $totalRevenue,
                'total_income'       => $totalIncome,
                'total_outcome'       => $totalOutcome,
                'order_day_in_month'  => $orderDayInMonth,
                'order_month_in_year' => $orderMonthInYear,
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    public function getDailyRevenue()
    {
        // Lấy tháng hiện tại và năm hiện tại
        $currentYear = Carbon::now()->year;
        $currentMonth = Carbon::now()->month;

        // Lấy tổng doanh thu theo từng ngày trong tháng hiện tại
        $revenues = DB::table('ec_orders')
            ->select(DB::raw('DAY(created_at) as day'), DB::raw('SUM(sub_total) as total'))
            ->where('payment_status', 'completed')
            ->whereYear('created_at', $currentYear)
            ->whereMonth('created_at', $currentMonth)
            ->groupBy(DB::raw('DAY(created_at)'))
            ->pluck('total', 'day');

        // Chuẩn bị dữ liệu cho từng ngày trong tháng
        $daysInMonth = Carbon::now()->daysInMonth;
        $dailyRevenue = [];
        for ($day = 1; $day <= $daysInMonth; $day++) {
            $dailyRevenue[$day] = $revenues->get($day, 0);
        }

        return $dailyRevenue;
    }

    public function getIncomeGroup($table = 'ec_stock_ins')
    {
        // Lấy tháng hiện tại và năm hiện tại

        // Lấy tổng doanh thu theo từng ngày trong tháng hiện tại
        $incomes = DB::table($table)
            ->leftJoin('ec_products', $table.'.product_id', '=', 'ec_products.id')
            ->select(
                DB::raw("SUM($table.quantity) as total_quantity"),
                $table.'.product_id',
                'ec_products.name',
                'ec_products.number'
            )
            ->groupBy($table.'.product_id', 'ec_products.name', 'ec_products.number')
            ->get();

        return $incomes;
    }

    public function getMonthlyRevenue()
    {
        // Lấy năm hiện tại
        $currentYear = Carbon::now()->year;

        // Lấy tổng doanh thu theo từng tháng trong năm hiện tại
        $revenues = DB::table('ec_orders')
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw('SUM(sub_total) as total'))
            ->where('payment_status', 'completed')
            ->whereYear('created_at', $currentYear)
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->pluck('total', 'month');

        // Chuẩn bị dữ liệu cho từng tháng trong năm
        $monthlyRevenue = [];

        for ($month = 1; $month <= 12; $month++) {
            $monthlyRevenue[$month] = $revenues->get($month, 0);
        }

        return $monthlyRevenue;
    }
}
