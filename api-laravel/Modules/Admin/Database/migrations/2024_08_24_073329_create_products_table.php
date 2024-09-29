<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('slug')->nullable();
            $table->string('avatar')->nullable();
            $table->string('icon')->nullable();
            $table->string('status')->nullable();
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
            $table->integer('number')->default(0);
            $table->integer('price')->default(0);
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
            $table->string('status')->default("active");
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
            $table->string('status')->default("active");
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variant_attributes');
        Schema::dropIfExists('ec_attribute_values');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('product_options_values');
        Schema::dropIfExists('product_options');
        Schema::dropIfExists('ec_attributes');
        Schema::dropIfExists('ec_stock_ins');
        Schema::dropIfExists('ec_stock_outs');
        Schema::dropIfExists('ec_products');
        Schema::dropIfExists('categories');
    }
};
