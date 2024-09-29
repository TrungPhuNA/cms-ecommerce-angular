<?php

namespace Modules\Admin\App\Http\Controllers;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;
use Modules\Admin\App\Models\Attribute;
use Modules\Admin\App\Models\AttributeValue;
use Modules\Admin\App\Models\Category;

class AdminAttributeController extends Controller
{
    public function index()
    {
        $attributes = Attribute::all();
        $viewData = [
            'attributes' => $attributes
        ];
        return view('admin::pages.ecommerce.attribute.index', $viewData);
    }

    public function create()
    {
        return view('admin::pages.ecommerce.attribute.create');
    }

    public function store(Request $request)
    {
        $data = $request->except("_token", "avatar", "avatar_remove");
        $data["created_at"] = Carbon::now();
        $data["slug"] = Str::slug($request->name);
        Attribute::insert($data);
        return redirect()->route('admin.attributes.store');
    }

    public function edit(Request $request, $id)
    {
        $attribute = Attribute::find($id);
        $attributeValues = AttributeValue::where("attribute_id", $id)->get();
        $viewData = [
            'attribute'       => $attribute,
            'attributeValues' => $attributeValues
        ];
        return view('admin::pages.ecommerce.attribute.update', $viewData);
    }

    public function show(Request $request, $id)
    {
        $attribute = Attribute::find($id);
        $attributeValues = AttributeValue::where("attribute_id", $id)->get();
        $viewData = [
            'attribute'       => $attribute,
            'attributeValues' => $attributeValues
        ];
        return view('admin::pages.ecommerce.attribute.update', $viewData);
    }

    public function update(Request $request, $id)
    {
        $data = $request->except("_token", "avatar", "avatar_remove");
        $data["created_at"] = Carbon::now();
        $data["slug"] = Str::slug($request->name);
        Attribute::find($id)->update($data);
        if ($request->title && !empty($request->title)) {
            $colors = $request->color;
            $ids = $request->ids;
            $images = $request->image;
            foreach ($request->title ?? [] as $key => $title) {
                $attributeValue = [
                    "attribute_id" => $id,
                    "is_default"   => 0,
                    "color"        => $colors[$key],
                    "image"        => $images[$key],
                    "title"        => $title,
                    "slug"         => Str::slug($title),
                    "created_at"   => Carbon::now()
                ];
                if(isset($ids[$key])) {
                    AttributeValue::find($ids[$key])->update($attributeValue);
                }else{
                    AttributeValue::create($attributeValue);
                }
            }
        }

        return redirect()->route('admin.attributes.index');
    }
}
