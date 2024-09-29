<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 7/18/24
 */

namespace Modules\Common\Base;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ModelService
{
    const LIKE = [];
    const EQUAL = [];
    const OTHER = [];
    const PAGE_SIZE_DEFAULT = 20;
    const SORT = [
        'level',
        'sort',
        'id',
    ];
    const IGNORE = [];
    const IN = [];
    const LIKE_FULL = [];
    const BOOLEAN = [];
    const LIKE_DATE = [];
    const BETWEEN = [];
    const BETWEEN_DATE = [
        'created_at',
        'updated_at'
    ];
    const HIDDEN = [];
    const DATE_FULL = 'Y-m-d H:i:s';

    /**
     * Get all
     *
     * @param Request $request
     * @param null $items
     * @return mixed
     */
    public static function getAll(Request $request, $items = null)
    {
        $filters = $request->get(RequestService::FILTERS);
        $sort = $request->get(RequestService::SORT);

        if (!$items) $items = DB::table(static::getTableName());
        self::queryList($items, $filters, $sort);
        $pageSize = $request->get(RequestService::PAGE_SIZE) ?: static::PAGE_SIZE_DEFAULT;

        return $items->paginate($pageSize);
    }

    /**
     * Get all with params
     *
     * @param Request $request
     * @param null $items
     * @return mixed
     */
    public static function getAllWithParams(Request $request, $items = null)
    {
        $filters = $request->get(RequestService::FILTERS);
        $sort = $request->get(RequestService::SORT);

        if ($filters && $filters["name"]) {
            $filters["name"] = trim(mb_strtolower($filters["name"], 'UTF-8'), ' ');
        }

        if (!$items) $items = DB::table(static::getTableName());

        self::queryList($items, $filters, $sort);

        $pageSize = $request->get(RequestService::PAGE_SIZE) ?: static::PAGE_SIZE_DEFAULT;

        return $items->paginate($pageSize);
    }


    /**
     * Get all no pagination
     *
     * @param Request $request
     * @param null $items
     * @return mixed
     */
    public static function getAllNoPagination(Request $request, $items = null)
    {
        $filters = $request->get(RequestService::FILTERS);
        $sort = $request->get(RequestService::SORT);

        if (!$items) $items = DB::table(static::getTableName());
        self::queryList($items, $filters, $sort);

        return $items->get();
    }


    /**
     * Get table name
     *
     * @return null
     */
    public static function getTableName()
    {
        return null;
    }

    /**
     * @return string
     */
    public static function getIdName(): string
    {
        return 'id';
    }

    /**
     * Create custom filter
     *
     * @param $items
     * @param $key
     * @param $value
     * @return mixed
     */
    public static function createCustomFilter($items, $key, $value)
    {
        return $items;
    }

    /**
     * @param Request $request
     * @return mixed|string
     */
    public static function checkTypePortal(Request $request)
    {
        $type = '';
        if (isset($request['type'])) $type = $request['type'];
        return $type;
    }

    /**
     * @param $name
     * @param string $type
     * @return string
     */
    public static function convertName($name, $type = '')
    {
        $new_name = strtoupper(str_replace(['-', ' '], '_', trim($name)));

        if ($type === '') return $new_name;

        return $type . '_' . $new_name;
    }

    /**
     * @param $items
     * @param array |null $filters
     * @param string|null $sort
     */
    private static function queryList(&$items, array $filters = null, string $sort = null): void
    {
        if (!empty(static::HIDDEN)) {
            $columns = Schema::getColumnListing(static::getTableName());

            $visibleColumns = array_diff($columns, static::HIDDEN);
            $items->select($visibleColumns);
        }

        if ($filters) {
            foreach ($filters as $key => $value) {
                $continue = in_array($key, static::IGNORE) || $value == "" ||
                    !in_array($key, array_merge(static::LIKE, static::LIKE_FULL, static::EQUAL, static::OTHER, static::IN, static::BOOLEAN, static::LIKE_DATE, static::BETWEEN, static::BETWEEN_DATE));

                if ($continue) {
                    continue;
                }

                if (in_array($key, static::LIKE)) {
                    $lowerValue = strtolower($value);
                    $items->whereRaw("LOWER({$key}) LIKE '{$lowerValue}%'");

                    continue;
                }
                if (in_array($key, static::LIKE_FULL)) {
                    $lowerValue = strtolower($value);
                    $items->whereRaw("LOWER({$key}) LIKE '%{$lowerValue}%'");
                    continue;
                }
                if (in_array($key, static::LIKE_DATE)) {
                    $items->whereRaw("CAST({$key} AS VARCHAR) like '{$value}%'");
                    continue;
                }
                if (in_array($key, static::EQUAL)) {
                    $items->where($key, "=", $value);
                    continue;
                }
                if (in_array($key, static::BETWEEN)) {
                    $start = Carbon::parse($value['start'])->startOfDay()->toDateTimeString();
                    $end = Carbon::parse($value['end'])->endOfDay()->toDateTimeString();
                    $items->where($key, ">=", $start);
                    $items->where($key, "<=", $end);
                    continue;
                }
                if (in_array($key, static::BETWEEN_DATE)) {
                    $start = Carbon::parse($value['start'])->startOfDay()->toDateTimeString();
                    $end = Carbon::parse($value['end'])->endOfDay()->toDateTimeString();
                    $items->whereDate($key, ">=", $start);
                    $items->whereDate($key, "<=", $end);
                    continue;
                }
                if (in_array($key, static::BOOLEAN)) {
                    if ($value == 0) {
                        $items->where(function ($query) use ($key) {
                            $query->whereRaw("{$key} is false")->orWhereRaw("{$key} is null");
                        });
                    } else {
                        $items->whereRaw("{$key} is true");
                    }
                    continue;
                }
                if (in_array($key, static::IN)) {
                    $items->whereIn($key, explode(",", $value));
                    continue;
                }
                if (in_array($key, static::OTHER)) {
                    $items = static::createCustomFilter($items, $key, $value);
                    continue;
                }
            }
        }

        if ($sort) {
            $asc = true;
            if (strpos($sort, "-") === 0) {
                $asc = false;
                $sort = substr($sort, 1);
            }
            if (!in_array($sort, static::SORT)) {
                $items->whereRaw("1 = 0");
            } else {
                if ($asc) {
                    $items->orderBy($sort, "asc");
                } else {
                    $items->orderBy($sort, "desc");
                }
            }
        }
        else {
            $table = static::getTableName();
            $id = static::getIdName();

            $id_query = is_null($table)? 'id': "$table.$id";
            $items->orderBy("$id_query", "desc");
        }
    }

    /**
     * Get LengthAwarePaginator
     *
     * @param LengthAwarePaginator $paginator
     * @return array
     */
    public static function getLengthAwarePaginatorData(LengthAwarePaginator $paginator): array
    {
        $collections = $paginator->getCollection();
        $meta = [
            "total" => $paginator->total(),
            "per_page" => (int)$paginator->perPage(),
            "current_page" => (int)$paginator->currentPage(),
            "last_page" => $paginator->lastPage()
        ];

        return [$collections, $meta];
    }
}