<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 10/11/24
 */

namespace Modules\Common\Helpers;

use Illuminate\Support\Str;

class HelpersClass
{
    public static function generateOrderCode()
    {
        // Lấy timestamp hiện tại để đảm bảo tính duy nhất theo thời gian
        $timestamp = now()->format('YmdHis'); // Định dạng: YYYYMMDDHHMMSS

        // Tạo một chuỗi ngẫu nhiên 4 ký tự để thêm vào timestamp
        $randomString = strtoupper(Str::random(4)); // VD: ABCD

        // Kết hợp timestamp và chuỗi ngẫu nhiên để tạo mã đơn hàng
        $orderCode = 'ORD-' . $timestamp . '-' . $randomString;

        return $orderCode;
    }
}