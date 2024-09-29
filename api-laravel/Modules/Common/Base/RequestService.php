<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 7/18/24
 */

namespace Modules\Common\Base;

use Carbon\Carbon;

class RequestService
{
    const FILTERS = "filters";
    const PAGE_SIZE = "page_size";
    const SORT = "sort";
    const TRUE = "true";

    /**
     * @param string $start_at
     * @param string $end_at
     * @return bool
     */
    public static function isValidStartAtAndEndAt(string $start_at, string $end_at): bool
    {
        // start_at or end_at > now is invalid
        if (Carbon::parse($start_at)->gt(now()) || Carbon::parse($end_at)->gt(now())) {
            return false;
        }
        // Case last week
        $is_start_last_week = now()->subWeek()->startOfWeek()->eq(Carbon::parse($start_at));
        $is_end_last_week = now()->subWeek()->endOfWeek()->eq(Carbon::parse($end_at)->endOfDay());

        if ($is_start_last_week && $is_end_last_week) {
            return true;
        }
        // Case month
        $is_start_month = Carbon::parse($start_at)->startOfMonth()->eq(Carbon::parse($start_at));
        $is_end_month = Carbon::parse($end_at)->endOfMonth()->eq(Carbon::parse($end_at)->endOfDay());

        if ($is_start_month && $is_end_month) {
            return true;
        }

        return false;
    }
}