<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 10/13/24
 */

namespace Modules\Common\Query;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Modules\Admin\App\Models\Slide;
use Modules\Common\Base\ModelService;

class SlideQueryService extends ModelService
{
    const LIKE_FULL = ['name'];
    public static function getAll(Request $request, $items = null)
    {
        $items = Slide::query();
        return parent::getAll($request, $items);
    }

    public static function create(Request $request)
    {
        $dataInput = $request->all();
        return Slide::create($dataInput);
    }

    public static function update(Request $request, $id)
    {
        $dataInput = $request->all();
        return Slide::find($id)->update($dataInput);
    }

    public static function findById(Request $request, $id)
    {
        return Slide::find($id);
    }
}