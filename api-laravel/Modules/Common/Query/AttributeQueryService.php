<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 8/24/24
 */

namespace Modules\Common\Query;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Modules\Admin\App\Models\Attribute;
use Modules\Admin\App\Models\AttributeValue;
use Modules\Common\Base\ModelService;

class AttributeQueryService extends ModelService
{
    public static function getAll(Request $request, $items = null)
    {
        $items = Attribute::with("attributeValue");
        return parent::getAll($request, $items);
    }

    public static function create(Request $request)
    {
        DB::beginTransaction();
        $dataInput = $request->all();
        $dataInput["slug"] = Str::slug($request->name);
        $attribute = Attribute::create($dataInput);
        if ($attribute) {
            if ($request->attributes_value && !empty($request->attributes_value)) {
                (new AttributeQueryService)->createOrUpdateAttributeValue($request->attributes_value, $attribute->id);
            }
        }
        DB::commit();

        return $attribute;
    }

    public static function update(Request $request, $id)
    {
        DB::beginTransaction();
        $dataInput = $request->all();
        $dataInput["slug"] = Str::slug($request->name);
        $attribute = Attribute::find($id)->update($dataInput);

        if ($request->attributes_value && !empty($request->attributes_value)) {
            (new AttributeQueryService)->createOrUpdateAttributeValue($request->attributes_value, $id);
        }

        DB::commit();
        return $attribute;
    }

    public static function findById(Request $request, $id)
    {
        return Attribute::with("attributeValue")->find($id);
    }

    protected function createOrUpdateAttributeValue($attributesValue, $id)
    {
        foreach ($attributesValue ?? [] as $item) {
            $attributeValue = [
                "attribute_id" => $id,
                "is_default"   => 0,
                "color"        => $item["color"],
                "image"        => $item["image"],
                "title"        => $item["title"],
                "slug"         => Str::slug($item["title"]),
                "created_at"   => Carbon::now()
            ];
            if (isset($item['id'])) {
                AttributeValue::find($item["id"])->update($attributeValue);
            } else {
                AttributeValue::create($attributeValue);
            }
        }
    }
}