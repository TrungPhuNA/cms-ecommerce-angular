<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->string('currency')->default("VND");
            $table->string("name")->nullable();
            $table->string("avatar")->nullable();
            $table->text("description")->nullable();
            $table->boolean("is_default")->default(false);
            $table->enum("status",["active","inactive"])->default("active");
            $table->jsonb("config")->nullable();
            $table->timestamps();
        });
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('slug')->nullable();
            $table->string('avatar')->nullable();
            $table->string('icon')->nullable();
            $table->enum("status",["published","draft","pending"])->default("pending");
            $table->string('description')->nullable();
            $table->integer('parent_id')->default(0)->index();
            $table->string('title_seo')->nullable();
            $table->string('description_seo')->nullable();
            $table->string('keywords_seo')->nullable();
            $table->tinyInteger('index_seo')->default(1);
            $table->timestamps();
        });
        Schema::create('ec_products', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('slug')->nullable();
            $table->string('avatar')->nullable();
            $table->enum("status",["published","draft","pending"])->default("pending");
            $table->integer('number')->default(0);
            $table->integer('price')->default(0);
            $table->float("length")->nullable();
            $table->float("width")->nullable();
            $table->float("height")->nullable();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->timestamps();
        });
        Schema::create('ec_attributes', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('slug')->nullable();
            $table->tinyInteger('order')->default(0);
            $table->tinyInteger('is_use_in_product_listing')->default(0);
            $table->tinyInteger('use_image_from_product_variation')->default(0);
            $table->enum("status",["published","draft","pending"])->default("pending");
            $table->timestamps();
        });
        Schema::create('ec_attribute_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attribute_id')->constrained('ec_attributes')->onDelete('cascade');
            $table->tinyInteger('is_default')->default(0);
            $table->string('color')->nullable();
            $table->string('image')->nullable();
            $table->string('title')->nullable();
            $table->string('slug')->nullable();
            $table->timestamps();
        });
        Schema::create('ec_product_options', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('slug')->nullable();
            $table->tinyInteger('order')->default(0);
            $table->enum("status",["published","draft","pending"])->default("pending");
            $table->timestamps();
        });
        Schema::create('ec_product_options_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_option_id')->constrained('ec_product_options')->onDelete('cascade');
            $table->string('name')->nullable();
            $table->string('value')->nullable();
            $table->timestamps();
        });
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('ec_products')->onDelete('cascade');
            $table->integer('price');
            $table->integer('stock');
            $table->string('image')->nullable();
            $table->timestamps();
        });
        Schema::create('variant_attributes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('variant_id')->constrained('product_variants')->onDelete('cascade');
            $table->foreignId('attribute_value_id')->constrained('ec_attribute_values')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('ec_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('payment_method_id')->constrained('payment_methods');
            $table->string('code')->index()->unique();
            $table->bigInteger("total_shipping_fee")->default(0);
            $table->enum('payment_status',['pending','completed','refunding','refunded','fraud','failed'])->default("pending");
            $table->enum("status",["pending","processing","completed","canceled","returned"])->default("pending");
            $table->string("coupon_code")->nullable();
            $table->decimal("amount",total: 16, places: 2)->comment("Tổng tiền hàng");
            $table->decimal("shipping_amount",total: 16, places: 2)->comment("Tiền ship");
            $table->decimal("tax_amount",total: 16, places: 2)->comment("tiền thuế");
            $table->decimal("discount_amount",total: 16, places: 2)->comment("Tiền giảm giá");
            $table->decimal("sub_total",total: 16, places: 2)->comment("Tổng tiền");
            $table->dateTime('completed_at')->nullable();
            $table->text("notes")->nullable();
            $table->timestamps();
        });
        Schema::create('ec_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('ec_orders');
            $table->foreignId('product_id')->constrained('ec_products');
            $table->integer('qty')->default(1);
            $table->bigInteger("price")->default(0);
            $table->bigInteger("total_price")->default(0);
            $table->string("status")->nullable()->default("pending");
            $table->timestamps();
        });

        Schema::create('ec_stock_ins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('ec_products')->onDelete('cascade');
            $table->integer('quantity');
            $table->integer('price')->default(0)->nullable();
            $table->date('date');
            $table->timestamps();
        });

        Schema::create('ec_stock_outs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('ec_products')->onDelete('cascade');
            $table->integer('quantity');
            $table->integer('price')->default(0)->nullable();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('date');
            $table->timestamps();
        });

        $paymentsMethod = [
            [
                "currency" => "VND",
                "name" => "COD",
                "description" => "Nhận hàng thanh toán",
                "is_default" => true,
                "status" => "active",
                "created_at" => Carbon\Carbon::now()
            ]
        ];

        foreach ($paymentsMethod as $item) {
            \Illuminate\Support\Facades\DB::table("payment_methods")->insert($item);
        }

        $categories = ["Quần áo nam", "Quần áo nữ", "Đồ trẻ em", "Đồ thể thao", "Phụ kiện", "Đồng phục"];
        foreach ($categories as $category) {
            \Illuminate\Support\Facades\DB::table("categories")->insert([
                "name"       => $category,
                "slug"       => \Illuminate\Support\Str::slug($category),
                "created_at" => Carbon\Carbon::now()
            ]);
        }
        $products = [
            [
                "name"   => "Đồ Bộ Nam Phối Dây Dệt",
                "price"  => 200000,
                "avatar" => "https://m.yodycdn.com/fit-in/filters:format(webp)/products/bo-do-nam-phoi-day-det-yody-bdm7011-nau-2.jpg"
            ],
            [
                "name"  => "Áo Thu Đông Nữ Giữ Nhiệt Cổ Tròn",
                "price" => 199000,
                "avatar" => "https://m.yodycdn.com/fit-in/filters:format(webp)/products/ao-giu-nhiet-nu-ATN7019-CAM%20%20(1).jpg"
            ],
            [
                "name"  => "Áo Len Nữ Xẻ Tà Dáng Rộng Dệt Kẻ",
                "price" => 599000,
                "avatar" => "https://m.yodycdn.com/fit-in/filters:format(webp)/products/aln5010-tkd.jpg"
            ],
            [
                "name"  => "Đồ Bộ Nam Phối Dây Dệt",
                "price" => 699000,
                "avatar" => "https://m.yodycdn.com/fit-in/filters:format(webp)/products/bo-do-nam-phoi-day-det-yody-bdm7011-den-2.jpg"
            ],
        ];
        foreach ($products as $product) {
            \Illuminate\Support\Facades\DB::table("ec_products")->insert([
                "name"        => $product["name"],
                "slug"        => \Illuminate\Support\Str::slug($product['name']),
                "price"       => $product["price"],
                "avatar"      => $product["avatar"],
                "category_id" => \Illuminate\Support\Facades\DB::table("categories")->inRandomOrder()->first()->id,
                "created_at"  => Carbon\Carbon::now()
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variant_attributes');
        Schema::dropIfExists('ec_attribute_values');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('ec_product_options_values');
        Schema::dropIfExists('ec_product_options');
        Schema::dropIfExists('ec_attributes');
        Schema::dropIfExists('ec_stock_ins');
        Schema::dropIfExists('ec_stock_outs');
        Schema::dropIfExists('ec_transactions');
        Schema::dropIfExists('ec_orders');
        Schema::dropIfExists('ec_products');
        Schema::dropIfExists('payment_methods');
        Schema::dropIfExists('categories');
    }
};
