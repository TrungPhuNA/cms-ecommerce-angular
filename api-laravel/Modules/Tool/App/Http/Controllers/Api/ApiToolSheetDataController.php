<?php

namespace Modules\Tool\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Admin\App\Models\Brand;
use Modules\Admin\App\Models\Category;
use Modules\Common\Base\CliEcho;
use Modules\Common\Service\ResponseService;
use Revolution\Google\Sheets\Facades\Sheets;

class ApiToolSheetDataController extends Controller
{
    protected $tableConfig = [
        "categories","ec_brands","ec_product_labels","slides","bl_menus","bl_tags"
    ];
    public function crawlerDataGoogleSheet(Request $request)
    {
        try {
            $sheet = Sheets::spreadsheet('1D0rouGWbsfPIC0CxGvOT2hHzUVOPPk-zqF6DQZlqZ-g')->sheet($request->table)->get();
            $header = $sheet->pull(0);
            $values = Sheets::collection($header, $sheet);
            $data = array_values($values->toArray());

            $table = $request->table;
            switch ($table) {
                case "categories":
                    $this->insertCategory($data);
                    break;
                case "ec_brands":
                    $this->insertBrands($data);
                    break;
                case "ec_product_labels":
                    $this->insertLabel($data);
                    break;
                case "slides":
                    $this->insertSlides($data);
                    break;
                case "bl_tags":
                case "bl_menus":
                    $this->insertMenus($data, $request->table);
                    break;
            }

            return ResponseService::sendSuccess([
                "data" => []
            ], "successfully.");

        } catch (\Exception $exception) {
            return ResponseService::sendError($exception->getMessage());
        }
    }

    protected function insertCategory($categories)
    {
        foreach ($categories as $category) {
            CliEcho::successnl("================ Category: Name: ".$category["name"]);
            $slug = \Illuminate\Support\Str::slug($category["name"]);
            $check = Category::where("slug", $slug)->first();
            if (!$check) {
                DB::table("categories")->insert([
                    "name"       => $category["name"],
                    "slug"       => \Illuminate\Support\Str::slug($category["name"]),
                    "created_at" => Carbon::now()
                ]);
            }
        }
    }

    protected function insertBrands($brands)
    {
        foreach ($brands as $item) {
            CliEcho::successnl("================ Brand: Name: ".$item["name"]);
            $slug = \Illuminate\Support\Str::slug($item['name']);
            $check = Brand::where("slug", $slug)->first();
            if (!$check) {
                DB::table("ec_brands")->insert([
                    "name"       => $item["name"],
                    "slug"       => \Illuminate\Support\Str::slug($item['name']),
                    "avatar"     => $item["avatar"],
                    "status"     => $item["status"],
                    "created_at" => Carbon::now()
                ]);
            }
        }
    }
    protected function insertLabel($values)
    {
        foreach ($values as $item) {
            CliEcho::errornl("================ Label: Name: ".$item["name"]);
            $slug = \Illuminate\Support\Str::slug($item['name']);
            $check = DB::table("ec_product_labels")->where("slug", $slug)->first();
            if (!$check) {
                DB::table("ec_product_labels")->insert([
                    "name"        => $item['name'],
                    "description" => $item['description'],
                    "slug"        => $item['name'],
                    "order"       => $item["order"] ?? 0,
                    "status"      => $item["status"],
                    "created_at"  => Carbon::now()
                ]);
            }
        }
    }
    protected function insertSlides($values)
    {
        foreach ($values as $item) {
            unset($item["STT"]);
            if($item["name"]) {
                CliEcho::errornl("================ insertSlides: Name: ".(json_encode($item)));
                $item["created_at"] = Carbon::now();
                $item["position"] = $item["position"] ?? 1;
                DB::table("slides")->insert($item);
            }
        }
    }
    protected function insertMenus($values, $table)
    {
        foreach ($values as $item) {
            try{
                unset($item["STT"]);
                if($item["name"]) {
                    $slug = \Illuminate\Support\Str::slug($item['name']);
                    $check = DB::table($table)->where("slug", $slug)->first();
                    if(!$check) {
                        $item["created_at"] = Carbon::now();
                        $item["is_featured"] = isset($item["is_featured"]) ? $item["is_featured"] : 0;
                        $item["status"] = isset($item["status"]) ? $item["status"] : 'published';
                        DB::table($table)->insert($item);
                        CliEcho::successnl("================ $table: Name: ".(json_encode($item)));
                    }
                }
            }catch (\Exception $exception) {
                CliEcho::errornl("================ $table: Name: ".$exception->getMessage());
                \Log::error("=======[@insertMenus] File: "
                        . $exception->getFile()
                        . " Line: " . $exception->getLine()
                        . " Message: " . $exception->getMessage());
            }
        }
    }
}
