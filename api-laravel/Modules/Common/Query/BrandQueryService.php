<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 8/24/24
 */

namespace Modules\Common\Query;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Modules\Admin\App\Models\Brand;
use Modules\Common\Base\ModelService;

class BrandQueryService extends ModelService
{

	const LIKE_FULL = ['name'];
    public static function getAll(Request $request, $items = null)
    {
        $items = Brand::query();
        return parent::getAll($request, $items);
    }

    public static function create(Request $request)
    {
        $dataInput = $request->all();
        $dataInput['slug']= Str::slug($request->name);
        return Brand::create($dataInput);
    }

    public static function update(Request $request, $id)
    {
        $dataInput = $request->all();
        $dataInput['slug']= Str::slug($request->name);
        return Brand::find($id)->update($dataInput);
    }

    public static function findById(Request $request, $id)
    {
        return Brand::find($id);
    }
}