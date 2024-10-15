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
        Schema::create('slides', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->tinyInteger('position')->default(1);
            $table->string('page')->default('home');
            $table->string('link')->nullable();
            $table->string('avatar')->nullable();
            $table->enum("status", ["published", "draft", "pending"])->default("pending");
            $table->timestamps();
        });
        $slides = [
            [
                "name" => "Sản phẩm thông minh",
                "description" => "Bộ sưu tập ưu đãi mùa đông 2024",
                "position" => 1,
                "page" => "home",
                "link" => "https://123code.net",
                "avatar" => "https://flone.jamstacktemplates.dev/assets/img/slider/single-slide-hm1-2.png",
                "created_at" => \Carbon\Carbon::now()
            ],
            [
                "name" => "Sản phẩm thông minh",
                "description" => "Bộ sưu tập ưu đãi mùa đông 2024",
                "position" => 1,
                "page" => "home",
                "link" => "https://123code.net",
                "avatar" => "https://flone.jamstacktemplates.dev/assets/img/slider/single-slide-hm1-2.png",
                "created_at" => \Carbon\Carbon::now()
            ],
        ];
        foreach ($slides as $item) {
            \Illuminate\Support\Facades\DB::table("slides")->insert($item);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('slides');
    }
};
