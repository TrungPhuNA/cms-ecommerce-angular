<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 8/24/24
 */

namespace Modules\Common\Query;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Modules\Admin\App\Models\Category;
use Modules\Common\Base\ModelService;

class CategoryQueryService extends ModelService
{

	const LIKE_FULL = ['name'];
    public static function getAll(Request $request, $items = null)
    {
        $items = Category::query();
        return parent::getAll($request, $items);
    }

    public static function create(Request $request)
    {
        $dataInput = $request->all();
        $dataInput['slug']= Str::slug($request->name);
        return Category::create($dataInput);
    }

    public static function update(Request $request, $id)
    {
        $dataInput = $request->all();
        $dataInput['slug']= Str::slug($request->name);
        return Category::find($id)->update($dataInput);
    }

    public static function findById(Request $request, $id)
    {
        return Category::find($id);
    }
}