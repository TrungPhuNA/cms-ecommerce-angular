<?php

namespace Modules\Admin\App\Http\Controllers;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;
use Modules\Admin\App\Models\Category;

class AdminCategoryController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        $viewData = [
            'categories' => $categories
        ];
        return view('admin::pages.ecommerce.category.index', $viewData);
    }

    public function create()
    {
        return view('admin::pages.ecommerce.category.create');
    }

    public function store(Request $request)
    {
        $data = $request->except("_token","avatar","avatar_remove");
        $data["created_at"] = Carbon::now();
        $data["slug"] = Str::slug($request->name);
        Category::insert($data);
        return redirect()->route('admin.category.store');
    }

    public function edit(Request $request, $id)
    {
        $category = Category::find($id);
        $viewData = [
            'category' => $category
        ];
        return view('admin::pages.ecommerce.category.update', $viewData);
    }

    public function update(Request $request, $id)
    {
        $data = $request->except("_token","avatar","avatar_remove");
        $data["created_at"] = Carbon::now();
        $data["slug"] = Str::slug($request->name);
        Category::find($id)->update($data);
        return redirect()->route('admin.category.store');
    }
}
