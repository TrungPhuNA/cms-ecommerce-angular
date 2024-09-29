<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Admin\App\Models\Product;

class TestController extends Controller
{
    public function showProductDetail($id)
    {
        // Load product with variants and their attributes
        $product = Product::with(['variants.variantAttributes.attributeValue.attribute'])
            ->findOrFail($id);

        return view('test.product_detail', compact('product'));
    }
}
